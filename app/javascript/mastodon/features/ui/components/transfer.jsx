import React from 'react';
import { connect } from 'react-redux';
import { defineMessages, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { me } from '../../../initial_state';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Button from '../../../components/button';
import { transferModal } from '../../../actions/transfer';
import DropdownMenuContainer from '../../../containers/dropdown_menu_container';

const mapStateToProps = state => ({
  account: state.getIn(['accounts', me]),
  blockchain: state.getIn(['blockchain', 'chain']),
});

const messages = defineMessages({
  transferTitle: { id: 'account.transfer.title', defaultMessage: 'Transfer' },
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

  transferPQCModal = () => {
    const { intl, dispatch, to_account, blockchain } = this.props;
    transferModal(intl, dispatch, to_account, 'PQC', blockchain);
  };
  transferCHINESEModal = () => {
    const { intl, dispatch, to_account, blockchain } = this.props;
    transferModal(intl, dispatch, to_account, 'CHINESE', blockchain);
  };
  transferLOVEModal = () => {
    const { intl, dispatch, to_account, blockchain } = this.props;
    transferModal(intl, dispatch, to_account, 'LOVE', blockchain);
  };
  transferFaceDAOModal = () => {
    const { intl, dispatch, to_account, blockchain } = this.props;
    transferModal(intl, dispatch, to_account, 'FaceDAO', blockchain);
  };


  render() {
    const { intl } = this.props;
    const { signedIn } = this.context.identity;

    let menu = [
      { text: '$LOVE', action: this.transferLOVEModal },
      { text: '$FaceDAO', action: this.transferFaceDAOModal },
    ];

    return (
      <div>
        {process.env.REACT_APP_DAO === 'chinesedao' &&
          <Button
            type='button'
            text={intl.formatMessage(messages.transferTitle)}
            title={intl.formatMessage(messages.transferTitle)}
            onClick={this.transferCHINESEModal}
            disabled={!signedIn || this.state.loading}
          />
        }
        {process.env.REACT_APP_DAO === 'facedao' &&
          <DropdownMenuContainer
            disabled={!signedIn || this.state.loading}
            items={menu}
            title={intl.formatMessage(messages.transferTitle)}
            size={18}
          >
            <Button
              type='button'
              text={intl.formatMessage(messages.transferTitle)}
              title={intl.formatMessage(messages.transferTitle)}
            />
          </DropdownMenuContainer>
        }
        {process.env.REACT_APP_DAO === 'pqcdao' &&
          <Button
            type='button'
            text={intl.formatMessage(messages.transferTitle)}
            title={intl.formatMessage(messages.transferTitle)}
            onClick={this.transferPQCModal}
            disabled={!signedIn || this.state.loading}
          />
        }
      </div>

    );
  }

}

export default connect(mapStateToProps)(injectIntl(TransferToken));
