
import { openModal } from './modal';
import { toast } from 'react-hot-toast';
import React from 'react';

import { defineMessages } from 'react-intl';
import { getAmountWithDecimals, getChainId, getContractAddr, getNativeToken, transferAbi } from '../utils/web3';


const noAddrMessage = 'wallet address has not loaded, please try again or refresh the page';
const toAccountNoAddress = 'The account you transferred to has no wallet address';
const messages = defineMessages({
  transferTitle: { id: 'account.transfer.title', defaultMessage: 'Transfer' },
  transferText: { id: 'account.transfer.text', defaultMessage: 'You are transferring to ' },
  transferConfirm: { id: 'account.transfer.confirm', defaultMessage: 'Transfer' },
  transferAddrNoLoaded: { id: 'account.transfer.web2_logged_in', defaultMessage: noAddrMessage },
  transferEmptyConfirm: { id: 'account.transfer.empty_confirm', defaultMessage: 'Confirm' },
  transferToAccountNoAddress: { id: 'account.transfer.to_account_no_address', defaultMessage: toAccountNoAddress },
  transferSuccess: { id: 'account.transfer.success', defaultMessage: 'You transferred ' },
  transferTo: { id: 'account.transfer.to', defaultMessage: ' to ' },
  transferFail: { id: 'account.transfer.fail', defaultMessage: 'Transfer failed' },
});


export async function transferERC20(token, address, amount) {
  const Web3 = require('web3');
  let web3 = new Web3(window.web3auth.provider);
  const sender = (await web3.eth.getAccounts())[0];


  const contractAddress = getContractAddr(token);
  const contract = new web3.eth.Contract(transferAbi, contractAddress);
  let params;
  //BSC does not support EIP1559, list those
  if (process.env.REACT_APP_DAO === 'facedao') {
    params = {
      chainId:getChainId(),
      from: sender,
      gasLimit: 60000,
    };
  } else {
    params = {
      chainId: getChainId(),
      from: sender,
      gasLimit: 60000,
      maxPriorityFeePerGas: web3.utils.toWei('40', 'gwei').toString(),
      maxFeePerGas: web3.utils.toWei('200', 'gwei').toString(),
    };
  }

  return new Promise((resolve, reject) => {
    contract.methods.transfer(address, getAmountWithDecimals(amount, token)).send(
      params,
    ).on('receipt', function () {
      resolve();
    }).on('error', function (error) {
      let suggestion = '';
      let errMsg = '';
      if (error.data && error.data.message && error.data.message.includes('insufficient funds')) {
        errMsg = error.data.message;
        suggestion = `please check your ${getNativeToken()} balance`;
      } else if (!error.data && error.toString().includes('Error: Transaction has been reverted by the EVM')) {
        errMsg = 'Error: Transaction has been reverted by the EVM';
        suggestion = `please check your ${token} balance`;
      }
      const err = errMsg === '' ? (error.message ? error.message : error) : errMsg + ' , ' + suggestion;
      reject(err);
    });
  });
}

export function transferModal(intl, dispatch, to_account, token) {
  if (to_account.get('eth_address') === null || to_account.get('eth_address') === undefined) {
    dispatch(openModal('CONFIRM', {
      message:
      /* eslint-disable react/jsx-filename-extension */
  <p style={{ textAlign: 'left' }}>{intl.formatMessage(messages.transferToAccountNoAddress)}</p>,
      confirm: intl.formatMessage(messages.transferEmptyConfirm),
      onConfirm: () => {
      },
    }));
  } else if (window.web3auth.provider) {
    dispatch(openModal('CONFIRM', {
      message:
  <div className={'transfer__modal'}>
    <div>
      <span style={{ textAlign: 'center' }}>{intl.formatMessage(messages.transferText)}</span>
      {to_account.get('username')}
    </div>
    <div className={'transfer__modal__input'}>
      <input type={'number'} min={0} id={'transfer_input'} />
      <span style={{ color: 'grey' }}>${token}</span>
    </div>
  </div>,
      confirm: intl.formatMessage(messages.transferConfirm),
      onConfirm: async () => {
        const transferAmount = document.getElementById('transfer_input').value;
        transferERC20(token, to_account.get('eth_address'), transferAmount).then(() => {
          toast.success(intl.formatMessage(messages.transferSuccess) + transferAmount + token +
                intl.formatMessage(messages.transferTo) + to_account.get('username'));
        },
        ).catch((error) => {
          toast.error(intl.formatMessage(messages.transferFail) + error);
        });
      },
    },
    ))
    ;
  } else {
    dispatch(openModal('CONFIRM', {
      message:
  <div style={{ textAlign: 'left' }}>
    <span>{intl.formatMessage(messages.transferAddrNoLoaded)}</span>
  </div>,
      confirm: intl.formatMessage(messages.transferEmptyConfirm),
      onConfirm: () => {
      },
    }));
  }
}


