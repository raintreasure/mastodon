import BigNumber from 'bignumber.js';
import { openModal } from './modal';
import { toast } from 'react-hot-toast';
import React from 'react';
import { CHINESE_CONTRACT_ADDR, CHINESE_DECIMALS } from './tokens';
import { getNativeToken, getEarnToken } from '../utils/multichain';

const transferAbi = [
  {
    'constant': false,
    'inputs': [
      {
        'name': '_to',
        'type': 'address',
      },
      {
        'name': '_value',
        'type': 'uint256',
      },
    ],
    'name': 'transfer',
    'outputs': [
      {
        'name': '',
        'type': 'bool',
      },
    ],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
];
export async function transferChinese(address, amount) {
  const Web3 = require('web3');
  let web3 = new Web3(window.web3auth.provider);
  const sender = (await web3.eth.getAccounts())[0];
  const amountWithDecimals = new BigNumber(amount).multipliedBy(CHINESE_DECIMALS);
  const contractAddress = CHINESE_CONTRACT_ADDR;
  const contract = new web3.eth.Contract(transferAbi, contractAddress);
  return new Promise((resolve, reject) => {
    contract.methods.transfer(address, amountWithDecimals.toFixed()).send({
      chainId: '0x89',
      from: sender,
      gasLimit: 60000,
      maxPriorityFeePerGas: web3.utils.toWei('40', 'gwei').toString(),
      maxFeePerGas: web3.utils.toWei('200', 'gwei').toString(),
    }).on('receipt', function () {
      resolve();
    }).on('error', function (error) {
      let suggestion = '';
      let errMsg = '';
      if (error.data && error.data.message && error.data.message.includes('insufficient funds')) {
        errMsg = error.data.message;
        suggestion = `please check your ${getNativeToken()} balance`;
      } else if (!error.data && error.toString().includes('Error: Transaction has been reverted by the EVM')) {
        errMsg = 'Error: Transaction has been reverted by the EVM';
        suggestion = `please check your ${getEarnToken()} balance`;
      }
      const err = errMsg === '' ? error : errMsg + ' , ' + suggestion;
      reject(err);
    });
  });
}

export function transferModal(intl, dispatch, to_account, messages) {
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
      <span style={{ color: 'grey' }}>$CHINESE</span>
    </div>
  </div>,
      confirm: intl.formatMessage(messages.transferConfirm),
      link: 'test',
      onConfirm: async () => {
        const transferAmount = document.getElementById('transfer_input').value;
        transferChinese(to_account.get('eth_address'), transferAmount).then(() => {
          toast.success(`You transferred ${transferAmount} ${getEarnToken()} to ${to_account.get('username')}`);
        },
        ).catch((error) => {
          toast.error(`Transfer failed. ${error}`);
        });
      },
    }));
  } else {
    dispatch(openModal('CONFIRM', {
      message:
  <div style={{ textAlign: 'left' }}>
    <span>{intl.formatMessage(messages.transferWeb2LoggedIn)}</span>
  </div>,
      confirm: intl.formatMessage(messages.transferEmptyConfirm),
      onConfirm: () => {
      },
    }));
  }
}
