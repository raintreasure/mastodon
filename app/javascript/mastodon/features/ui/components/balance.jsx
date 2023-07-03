import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import {Icon} from 'mastodon/components/icon';
import { toast } from 'react-hot-toast';

const mapStateToProps = state => ({
  new_balance: state.getIn(['balance', 'new_balance']),
  // balance_increment: state.getIn(['balance', 'new_balance', 'balance_increment']),
});

class Balance extends React.PureComponent {

  static propTypes = {
    new_balance: PropTypes.object,
    // balance_increment: PropTypes.number,
  };

  render() {
    const { new_balance } = this.props;

    if (new_balance && new_balance.balance_increment > 0) {
      toast.success('you will be reward ' + new_balance.balance_increment + '$CHINESE');
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
