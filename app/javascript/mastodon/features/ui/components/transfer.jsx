import React from 'react';
import { connect } from 'react-redux';
import { defineMessages, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { me } from '../../../initial_state';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Button from '../../../components/button';
import { transferModal } from '../../../actions/tokens';

const mapStateToProps = state => ({
  account: state.getIn(['accounts', me]),
});

const noAddrMessage = 'wallet address has not loaded, please try again or refresh the page';
const toAccountNoAddress = 'The account you transferred to has no wallet address, you may remind the account owner to set wallet address';
const messages = defineMessages({
  transferTitle: { id: 'account.transfer.title', defaultMessage: 'Transfer $CHINESE' },
  transferText: { id: 'account.transfer.text', defaultMessage: 'You are transferring $CHINESE to ' },
  transferConfirm: { id: 'account.transfer.confirm', defaultMessage: 'Transfer' },
  transferWeb2LoggedIn: { id: 'account.transfer.web2_logged_in', defaultMessage: noAddrMessage },
  transferWeb2Logout: { id: 'account.transfer.web2_logout', defaultMessage: 'Log out' },
  transferEmptyConfirm: { id: 'account.transfer.empty_confirm', defaultMessage: 'Confirm' },
  transferToAccountNoAddress: { id: 'account.transfer.to_account_no_address', defaultMessage: toAccountNoAddress },
});

class TransferToken extends React.PureComponent {

  state = {
    loading: false,
  };
  static propTypes = {
    new_balance: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    account: ImmutablePropTypes.map.isRequired,
    to_account: ImmutablePropTypes.map.isRequired,
  };
  static contextTypes = {
    identity: PropTypes.object.isRequired,
  };

  handleClick = () => {
    const { intl, dispatch, to_account } = this.props;
    transferModal(intl, dispatch, to_account, messages);
  };

  render() {
    const { intl } = this.props;
    return (
      <div>
        {/*<input type={'number'}/>*/}
        <Button
          type='button'
          text={intl.formatMessage(messages.transferTitle)}
          title={intl.formatMessage(messages.transferTitle)}
          onClick={this.handleClick}
          disabled={this.state.loading}
        />
      </div>

    );
  }

}

export default connect(mapStateToProps)(injectIntl(TransferToken));
