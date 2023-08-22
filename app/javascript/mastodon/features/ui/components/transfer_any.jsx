import React from 'react';
import {connect} from 'react-redux';
import {defineMessages, injectIntl} from 'react-intl';
import PropTypes from 'prop-types';
import {me} from '../../../initial_state';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Button from '../../../components/button';
import {transferERC20, transferModal} from '../../../actions/transfer';
import DropdownMenuContainer from '../../../containers/dropdown_menu_container';
import {openModal} from "mastodon/actions/modal";
import {toast} from "react-hot-toast";
import {CHAIN_FUSION, getAmountWithDecimals, getEarnToken, getNativeTokenDecimals, GWei} from "mastodon/utils/web3";
import {EMAIL_ICON, FSN_ICON, LOVE_ICON, TWITTER_ICON} from "../../../../icons/data";
import {DownOutlined} from '@ant-design/icons';
import {Dropdown, Space} from 'antd';
import api from "mastodon/api";
import {getGasAmountForTransfer, getGasPrice, getWithdrawContractAddr} from "mastodon/actions/blockchain";
import BigNumber from "bignumber.js";

import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import {FSN_LOVE_CONTRACT_ADDR} from "mastodon/actions/tokens";
import {fetchServer} from "mastodon/actions/server";

const TYPE_TWITTER = 'twitter'
const TYPE_EMAIL = 'email'

const mapStateToProps = state => ({
  account: state.getIn(['accounts', me]),
  blockchain: state.getIn(['blockchain', 'chain']),
});

const noAddrMessage = 'wallet address has not loaded, please try again or refresh the page';
const messages = defineMessages({
  transferConfirm: {id: 'account.transfer.confirm', defaultMessage: 'Transfer'},
  transferAddrNoLoaded: {id: 'account.transfer.web2_logged_in', defaultMessage: noAddrMessage},
  transferEmptyConfirm: {id: 'account.transfer.empty_confirm', defaultMessage: 'Confirm'},
  transferSuccess: {id: 'account.transfer.success', defaultMessage: 'You transferred '},
  transferFail: {id: 'account.transfer.fail', defaultMessage: 'Transfer failed'},
  transferInsufficientToken: {
    id: 'transfer_to_any.insufficienttoken',
    defaultMessage: 'Insufficient {token}, please check your {token} balance'
  },

  transferAnyTo: {id: 'transfer_to_any.to', defaultMessage: 'To: '},
  transferAnyAmount: {id: 'transfer_to_any.amount', defaultMessage: 'Amount: '},
  transferAnyTitle: {id: 'transfer_to_any.title', defaultMessage: 'Transfer to Anyone'},
  transferAnyTypeTwitter: {id: 'transfer_to_any.type.twitter', defaultMessage: 'To Twitter Account'},
  TwitterPlaceholder: {id: 'transfer_to_any.type.twitter.placeholder', defaultMessage: 'Twitter Username'},
  transferAnyTypeEmail: {id: 'transfer_to_any.type.email', defaultMessage: 'To Email Address'},
  EmailPlaceholder: {id: 'transfer_to_any.type.email.placeholder', defaultMessage: 'Email Address'},


});

class TranferToAny extends React.PureComponent {
  state = {
    loading: false,
    accountType: '',
    dialogOpen: false,
    accountLabel: '',

  };
  static propTypes = {
    new_balance: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    account: ImmutablePropTypes.map.isRequired,
  };
  static contextTypes = {
    identity: PropTypes.object.isRequired,
  };

  setAccountType = (type) => {
    this.setState({accountType: type})
  }
  openDialog = () => {
    this.setState({dialogOpen: true})
  }
  closeDialog = () => {
    this.setState({dialogOpen: false})
  }
  getPlaceholder = (intl) => {
    switch (this.state.accountType) {
      case TYPE_TWITTER:
        return intl.formatMessage(messages.TwitterPlaceholder)
      case TYPE_EMAIL:
        return intl.formatMessage(messages.EmailPlaceholder)
      default:
        return intl.formatMessage(messages.TwitterPlaceholder)
    }
  }
  transferToAny = async (intl, eth_address, token, blockchain, type) => {
    if (window.web3auth.provider && eth_address) {
      const transferTo = document.getElementById('transfer_any_to').value;
      const transferAmount = document.getElementById('transfer_any_amount').value
      console.log('transferTo is ', transferTo)
      console.log('transferAmount is ', transferAmount)
      transferERC20(token, process.env.REACT_APP_POOL_ACCOUNT, transferAmount, blockchain, dispatch).then(() => {
          console.log('succeed to get to here')
          api().post('/safe_keeping_transfers', {
            account_type: type,
            from: eth_address,
            to: transferTo,
            amount: transferAmount
          }).then(() => {
            toast.success(intl.formatMessage(messages.transferSuccess) + " " + transferAmount + " " + token + " " +
              intl.formatMessage(messages.transferAnyTo) + " " + transferTo);
          }).catch(e => {
            console.log(e)
          })
        },
      ).catch((error) => {
        toast.error(error);
      }).finally(() => {
        console.log('enter finally')
      });
    }
  }

