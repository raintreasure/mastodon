import React from 'react';
import {connect} from 'react-redux';
import {defineMessages, injectIntl} from 'react-intl';
import PropTypes from 'prop-types';
import {me} from '../../../initial_state';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Button from '../../../components/button';
import {openModal} from '../../../actions/modal';
import {subscribeAccount, unsubscribeAccount} from '../../../actions/accounts';
import classNames from 'classnames';
import {transferERC20} from '../../../actions/transfer';
import {toast} from 'react-hot-toast';

const mapStateToProps = state => ({
  account: state.getIn(['accounts', me]),
  blockchain: state.getIn(['blockchain', 'chain']),
});

const toAccountNoAddress = 'The account you subscribe has no wallet address, you may remind the account owner to set wallet address';
const messages = defineMessages({
  title: {id: 'account.subscribe.title', defaultMessage: 'Subscribe'},
  text1: {id: 'account.subscribe.text_1', defaultMessage: 'You are subscribing '},
  text2: {id: 'account.subscribe.text_2', defaultMessage: '. Subscription fee is '},
  confirm: {id: 'account.subscribe.confirm', defaultMessage: 'Subscribe'},
  emptyConfirm: {id: 'account.subscribe.empty_confirm', defaultMessage: 'Confirm'},
  toAccountNoAddress: {id: 'account.subscribe.to_account_no_address', defaultMessage: toAccountNoAddress},
  providerNotReady: {
    id: 'account.subscribe.provider_not_ready',
    defaultMessage: 'Wallet address has not loaded, please try again or refresh the page',
  },
  undoTitle: {id: 'account.subscribe.undo_title', defaultMessage: 'Unsubscribe'},
  undoText1: {id: 'account.subscribe.undo_text_1', defaultMessage: 'You are unsubscribing '},
  undoText2: {id: 'account.subscribe.undo_text_2', defaultMessage: '. Your subscription fee will not be returned'},
  undoConfirm: {id: 'account.subscribe.undo_confirm', defaultMessage: 'Unsubscribe'},
});

class SubscribeButton extends React.PureComponent {


  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    account: ImmutablePropTypes.map.isRequired,
    to_account: ImmutablePropTypes.map.isRequired,
    subscribing: PropTypes.bool,
  };
  static contextTypes = {
    identity: PropTypes.object.isRequired,
  };
  confirmModal = (intl, dispatch, to_account, messages, subscribing, blockchain) => {
    const eth_address = to_account.get('eth_address');
    const toAccountId = to_account.get('id');
    const subscriptionFee = to_account.get('subscription_fee');
    if (eth_address === null || eth_address === undefined) {
      dispatch(openModal({
        modalType: 'CONFIRM',
        modalProps: {
          message:
            (<p style={{textAlign: 'left'}}>{intl.formatMessage(messages.toAccountNoAddress)}</p>),
          confirm: intl.formatMessage(messages.emptyConfirm),
          onConfirm: () => {
          },
        }
      }));
    } else if (window.web3auth.provider) {
      dispatch(openModal({
        modalType: 'CONFIRM',
        modalProps: {
          message: (
            <div className={'subscription__modal'}>
            <span style={{textAlign: 'center'}}>{
              (subscribing ? intl.formatMessage(messages.undoText1) : intl.formatMessage(messages.text1)) +
              to_account.get('username') +
              (subscribing ? intl.formatMessage(messages.undoText2) : (intl.formatMessage(messages.text2) + subscriptionFee))
            }
            </span>
            </div>
          ),
          confirm: subscribing ? intl.formatMessage(messages.undoConfirm) : intl.formatMessage(messages.confirm),
          onConfirm: async () => {
            this.setState({loading: true});
            transferERC20(eth_address, subscriptionFee, blockchain, dispatch).then(() => {
              const postUrl = subscribing ? `/api/v1/accounts/${toAccountId}/unsubscribe` :
                `/api/v1/accounts/${toAccountId}/subscribe`;
              if (subscribing) {
                dispatch(subscribeAccount(postUrl, toAccountId));
              } else {
                dispatch(unsubscribeAccount(postUrl, toAccountId));
              }
            }).catch(error => {
              toast.error(`Subscription failed. ${error}`);
            }).finally(() => {
              this.setState({loading: false});
            });

          },
        }
      }));
    } else {
      dispatch(openModal({
        modalType: 'CONFIRM',
        modalProps: {
          message:
            <div style={{textAlign: 'left'}}>
              <span>{intl.formatMessage(messages.providerNotReady)}</span>
            </div>,
          confirm: intl.formatMessage(messages.emptyConfirm),
          onConfirm: () => {
          },
        }
      }));
    }
  };

  testHandleSubscription = (subscribing, to_account, dispatch) => {
    const toAccountId = to_account.get('id');
    const postUrl = subscribing ? `/api/v1/accounts/${toAccountId}/unsubscribe` :
      `/api/v1/accounts/${toAccountId}/subscribe`;
    if (subscribing) {
      dispatch(subscribeAccount(postUrl, toAccountId));
    } else {
      dispatch(unsubscribeAccount(postUrl, toAccountId));
    }
  }

  handleClick = () => {
    const {intl, dispatch, to_account, subscribing, blockchain} = this.props;
    // this.confirmModal(intl, dispatch, to_account, messages, subscribing, blockchain);
    this.testHandleSubscription(subscribing, to_account, dispatch)
  };

  render() {
    const {intl, subscribing} = this.props;
    return (
      <div>
        <Button
          type='button'
          title={subscribing ? intl.formatMessage(messages.undoTitle) : intl.formatMessage(messages.title)}
          text={subscribing ? intl.formatMessage(messages.undoTitle) : intl.formatMessage(messages.title)}
          onClick={this.handleClick}
          className={classNames('logo-button', {
            'button--destructive': subscribing,
          })}
        />
      </div>

    );
  }

}

export default connect(mapStateToProps)(injectIntl(SubscribeButton));
