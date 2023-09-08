import {connect} from "react-redux";
import {defineMessages, injectIntl} from "react-intl";
import {me} from "mastodon/initial_state";
import React from "react";
import PropTypes from "prop-types";
import ImmutablePropTypes from "react-immutable-proptypes";
import Button from "mastodon/components/button";
import {openModal} from "mastodon/actions/modal";
import {getAbbrBlockchain, getEarnToken} from "mastodon/utils/web3";
import {Typography} from 'antd';
import {QRCodeSVG} from 'qrcode.react';

const {Paragraph} = Typography;

const mapStateToProps = state => ({
  account: state.getIn(['accounts', me]),
  blockchain: state.getIn(['blockchain', 'chain']),
});
const messages = defineMessages({
  depositTitle: {id: 'deposit.title', defaultMessage: 'Deposit'},
  confirm: {id: 'deposit.modal.confirm', defaultMessage: 'Confirm'},
  modalHeading: {id: 'deposit.modal.heading', defaultMessage: 'There are total 3 ways to deposit {token}'},
  modalHeadingLovedao: {id: 'deposit.modal.lovedao.heading', defaultMessage: 'There are total 3 ways to get {token}'},
  modalExchangeDesc: {id: 'deposit.exchange.desc', defaultMessage: '1. Exchange other token into {token}:'},
  modalExchangeDescLovedao: {id: 'deposit.exchange.lovedao.desc', defaultMessage: '1. Use other token to get {token}:'},
  modalTransferDesc: {id: 'deposit.transfer.desc', defaultMessage: '2. Transfer {token} from your other wallet:'},
  modalTransferCopy: {id: 'deposit.transfer.copy', defaultMessage: 'Copy the address'},
  modalTransferQR: {id: 'deposit.transfer.qrcode', defaultMessage: 'Or scan the QR code'},
  modalFiatDesc: {id: 'deposit.fiat.desc', defaultMessage: '3. Use Fiat to buy {token}:'},
  modalFiatDescLovedao: {id: 'deposit.fiat.lovedao.desc', defaultMessage: '3. Donate Fiat to get {token}:'},
  modalFiatDisable: {id: 'deposit.fiat.disable', defaultMessage: 'Not available yet'},
});

class DepositButton extends React.PureComponent {
  state = {
    open: false,
    loading: false,
  };

  static propTypes = {
    is_side_bar: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    account: ImmutablePropTypes.map.isRequired,
  };
  openModal = () => {
    const {intl, dispatch, account, blockchain} = this.props;
    const eth_address = account.get('eth_address');
    const abbrBlockchain = getAbbrBlockchain(blockchain);

    const link = `https://dapp.chainge.finance/?fromChain=${abbrBlockchain}&toChain=${abbrBlockchain}&fromToken=USDT&toToken=${getEarnToken()}&fromAmount=10`;
    const modalHeading = process.env.REACT_APP_DAO === 'lovedao' ? intl.formatMessage(messages.modalHeadingLovedao, {token: getEarnToken()}) : intl.formatMessage(messages.modalHeading, {token: getEarnToken()});
    const modalExchangeDesc = process.env.REACT_APP_DAO === 'lovedao' ? intl.formatMessage(messages.modalExchangeDescLovedao, {token: getEarnToken()}) : intl.formatMessage(messages.modalExchangeDesc, {token: getEarnToken()});
    const modalFiatDesc = process.env.REACT_APP_DAO === 'lovedao' ? intl.formatMessage(messages.modalFiatDescLovedao, {token: getEarnToken()}) : intl.formatMessage(messages.modalFiatDesc, {token: getEarnToken()});

    dispatch(openModal({
      modalType: 'CONFIRM',
      modalProps: {
        message: (
          <div className={'deposit_modal'}>
            <p className={'deposit_heading'}>{modalHeading}</p>
            <p
              className={'deposit_heading'}>{modalExchangeDesc}</p>
            <a className={'deposit_content'} href={link} target={'_blank'} style={{wordWrap: 'break-word'}}>{link}</a>
            <p
              className={'deposit_heading'}>{intl.formatMessage(messages.modalTransferDesc, {token: getEarnToken()})}</p>
            <p className={'deposit_content'}>{intl.formatMessage(messages.modalTransferCopy)}</p>
            <Paragraph copyable className={'deposit_content'}>{eth_address}</Paragraph>
            <p className={'deposit_content'}>{intl.formatMessage(messages.modalTransferQR)}</p>
            <QRCodeSVG value={'ethereum:' + eth_address} className={'deposit_content deposit_qrcode'}/>
            {/*<img className={'deposit_content'} src={LOVE_ICON} style={{width:50, height:50}}/>*/}

            <p className={'deposit_heading'}>{modalFiatDesc}</p>
            <p className={'deposit_content deposit_disabled'}>{intl.formatMessage(messages.modalFiatDisable)}</p>
          </div>),
        confirm: intl.formatMessage(messages.confirm),
        onConfirm: () => {
        },
      }
    }));
  };


  render() {
    const {intl, is_side_bar} = this.props;

    let depositTitle = intl.formatMessage(messages.depositTitle);
    return (
      <>
        {is_side_bar &&
          <Button
            type='button'
            text={depositTitle}
            title={depositTitle}
            onClick={this.openModal}
          />
        }
        {!is_side_bar &&
          <p onClick={this.openModal}>{intl.formatMessage(messages.depositTitle)}</p>
        }
      </>
    );
  }
}

export default connect(mapStateToProps)(injectIntl(DepositButton));

