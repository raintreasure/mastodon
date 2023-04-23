import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import {Icon} from 'mastodon/components/icon';
import { toast } from 'react-hot-toast';

const mapStateToProps = state => ({
  new_balance: state.getIn(['balance', 'new_balance']),
});

const defaultMessage = 'Withdraw ALL your $CHINESE to your wallet, you will receive 0.01 FSN for the first time withdraw.' +
  ' After withdraw, you can check your token at';
const messages = defineMessages({
  withdrawTitle: { id: 'balance.withdraw.title', defaultMessage: 'Withdraw' },
  withdrawingTitle: { id: 'balance.withdraw.withdrawing_title', defaultMessage: 'Withdrawing' },
  withdrawText: { id: 'balance.withdraw.text', defaultMessage: defaultMessage },
  confirmWithdraw: { id: 'balance.withdraw.confirm', defaultMessage: 'Confirm Withdraw' },
});

class Balance extends React.PureComponent {

  static propTypes = {
    new_balance: PropTypes.object,
    is_side_bar: PropTypes.bool.isRequired,
  };

  render() {
    const { new_balance, is_side_bar } = this.props;

    //Balance will be load into both sidebar and header, but toast should show once
    if (!is_side_bar && new_balance && new_balance.balance_increment > 0) {
      toast.success('you will receive a reward of ' + new_balance.balance_increment + '$CHINESE');
    }
    return (
      <div className='balance-text'>
        <div>
          <Icon id={'gift'} fixedWidth className='column-link__icon' />
          <span style={{ marginRight: '3px' }}>Balance: {new_balance ? new_balance.new_balance : 0}$CHINESE</span>
        </div>
      </div>
    );
  }

}

export default connect(mapStateToProps)(injectIntl(Balance));
