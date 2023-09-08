import React from 'react';
import {connect} from 'react-redux';
import {injectIntl, defineMessages} from 'react-intl';
import PropTypes from 'prop-types';
import {Icon} from 'mastodon/components/icon';
import {toast} from 'react-hot-toast';
import {getEarnToken} from '../../../utils/web3';
import BlockchainSelector from "mastodon/features/ui/components/blockchain_selector";
import DepositButton from "mastodon/features/ui/components/deposit_button";
// import {IconButton} from "mastodon/components/icon_button";
import {Dropdown} from 'antd';
import WithdrawButton from "mastodon/features/ui/components/withdraw_button";
import Button from "mastodon/components/button";
import ExchangeButton from "mastodon/components/exchange_button";

const mapStateToProps = state => ({
  new_balance: state.getIn(['balance', 'new_balance']),
});

const messages = defineMessages({
  willReward: {id: 'balance.reward.hint', defaultMessage: 'you will receive a reward of '},
  depositWithdraw: {id: 'balance.dw.title', defaultMessage: 'D/W'},
});

class Balance extends React.PureComponent {
  static propTypes = {
    new_balance: PropTypes.object,
    is_side_bar: PropTypes.bool.isRequired,
    intl: PropTypes.object.isRequired,
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
    const items = [
      {
        label: <DepositButton is_side_bar={false}/>,
        key: '0',
      },
      {
        label: <WithdrawButton is_side_bar={false} new_balance={new_balance}/>,
        key: '1',
      }
    ];
    return (
      <div className='balance-text' style={{
        display: 'flex', flexDirection: is_side_bar ? 'column' : 'row',
        alignItems: is_side_bar ? 'start' : 'center', gap: 10,
      }}>
        {process.env.REACT_APP_DAO === 'lovedao' &&
          <BlockchainSelector is_side_bar={is_side_bar}/>
        }
        <div className={is_side_bar ? 'balance_span_sidebar' : 'balance_span'}>
          {is_side_bar && <Icon id={'diamond'} fixedWidth className='column-link__icon'/>}
          <span
            style={{marginRight: '1px', fontSize: is_side_bar ? 'medium' : 'smaller'}}>
          Balance: {new_balance ? new_balance.new_balance : 0} {getEarnToken()}
          </span>
        </div>

        {is_side_bar &&
          <div>
            <DepositButton is_side_bar={true}/>
            <WithdrawButton is_side_bar={true} new_balance={new_balance}/>
          </div>
        }
        {!is_side_bar &&
          <div style={{display:'flex', flexDirection:'row', gap:3 }}>
            <Dropdown
              menu={{items}}
              trigger={['click']}>
              {/*<IconButton icon={'bars'} title={'operations'}/>*/}
              <Button
                type='button'
                text={intl.formatMessage(messages.depositWithdraw)}
                title={intl.formatMessage(messages.depositWithdraw)}
              />

            </Dropdown>
            <ExchangeButton/>
          </div>
        }
      </div>
    );
  }

}

export default connect(mapStateToProps)(injectIntl(Balance));
