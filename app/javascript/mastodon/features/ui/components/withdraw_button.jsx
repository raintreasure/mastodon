import {connect} from "react-redux";
import {defineMessages, injectIntl} from "react-intl";
import {me} from "mastodon/initial_state";
import React from "react";
import PropTypes from "prop-types";
import ImmutablePropTypes from "react-immutable-proptypes";
import Button from "mastodon/components/button";
import {openModal} from "mastodon/actions/modal";
import {
  getAmountWithDecimals,
  getEarnToken,
  getNativeToken, getNativeTokenDecimals, getTokenUrl,
  getWeb3Intance,
  GWei
} from "mastodon/utils/web3";
import api from "mastodon/api";
import {toast} from "react-hot-toast";
import {getGasAmountForTransfer, getGasPrice, getWithdrawContractAddr} from "mastodon/actions/blockchain";
import BigNumber from "bignumber.js";


const mapStateToProps = state => ({
  account: state.getIn(['accounts', me]),
  blockchain: state.getIn(['blockchain', 'chain']),
});
const defaultMessage = 'To withdraw ALL your {rewardToken} to your wallet, you need to pay {gasValue} ${nativeToken} as gas fee. After withdraw, you can check your token at';
const noAddrMessage = 'wallet address has not loaded, please try again or refresh the page';
const messages = defineMessages({
  withdrawTitle: {id: 'balance.withdraw.title', defaultMessage: 'Withdraw'},
  withdrawingTitle: {id: 'balance.withdraw.withdrawing_title', defaultMessage: 'Withdrawing'},
  loadingTitle: {id: 'balance.withdraw.loading_title', defaultMessage: 'Loading'},
  withdrawText: {id: 'balance.withdraw.text', defaultMessage: defaultMessage},
  confirmWithdraw: {id: 'balance.withdraw.confirm', defaultMessage: 'Confirm Withdraw'},
  withdrawNoAddrText: {id: 'balance.withdraw.no_addr', defaultMessage: noAddrMessage},
  withdrawSetAddr: {id: 'balance.withdraw.empty_confirm', defaultMessage: 'Confirm'},
  withdrawSuccess: {id: 'balance.withdraw.success', defaultMessage: 'Your withdrawal has been successfully processed.'},
  withdrawFail: {
    id: 'balance.withdraw.fail',
    defaultMessage: 'Withdraw failed, please try again or contact twitter@{twitterAccount} for help, error message: ',
  },
  insufficientGas: {
    id: 'balance.withdraw.insufficientgas',
    defaultMessage: 'Failed to send gas because of insufficient {token} balance, deposit some {token} first or contact twitter@{twitterAccount} for help',
  },
});

class WithdrawButton extends React.PureComponent {
  state = {
    withdrawing: false,
    loading: false,
    gasPrice: -1,
    gasAmount: -1,
  };

  static propTypes = {
    new_balance: PropTypes.object,
    is_side_bar: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    account: ImmutablePropTypes.map.isRequired,
    blockchain: PropTypes.string,
  };
  static contextTypes = {
    identity: PropTypes.object.isRequired,
  };
  getTwitterAccount = () => {
    switch (process.env.REACT_APP_DAO) {
      case 'chinesedao':
        return 'chinesedao';
      case 'facedao':
        return 'facedaocom';
      case 'lovedao':
        return 'lovedao';
      case 'pqcdao':
        return 'pqcdao';
      default:
        return 'chinesedao';
    }
  }

  withdraw = (intl, to_address, gas_price, blockchain) => {
    api().get('/withdraw', {
      params: {to_address, gas_price, blockchain},
    }).then(() => {
      toast.success(intl.formatMessage(messages.withdrawSuccess));
      this.setState({withdrawing: false});
    }).catch(res => {
      console.error('withdraw error: ', res.response.data.error);
      toast.error(intl.formatMessage(messages.withdrawFail, {twitterAccount: this.getTwitterAccount()}) + res.response.data.error);
      this.setState({withdrawing: false});
    });
  };