  componentDidMount() {
    const {intl} = this.props;
    this.setState({accountType: TYPE_EMAIL});
    this.setState({accountLabel: intl.formatMessage(messages.transferAnyTypeEmail)});
  }


  handleChange = (event, intl) => {
    this.setState({accountType: event.target.value.toString()});
    let label = ''
    switch (event.target.value.toString()) {
      case TYPE_EMAIL:
        label = intl.formatMessage(messages.transferAnyTypeEmail)
        break
      case TYPE_TWITTER:
        label = intl.formatMessage(messages.transferAnyTypeTwitter)
    }
    this.setState({accountLabel: label})
  };


  render() {
    const {intl, dispatch, blockchain} = this.props;
    const eth_address = this.props.account.get('eth_address');
    const items = [
      {
        key: '1',
        label: (<span
          onClick={() => this.transferToAnyModal(intl, dispatch, eth_address, getEarnToken(), blockchain, TYPE_EMAIL,
            intl.formatMessage(messages.EmailPlaceholder), EMAIL_ICON, LOVE_ICON)}>{intl.formatMessage(messages.transferAnyTypeEmail)}</span>),
        icon: <img src={EMAIL_ICON} style={{width: 20}}/>
      },
      {
        key: '2',
        label: (<span
          onClick={() => this.transferToAnyModal(intl, dispatch, eth_address, getEarnToken(), blockchain, TYPE_TWITTER,
            intl.formatMessage(messages.TwitterPlaceholder), TWITTER_ICON, LOVE_ICON)}>{intl.formatMessage(messages.transferAnyTypeTwitter)}</span>),
        icon: <img src={TWITTER_ICON} style={{width: 20}}/>,
      }
    ];
    return (
      <div style={{width: 200}}>
        <Dropdown menu={{items}}>
          <a onClick={(e) => e.preventDefault()}>
            <Space size={'small'}>
              {intl.formatMessage(messages.transferAnyTitle)}
              <DownOutlined/>
            </Space>
          </a>
        </Dropdown>
        <div>
          <Button onClick={this.openDialog}>
            Transfer To Anyone
          </Button>
          <Dialog open={this.state.dialogOpen} onClose={this.closeDialog}>
            <DialogTitle>Transfer</DialogTitle>
            <DialogContent>
              <DialogContentText style={{marginBottom: 10}}>
                You can transfer any token to anyone. default token address is LOVE
              </DialogContentText>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Account Type</InputLabel>
                <Select
                  labelId="transfer-any-account-type-select-label"
                  id="transfer-any-account-type-select"
                  value={this.state.accountType}
                  label="Account Type"
                  onChange={(e) => this.handleChange(e, intl)}
                >
                  <MenuItem value={TYPE_EMAIL}><img src={EMAIL_ICON} style={{width: 20, margin: 5}}/>Email</MenuItem>
                  <MenuItem value={TYPE_TWITTER}><img src={TWITTER_ICON}
                                                      style={{width: 20, margin: 5}}/>Twitter</MenuItem>
                </Select>
              </FormControl>
              <TextField autoFocus margin="normal" id="transfer_to_any_account" label={this.state.accountLabel} fullWidth
                         variant="outlined"/>
              <TextField margin="normal" id="transfer_to_any_token_address" label="Token Address" fullWidth variant="outlined"
                         defaultValue={FSN_LOVE_CONTRACT_ADDR}/>
              <TextField margin="normal" id="transfer_to_any_amount" label="Amount" fullWidth variant="outlined" type={'number'}/>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => this.closeDialog()} className='confirmation-modal__cancel-button'>Cancel</Button>
              <Button onClick={this.closeDialog} className='confirmation-modal__secondary-button'>Subscribe</Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>

    );
  }
}

export default connect(mapStateToProps)(injectIntl(TranferToAny));
