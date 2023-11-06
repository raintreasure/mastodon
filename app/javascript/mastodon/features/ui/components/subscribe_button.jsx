import React from 'react';
import {connect} from 'react-redux';
import {defineMessages, injectIntl} from 'react-intl';
import PropTypes from 'prop-types';
import {me} from '../../../initial_state';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Button from '../../../components/button';
import {closeModal, openModal} from '../../../actions/modal';
import {subscribeAccount, unsubscribeAccount} from '../../../actions/accounts';
import classNames from 'classnames';
import {transferERC20} from '../../../actions/transfer';
import {toast} from 'react-hot-toast';
import {getEarnToken} from "mastodon/utils/web3";
import {hasSetTokenFee, hasSetUSDFee} from "mastodon/utils/account";
import DropdownMenuContainer from "mastodon/containers/dropdown_menu_container";
import StripeElement from "mastodon/components/stripe_element";

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
  subscribeInToken: {id: 'account.subscribe.subscribe_in_token', defaultMessage: 'Subscribe in {token}'},
  subscribeInUSD: {id: 'account.subscribe.undo_confirm', defaultMessage: 'Subscribe in USD'},

});
const PAY_IN_TOKEN = 0;
const PAY_IN_USD = 1;

class SubscribeButton extends React.PureComponent {
  state = {
    loading: false,
  }
  static contextTypes = {
    identity: PropTypes.object,
  };
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
  payInUsdModal = (intl, dispatch, to_account) => {
    const subscriptionFeeInUSD = to_account.get('subscription_fee_usd');
    const toAccountId = to_account.get('id');
    console.log('subscription_fee_usd is ', subscriptionFeeInUSD);
    dispatch(openModal({
      modalType: 'CANCELABLE',
      modalProps: {
        message: (
          <div className={'flex_column_center'}>
            <p style={{textAlign: 'left'}}>
              {
                intl.formatMessage(messages.text1) + ' ' + to_account.get('username') +
                intl.formatMessage(messages.text2) + Math.round(subscriptionFeeInUSD * 100) / 100 + ' USD'
              }
            </p>
            <StripeElement feeInCent={Math.round(subscriptionFeeInUSD * 100)} dispatch={dispatch}
                           toAccountId={toAccountId}/>
          </div>
        ),

        confirm: intl.formatMessage(messages.confirm),
        onConfirm: async () => {
          this.setState({loading: true});
          const postUrl = `/api/v1/accounts/${toAccountId}/subscribe`;
          dispatch(subscribeAccount(postUrl, toAccountId));
          this.setState({loading: false});
        },
      }
    }));
  }

  unSubscribeModal = (intl, dispatch, to_account) => {
    const toAccountId = to_account.get('id');
    console.log('enter unsubscribeModal');
    dispatch(openModal({
      modalType: 'CONFIRM',
      modalProps: {
        message: (
          <div className={'flex_center'}>
            <span
              style={{textAlign: 'center'}}>{intl.formatMessage(messages.undoText1) + ' ' + to_account.get('username') +
              intl.formatMessage(messages.undoText2)}
            </span>
          </div>
        ),
        confirm: intl.formatMessage(messages.undoConfirm),
        onConfirm: async () => {
          this.setState({loading: true});
          const postUrl = `/api/v1/accounts/${toAccountId}/unsubscribe`
          dispatch(unsubscribeAccount(postUrl, toAccountId));
          this.setState({loading: false});
        },
      }
    }));

  }

  payInTokenModal = (intl, dispatch, to_account, blockchain) => {
    const eth_address = to_account.get('eth_address');
    const toAccountId = to_account.get('id');
    const subscriptionFee = to_account.get('subscription_fee');
    // console.log('subscription_fee is ', subscriptionFee);

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
            <div className={'flex_center'}>
            <span style={{textAlign: 'center'}}>
              {
                intl.formatMessage(messages.text1) + ' ' + to_account.get('username') +
                intl.formatMessage(messages.text2) + subscriptionFee + getEarnToken()
              }
            </span>
            </div>
          ),
          confirm: intl.formatMessage(messages.confirm),
          onConfirm: async () => {
            this.setState({loading: true});
            transferERC20(getEarnToken(), eth_address, subscriptionFee, blockchain, dispatch).then(() => {
              const postUrl = `/api/v1/accounts/${toAccountId}/subscribe`;
              dispatch(subscribeAccount(postUrl, toAccountId));
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

  openSubscribeModal = (method) => {
    // console.log('payment method is ', method);
    const {intl, dispatch, to_account, blockchain} = this.props;
    if (method === PAY_IN_TOKEN) {
      console.log('payment method is token', typeof method);
      this.payInTokenModal(intl, dispatch, to_account, blockchain, method);
    } else if (method === PAY_IN_USD) {
      console.log('payment method is usd', typeof method);
      this.payInUsdModal(intl, dispatch, to_account);
    }
  };

  render() {
    const {intl, subscribing, to_account, dispatch} = this.props;
    const {signedIn} = this.context.identity;
    const menu = [];
    if (hasSetTokenFee(to_account)) {
      menu.push({
        text: intl.formatMessage(messages.subscribeInToken, {token: getEarnToken()}),
        action: () => this.openSubscribeModal(PAY_IN_TOKEN),
      });
    }
    if (hasSetUSDFee(to_account)) {
      menu.push({
        text: intl.formatMessage(messages.subscribeInUSD),
        action: () => this.openSubscribeModal(PAY_IN_USD),
      });
    }


    return (
      <div>
        {!subscribing &&
          <DropdownMenuContainer
            disabled={!signedIn || this.state.loading}
            items={menu}
            title={intl.formatMessage(messages.title)}
            size={18}
          >
            <Button
              type='button'
              title={intl.formatMessage(messages.title)}
              text={intl.formatMessage(messages.title)}
              // onClick={this.handleClick}
              className={classNames('logo-button', {
                'button--destructive': subscribing,
              })}
              disabled={this.state.loading || !signedIn}
            />
          </DropdownMenuContainer>}
        {subscribing &&
          <Button onClick={() => this.unSubscribeModal(intl, dispatch, to_account)} type={'button'}
                  title={intl.formatMessage(messages.undoTitle)}
                  text={intl.formatMessage(messages.undoTitle)} className={'logo-button button--destructive'}></Button>
        }
      </div>

    );
  }
}

export default connect(mapStateToProps)(injectIntl(SubscribeButton));
