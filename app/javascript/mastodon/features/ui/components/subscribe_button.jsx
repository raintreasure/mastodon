import React from 'react';
import { connect } from 'react-redux';
import { defineMessages, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { me } from '../../../initial_state';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Button from '../../../components/button';
import { openModal } from '../../../actions/modal';
import api from '../../../api';

const mapStateToProps = state => ({
  account: state.getIn(['accounts', me]),
});

const toAccountNoAddress = 'The account you subscribe has no wallet address, you may remind the account owner to set wallet address';
const messages = defineMessages({
  title: { id: 'account.subscribe.title', defaultMessage: 'Subscribe' },
  text1: { id: 'account.subscribe.text_1', defaultMessage: 'You are subscribing ' },
  text2: { id: 'account.subscribe.text_2', defaultMessage: '. Subscription fee is ' },

  confirm: { id: 'account.subscribe.confirm', defaultMessage: 'Subscribe' },
  emptyConfirm: { id: 'account.subscribe.empty_confirm', defaultMessage: 'Confirm' },
  toAccountNoAddress: { id: 'account.subscribe.to_account_no_address', defaultMessage: toAccountNoAddress },
  providerNotReady: {
    id: 'account.subscribe.provider_not_ready',
    defaultMessage: 'Wallet address has not loaded, please try again or refresh the page',
  },
});

class SubscribeButton extends React.PureComponent {

  state = {
    loading: false,
  };
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    account: ImmutablePropTypes.map.isRequired,
    to_account: ImmutablePropTypes.map.isRequired,
  };
  static contextTypes = {
    identity: PropTypes.object.isRequired,
  };
  confirmModal = (intl, dispatch, to_account, messages) => {
    if (to_account.get('eth_address') === null || to_account.get('eth_address') === undefined) {
      dispatch(openModal('CONFIRM', {
        message:
  <p style={{ textAlign: 'left' }}>{intl.formatMessage(messages.toAccountNoAddress)}</p>,
        confirm: intl.formatMessage(messages.emptyConfirm),
        onConfirm: () => {
        },
      }));
    } else if (window.web3auth.provider) {
      dispatch(openModal('CONFIRM', {
        message:
  <div className={'subscription__modal'}>
    <span style={{ textAlign: 'center' }}>{intl.formatMessage(messages.text1) + to_account.get('username') +
                intl.formatMessage(messages.text2) + to_account.get('subscription_fee')}
    </span>
  </div>,
        confirm: intl.formatMessage(messages.confirm),
        onConfirm: async () => {
          this.setState({ loading: true });
          api().post(`/api/v1/accounts/${to_account.get('id')}/subscribe`).then(response => {
            console.log('subscribe res:', response);
          }).catch(e => {
            console.log('api call error:', e);
          });
          /*transferChinese(to_account.get('eth_address'), transferAmount).then(() => {
            api().post(`/api/v1/accounts/${id}/subscribe`).then(response => {
              dispatch(followAccountSuccess(response.data, alreadyFollowing));
              dispatch(updateBalance(response.data.new_balance, response.data.balance_increment));
            }).catch(error => {
              dispatch(followAccountFail(error, locked));
            });

              toast.success(`You have subscribed to ${to_account.get('username')}`);
            },
          ).catch((error) => {
            toast.error(`Failed to subscribe. ${error.message}`);
          });*/
        },
      }));
    } else {
      dispatch(openModal('CONFIRM', {
        message:
  <div style={{ textAlign: 'left' }}>
    <span>{intl.formatMessage(messages.providerNotReady)}</span>
  </div>,
        confirm: intl.formatMessage(messages.emptyConfirm),
        onConfirm: () => {
        },
      }));
    }
  };

  handleClick = () => {
    const { intl, dispatch, to_account } = this.props;
    this.confirmModal(intl, dispatch, to_account, messages);
  };

  render() {
    const { intl, account } = this.props;
    console.log('account info in subscribe: ', account);

    return (
      <div>
        {/*<input type={'number'}/>*/}
        <Button
          type='button'
          title={intl.formatMessage(messages.title)}
          text={intl.formatMessage(messages.title)}
          onClick={this.handleClick}
          disabled={this.state.loading}
        />
      </div>

    );
  }

}

export default connect(mapStateToProps)(injectIntl(SubscribeButton));
