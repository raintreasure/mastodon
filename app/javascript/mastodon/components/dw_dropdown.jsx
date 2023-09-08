import React from 'react';
import {connect} from 'react-redux';
import {defineMessages, injectIntl} from 'react-intl';
import PropTypes from 'prop-types';
import {Dropdown} from "antd";
import Button from "mastodon/components/button";
import DepositButton from "mastodon/features/ui/components/deposit_button";
import WithdrawButton from "mastodon/features/ui/components/withdraw_button";

const mapStateToProps = state => ({
  blockchain: state.getIn(['blockchain', 'chain']),
});

const messages = defineMessages({
  depositWithdraw: {id: 'balance.dw.title', defaultMessage: 'D/W'},
});

class DepositWithdrawButton extends React.PureComponent {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    blockchain: PropTypes.string,
  };
  static contextTypes = {
    identity: PropTypes.object.isRequired,
  };

  render() {
    const {new_balance, intl} = this.props;
    const {signedIn} = this.context.identity;

    const items = [
      {
        label: <DepositButton render_button={false}/>,
        key: '0',
      },
      {
        label: <WithdrawButton render_button={false} new_balance={new_balance}/>,
        key: '1',
      }
    ];

    return (
        <Dropdown
          menu={{items}}
          trigger={['click']}
          disabled={!signedIn}>
          <Button
            type='button'
            text={intl.formatMessage(messages.depositWithdraw)}
            title={intl.formatMessage(messages.depositWithdraw)}
          />
        </Dropdown>

    );
  }

}

export default connect(mapStateToProps)(injectIntl(DepositWithdrawButton));