  openWithdrawModal = (eth_address, withdrawDipositValue, withdrawDipositValueInWei, gasPrice) => {
    const {intl, dispatch, blockchain} = this.props;
    const web3 = getWeb3Intance()
    const link = getTokenUrl(blockchain) + `${eth_address}`;
    dispatch(openModal({
      modalType: 'CONFIRM',
      modalProps: {
        message: (
          <div>
            <p style={{textAlign: 'left'}}>{intl.formatMessage(messages.withdrawText, {
              rewardToken: getEarnToken(),
              gasValue: withdrawDipositValue,
              nativeToken: getNativeToken(blockchain),
            })}</p>
            <a href={link} target={'_blank'} style={{wordWrap: 'break-word'}}>{link}</a>
          </div>),
        confirm: intl.formatMessage(messages.confirmWithdraw),
        onConfirm: () => {
          this.setState({withdrawing: true});
          // this.withdraw(intl, eth_address, gasPrice, blockchain);
          // return;
          web3.eth.sendTransaction(
            {
              from: eth_address,
              to: process.env.REACT_APP_BUFFER_ACCOUNT,
              value: withdrawDipositValueInWei,
              gasPrice: gasPrice * GWei,
            }).then(receipt => {
            web3.eth.getTransaction(receipt.transactionHash)
              .then(transaction => {
                if (transaction.value.toString() === withdrawDipositValueInWei) {
                  this.withdraw(intl, eth_address, gasPrice, blockchain);
                }
              }).catch(e => {
              console.log('get transaction error:', e);
              this.setState({withdrawing: false});
            });
          }).catch((e) => {
            if (e && e.data && e.data.message.includes('insufficient funds')) {
              toast.error(intl.formatMessage(messages.insufficientGas, {
                token: getNativeToken(),
                twitterAccount: this.getTwitterAccount()
              }));
            } else {
              toast.error(intl.formatMessage(messages.withdrawFail, {twitterAccount: this.getTwitterAccount()}) + this.parseError(e));
            }
            this.setState({withdrawing: false});
          });
        },
      }
    }));
  };
  parseError = (e) => {
    if (!e) {
      return ""
    }
    if (e.message) {
      return e.message
    }
    if (e.data) {
      return e.data.message
    }
  }

  componentDidMount() {
    const {blockchain, account} = this.props;
    const eth_address = account.get('eth_address');

    getGasPrice(blockchain)().then(price => {
      // console.log('gas price when component mounted:', price)
      this.setState({gasPrice: price})
    })
    getGasAmountForTransfer(process.env.REACT_APP_BUFFER_ACCOUNT, eth_address,
      getAmountWithDecimals(10000, getEarnToken()),
      getWithdrawContractAddr(blockchain)).then(amount => {
      // console.log('gas amount when component mounted:', amount)
      this.setState({gasAmount: amount})
    })
  }

  handleWithdrawClick = async () => {
    if (this.state.loading || this.state.withdrawing) {
      return
    }
    const {intl, dispatch, new_balance, blockchain} = this.props;
    const eth_address = this.props.account.get('eth_address');
    let gasValue = '0.001';
    let gasValueInWei = '1000000000000000';
    let gasPrice = '3';

    if (eth_address) {
      this.setState({loading: true});

      let getGasPricePromise, getGasAmountPromise;
      if (this.state.gasPrice !== -1 && this.state.gasAmount !== -1) {
        getGasPricePromise = new Promise(resolve => resolve(this.state.gasPrice));
        getGasAmountPromise = new Promise(resolve => resolve(this.state.gasAmount));
      } else {
        getGasPricePromise = getGasPrice(blockchain)();
        getGasAmountPromise = getGasAmountForTransfer(process.env.REACT_APP_BUFFER_ACCOUNT, eth_address,
          getAmountWithDecimals(new_balance.new_balance, getEarnToken()),
          getWithdrawContractAddr(blockchain));
      }
      Promise.all([getGasAmountPromise, getGasPricePromise]).then(([gasAmount, proposePrice]) => {
        gasPrice = proposePrice;
        // console.log('gas price is:', gasPrice, ' gas amount is :', gasAmount);
        gasValueInWei = new BigNumber(gasAmount).multipliedBy(gasPrice).multipliedBy(GWei);
        // console.log('gasValueInWei:', gasValueInWei);
        gasValue = gasValueInWei.dividedBy(getNativeTokenDecimals()).toString();
        // console.log('gasValue:', gasValue);
        this.openWithdrawModal(eth_address, gasValue, gasValueInWei.toFixed(0), gasPrice);
      }).catch(e => {
        console.log(e);
      }).finally(() => {
        this.setState({loading: false});
      });
    } else {
      dispatch(openModal({
        modalType: 'CONFIRM',
        modalProps: {
          message:
            <div style={{textAlign: 'left'}}>
              <span style={{alignSelf: 'left'}}>{intl.formatMessage(messages.withdrawNoAddrText)}</span>
            </div>,
          confirm: intl.formatMessage(messages.withdrawSetAddr),
          onConfirm: () => {
          },
        }
      }));
    }
  };


  render() {
    const {intl, is_side_bar} = this.props;
    let withdrawTitle = intl.formatMessage(messages.withdrawTitle);
    let withdrawingTitle = intl.formatMessage(messages.withdrawingTitle);
    let loadingTitle = intl.formatMessage(messages.loadingTitle);
    return (
      <>
        {is_side_bar &&
          <Button
            type='button'
            text={this.state.loading ? loadingTitle : (this.state.withdrawing ? withdrawingTitle : withdrawTitle)}
            title={withdrawTitle}
            onClick={this.handleWithdrawClick}
            disabled={this.state.loading || this.state.withdrawing}
          />
        }
        {!is_side_bar &&
          <p onClick={() => this.handleWithdrawClick()}>{intl.formatMessage(messages.withdrawTitle)}</p>
        }
      </>
    );
  }
}

export default connect(mapStateToProps)(injectIntl(WithdrawButton));

