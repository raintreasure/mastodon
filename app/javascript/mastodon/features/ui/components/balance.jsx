import React from 'react';
import { connect } from 'react-redux';
import { defineMessages, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import Icon from 'mastodon/components/icon';
import { toast } from 'react-hot-toast';
import Button from '../../../components/button';
import { openModal } from '../../../actions/modal';
import api from '../../../api';
import { me } from '../../../initial_state';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { getEarnToken } from '../../../utils/multichain';

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

const defaultMessage = 'Withdraw ALL your {rewardToken} to your wallet, you will receive {airdropToken} for the first withdraw. After withdraw, you can check your token at';
const noAddrMessage = 'wallet address has not loaded, please try again or refresh the page';
const messages = defineMessages({
  withdrawTitle: { id: 'balance.withdraw.title', defaultMessage: 'Withdraw' },
  withdrawingTitle: { id: 'balance.withdraw.withdrawing_title', defaultMessage: 'Withdrawing' },
  withdrawText: { id: 'balance.withdraw.text', defaultMessage: defaultMessage },
  confirmWithdraw: { id: 'balance.withdraw.confirm', defaultMessage: 'Confirm Withdraw' },
  withdrawNoAddrText: { id: 'balance.withdraw.no_addr', defaultMessage: noAddrMessage },
  withdrawSetAddr: { id: 'balance.withdraw.empty_confirm', defaultMessage: 'Confirm' },
  withdrawSuccess: { id: 'balance.withdraw.success', defaultMessage: 'Your withdrawal has been successfully processed.' },
  withdrawFail: {
    id: 'balance.withdraw.fail',
    defaultMessage: 'Withdraw failed, please try again or contact sodappdev@gmail.com for help, error message: ',
  },
  willReward: { id: 'balance.reward.hint', defaultMessage: 'you will receive a reward of ' },

});

class Balance extends React.PureComponent {

  state = {
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
  withdraw = (intl, to_address) => {
    this.setState({ loading: true });
    api().get('/withdraw', {
      params: { to_address },
    }).then((res) => {
      console.log('withdraw res:', res);
      toast.success(intl.formatMessage(messages.withdrawSuccess));
      this.setState({ loading: false });
    }).catch(res => {
      console.error('withdraw error: ', res.response.data.error);
      toast.error(intl.formatMessage(messages.withdrawFail) +  res.response.data.error);
      this.setState({ loading: false });
    });
  };
  handleWithdrawClick = async () => {
    const { intl, dispatch } = this.props;
    const eth_address = this.props.account.get('eth_address');

    if (eth_address) {
      const link = getTokenUrl() + `${eth_address}`;
      dispatch(openModal('CONFIRM', {
        message:
  <div>
    <p style={{ textAlign: 'left' }}>{intl.formatMessage(messages.withdrawText, {
      rewardToken: getEarnToken(),
      airdropToken: getAirdropToken(),
    })}</p>
    <a href={link} target={'_blank'} style={{ wordWrap: 'break-word' }}>{link}</a>
  </div>,
        confirm: intl.formatMessage(messages.confirmWithdraw),
        link: 'test',
        onConfirm: () => {
          this.withdraw(intl, eth_address);
        },
      }));
    } else {
      dispatch(openModal('CONFIRM', {
        message:
  <div style={{ textAlign: 'left' }}>
    <span style={{ alignSelf: 'left' }}>{intl.formatMessage(messages.withdrawNoAddrText)}</span>
  </div>,
        confirm: intl.formatMessage(messages.withdrawSetAddr),
        onConfirm: () => {

        },
      }));
    }
  };

  componentDidUpdate(prevProps) {
    const { new_balance, is_side_bar, intl } = this.props;
    if (this.props.new_balance !== prevProps.new_balance) {
      //Balance will be load into both sidebar and header, but toast should show once
      if (!is_side_bar && new_balance && new_balance.balance_increment > 0) {
        toast.success(intl.formatMessage(messages.willReward) + new_balance.balance_increment + getEarnToken());
      }
    }
  }

  render() {
    const { new_balance, is_side_bar, intl } = this.props;
    let withdrawTitle = intl.formatMessage(messages.withdrawTitle);
    let withdrawingTitle = intl.formatMessage(messages.withdrawingTitle);

    return (
      <div
        className='balance-text' style={{
          display: 'flex', flexDirection: is_side_bar ? 'column' : 'row',
          alignItems: is_side_bar ? 'start' : 'center',
        }}
      >
        <div>
          <Icon id={'diamond'} fixedWidth className='column-link__icon' />
          <span
            style={{ marginRight: '3px' }}
          >Balance: {new_balance ? new_balance.new_balance : 0}{getEarnToken()}</span>
        </div>
        {is_side_bar &&
          <Button
            type='button'
            text={this.state.loading ? withdrawingTitle : withdrawTitle}
            title={withdrawTitle}
            onClick={this.handleWithdrawClick}
            disabled={this.state.loading}
          />
        }
        {!is_side_bar &&
          <button onClick={this.handleWithdrawClick} className='withdraw-href'>
            {this.state.loading ? withdrawingTitle : withdrawTitle}
          </button>
        }
      </div>
    );
  }

}

export default connect(mapStateToProps)(injectIntl(Balance));
