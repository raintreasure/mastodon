import React from 'react';
import {connect} from 'react-redux';
import {injectIntl, defineMessages} from 'react-intl';
import PropTypes from 'prop-types';
import {Icon} from 'mastodon/components/icon';
import {toast} from 'react-hot-toast';
import Button from '../../../components/button';
import {openModal} from '../../../actions/modal';
import api from '../../../api';
import {me} from '../../../initial_state';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {getAmountWithDecimals, getEarnToken, getNativeToken, getNativeTokenDecimals, GWei} from '../../../utils/web3';
import {getGasAmountForTransfer, getGasPrice} from '../../../actions/blockchain';
import BigNumber from 'bignumber.js';

const mapStateToProps = state => ({
  new_balance: state.getIn(['balance', 'new_balance']),
  account: state.getIn(['accounts', me]),
});

export const getAirdropToken = () => {
  switch (process.env.REACT_APP_DAO) {
    case 'chinesedao':
      return '0.1 POL';
    case 'facedao':
      return '0.001 BNB';
    default:
      return '0.1 POL';
  }
};
export const getTokenUrl = () => {
  switch (process.env.REACT_APP_DAO) {
    case 'chinesedao':
      return 'https://polygonscan.com/tokenholdings?a=';
    case 'facedao':
      return 'https://bscscan.com/tokenholdings?a=';
    default:
      return 'https://polygonscan.com/tokenholdings?a=';
  }
};

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
    defaultMessage: 'Withdraw failed, please try again or contact twitter@facedaocom for help, error message: ',
  },
  willReward: {id: 'balance.reward.hint', defaultMessage: 'you will receive a reward of '},

});

class Balance extends React.PureComponent {
  state = {
    withdrawing: false,
    loading: false,
  };

  static propTypes = {
    new_balance: PropTypes.object,
    is_side_bar: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    account: ImmutablePropTypes.map.isRequired,
  };
  static contextTypes = {
    identity: PropTypes.object.isRequired,
  };
  withdraw = (intl, to_address, gas_price) => {
    api().get('/withdraw', {
      params: {to_address, gas_price},
    }).then(() => {
      toast.success(intl.formatMessage(messages.withdrawSuccess));
      this.setState({withdrawing: false});
    }).catch(res => {
      console.error('withdraw error: ', res.response.data.error);
      toast.error(intl.formatMessage(messages.withdrawFail) + res.response.data.error);
      this.setState({withdrawing: false});
    });
  };
  getWithdrawContractAddr = () => {
    switch (process.env.REACT_APP_DAO) {
      case 'chinesedao':
        return process.env.REACT_APP_CHINESE_CONTRACT_ADDRESS;
      case 'facedao':
        return process.env.REACT_APP_LOVE_CONTRACT_ADDRESS;
      default:
        return process.env.REACT_APP_CHINESE_CONTRACT_ADDRESS;
    }
  };
  openWithdrawModal = (eth_address, withdrawDipositValue, withdrawDipositValueInWei, gasPrice) => {
    const {intl, dispatch} = this.props;
    const Web3 = require('web3');
    const web3 = new Web3(window.web3auth.provider);
    const link = getTokenUrl() + `${eth_address}`;
    dispatch(openModal({
      modalType: 'CONFIRM',
      modalProps: {
        message: (
          <div>
            <p style={{textAlign: 'left'}}>{intl.formatMessage(messages.withdrawText, {
              rewardToken: getEarnToken(),
              gasValue: withdrawDipositValue,
              nativeToken: getNativeToken(),
            })}</p>
            <a href={link} target={'_blank'} style={{wordWrap: 'break-word'}}>{link}</a>
          </div>),
        confirm: intl.formatMessage(messages.confirmWithdraw),
        onConfirm: () => {
          this.setState({withdrawing: true});
          // this.withdraw(intl, eth_address, gasPrice);
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
                  this.withdraw(intl, eth_address, gasPrice);
                }
              }).catch(e => {
              console.log('get transaction error:', e);
            });
          }).catch((e) => {
            console.log('send transaction error:', e);
            this.setState({withdrawing: false});
          });
        },
      }
    }));
  };
  getGas;
  handleWithdrawClick = async () => {

    const {intl, dispatch, new_balance} = this.props;
    const eth_address = this.props.account.get('eth_address');
    let gasValue = '0.001';
    let gasValueInWei = '1000000000000000';
    let gasPrice = '3';
    if (eth_address) {
      this.setState({loading: true});
      const getGasAmountPromise = getGasAmountForTransfer(process.env.REACT_APP_BUFFER_ACCOUNT, eth_address,
        getAmountWithDecimals(new_balance.new_balance, getEarnToken()),
        this.getWithdrawContractAddr());
      const getGasPricePromise = getGasPrice()();
      Promise.all([getGasAmountPromise, getGasPricePromise]).then(([gasAmount, proposePrice]) => {
        gasPrice = proposePrice;
        gasValueInWei = new BigNumber(gasAmount).multipliedBy(gasPrice).multipliedBy(GWei);
        gasValue = gasValueInWei.dividedBy(getNativeTokenDecimals()).toString();
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

  componentDidUpdate(prevProps) {
    const {new_balance, is_side_bar, intl} = this.props;
    if (this.props.new_balance !== prevProps.new_balance) {
      //Balance will be load into both sidebar and header, but toast should show once
      if (!is_side_bar && new_balance && new_balance.balance_increment > 0) {
        toast.success(intl.formatMessage(messages.willReward) + new_balance.balance_increment + getEarnToken());
      }
    }
  }

  render() {
    const {new_balance, is_side_bar, intl} = this.props;
    let withdrawTitle = intl.formatMessage(messages.withdrawTitle);
    let withdrawingTitle = intl.formatMessage(messages.withdrawingTitle);
    let loadingTitle = intl.formatMessage(messages.loadingTitle);

    return (
      <div className='balance-text' style={{
        display: 'flex', flexDirection: is_side_bar ? 'column' : 'row',
        alignItems: is_side_bar ? 'start' : 'center',
      }}>
        <div>
          <Icon id={'diamond'} fixedWidth className='column-link__icon'/>
          <span
            style={{marginRight: '3px'}}
          >Balance: {new_balance ? new_balance.new_balance : 0}${getEarnToken()}</span>
        </div>
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
          <button
            onClick={this.handleWithdrawClick} className='withdraw-href'
            disabled={this.state.loading || this.state.withdrawing}
          >
            {this.state.loading ? loadingTitle : (this.state.withdrawing ? withdrawingTitle : withdrawTitle)}
          </button>
        }
      </div>
    );
  }

}

export default connect(mapStateToProps)(injectIntl(Balance));
