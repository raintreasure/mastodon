import React from 'react';
import { connect } from 'react-redux';
import { defineMessages, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import Icon from 'mastodon/components/icon';
import { toast } from 'react-hot-toast';
import Button from '../../../components/button';
import { openModal } from '../../../actions/modal';

const mapStateToProps = state => ({
  new_balance: state.getIn(['balance', 'new_balance']),
});

const messages = defineMessages({
  withdrawTitle: { id: 'balance.withdraw.title', defaultMessage: 'Withdraw' },
  confirmWithdraw: { id: 'balance.withdraw.confirm', defaultMessage: 'Confirm Withdraw' },
});

class Balance extends React.PureComponent {

  static propTypes = {
    new_balance: PropTypes.object,
    is_side_bar: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  handleWithdrawClick = () => {
    const { intl, dispatch } = this.props;
    dispatch(openModal('CONFIRM', {
      message: intl.formatMessage(messages.confirmWithdraw),
      confirm: intl.formatMessage(messages.confirmWithdraw),
      onConfirm: () => {
        // 在这里注入onConfirm函数
      },
    }));
  };

  render() {
    const { new_balance, is_side_bar, intl } = this.props;
    let withdrawTitle = intl.formatMessage(messages.withdrawTitle);

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
        <Button
          type='button'
          text={withdrawTitle}
          title={withdrawTitle}
          onClick={this.handleWithdrawClick}
          disabled={false}
        />
      </div>
    );
  }

}

export default connect(mapStateToProps)(injectIntl(Balance));
