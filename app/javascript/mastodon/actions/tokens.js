import { openModal } from './modal';
import { toast } from 'react-hot-toast';
import React from 'react';

const axios = require('axios').default;

const chaingeAPIBaseUrl = 'https://openapi.chainge.finance';

export const TOKENS_FETCH_REQUEST = 'TOKENS_FETCH_REQUEST';
// export const TOKENS_BNB_FETCH_SUCCESS = 'TOKENS_BNB_FETCH_SUCCESS';
// export const BNB_DECIMALS = 1e18;
export const TOKENS_POL_FETCH_SUCCESS = 'TOKENS_POL_FETCH_SUCCESS';
export const POL_DECIMALS = 1e18;
export const TOKENS_CHINESE_FETCH_SUCCESS = 'TOKENS_CHINESE_FETCH_SUCCESS';
export const CHINESE_CONTRACT_ADDR = '0x03a6eed53b5dcb0395dfbecf4cbc816dc6f93790';
export const CHINESE_DECIMALS = 1e18;
export const TOKENS_ETH_FETCH_SUCCESS = 'TOKENS_ETH_FETCH_SUCCESS';
// export const BSC_ETH_CONTRACT_ADDR = '0x2170ed0880ac9a755fd29b2688956bd959f933f8';
export const POL_ETH_CONTRACT_ADDR = '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619';
export const ETH_DECIMALS = 1e18;
export const TOKENS_USDT_FETCH_SUCCESS = 'TOKENS_USDT_FETCH_SUCCESS';
// export const BSC_USDT_CONTRACT_ADDR = '0x55d398326f99059ff775485246999027b3197955';
export const POL_USDT_CONTRACT_ADDR = '0xc2132D05D31c914a87C6611C10748AEb04B58e8F';
export const USDT_DECIMALS = 1e6;
export const TOKENS_USDC_FETCH_SUCCESS = 'TOKENS_USDC_FETCH_SUCCESS';
// export const BSC_USDC_CONTRACT_ADDR = '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d';
export const POL_USDC_CONTRACT_ADDR = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174';
export const USDC_DECIMALS = 1e6;

// export const TOKENS_CHNG_FETCH_SUCCESS = 'TOKENS_CHNG_FETCH_SUCCESS';
// export const CHNG_CONTRACT_ADDR = '0x05573124c64c69d85687152b2942bcb0a3b26d99';
// export const CHNG_DECIMALS = 1e18;
// export const TOKENS_FSN_FETCH_SUCCESS = 'TOKENS_FSN_FETCH_SUCCESS';
// export const FSN_DECIMALS = 1e18;

const TOKEN_SHOWN_DECIMALS = 2;
const VALUE_SHOWN_DECIMALS = 3;

var BigNumber = require('bignumber.js');

const balanceOfAbi = [{
  'constant': true,
  'inputs': [
    {
      'name': '_owner',
      'type': 'address',
    },
  ],
  'name': 'balanceOf',
  'outputs': [
    {
      'name': 'balance',
      'type': 'uint256',
    },
  ],
  'payable': false,
  'stateMutability': 'view',
  'type': 'function',
}];
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

async function getPOLBalance(accountId, address, dispatch) {
  const Web3 = require('web3');
  const provider = new Web3.providers.HttpProvider('https://polygon-rpc.com');
  const web3 = new Web3(provider);
  const balance = await web3.eth.getBalance(address);
  const price = await fetchTokenPrice('POL');
  const balanceWithDecimals = new BigNumber(balance).dividedBy(POL_DECIMALS).toFixed(TOKEN_SHOWN_DECIMALS);
  const value = new BigNumber(balanceWithDecimals).multipliedBy(price).toFixed(VALUE_SHOWN_DECIMALS);
  dispatch(fetchPOLSuccess(accountId, balanceWithDecimals, value));
}

// async function getBNBBalance(accountId, address, dispatch) {
//   const Web3 = require('web3');
//   const provider = new Web3.providers.HttpProvider('https://bsc-dataseed.binance.org');
//   const web3 = new Web3(provider);
//   const balance = await web3.eth.getBalance(address);
//   const price = await fetchTokenPrice('BNB');
//   const balanceWithDecimals = new BigNumber(balance).dividedBy(BNB_DECIMALS).toFixed(TOKEN_SHOWN_DECIMALS);
//   const value = new BigNumber(balanceWithDecimals).multipliedBy(price).toFixed(VALUE_SHOWN_DECIMALS);
//   dispatch(fetchBNBSuccess(accountId, balanceWithDecimals, value));
// }

async function getCHINESEBalance(accountId, address, dispatch) {
  const Web3 = require('web3');
  const provider = new Web3.providers.HttpProvider('https://mainnet.fusionnetwork.io');
  const web3 = new Web3(provider);
  const contractAddress = CHINESE_CONTRACT_ADDR;
  const contract = new web3.eth.Contract(balanceOfAbi, contractAddress);
  const price = await fetchTokenPrice('CHINESE');
  contract.methods.balanceOf(address).call((error, result) => {
    if (!error && result) {
      const balanceWithDecimals = new BigNumber(result).dividedBy(CHINESE_DECIMALS).toFixed(TOKEN_SHOWN_DECIMALS);
      const value = new BigNumber(balanceWithDecimals).multipliedBy(price).toFixed(VALUE_SHOWN_DECIMALS);
      dispatch(fetchCHINESESuccess(accountId, balanceWithDecimals, value));
    }
    if (error) {
      console.log('get CHINESE balance error:', error);
    }
  });
}

// async function getCHNGBalance(accountId, address, dispatch) {
//   const Web3 = require('web3');
//   const provider = new Web3.providers.HttpProvider('https://mainnet.fusionnetwork.io');
//   const web3 = new Web3(provider);
//   const contractAddress = CHNG_CONTRACT_ADDR;
//   const contract = new web3.eth.Contract(balanceOfAbi, contractAddress);
//   const price = await fetchTokenPrice('CHNG');
//   contract.methods.balanceOf(address).call((error, result) => {
//     if (!error && result) {
//       const balanceWithDecimals = new BigNumber(result).dividedBy(CHNG_DECIMALS).toFixed(TOKEN_SHOWN_DECIMALS);
//       const value = new BigNumber(balanceWithDecimals).multipliedBy(price).toFixed(VALUE_SHOWN_DECIMALS);
//       dispatch(fetchCHNGSuccess(accountId, balanceWithDecimals, value));
//     }
//     if (error) {
//       console.log('get CHNG balance error:', error);
//     }
//   });
// }

async function getETHBalance(accountId, address, dispatch) {
  const Web3 = require('web3');
  const provider = new Web3.providers.HttpProvider('https://polygon-rpc.com');
  const web3 = new Web3(provider);
  const contractAddress = POL_ETH_CONTRACT_ADDR;
  const contract = new web3.eth.Contract(balanceOfAbi, contractAddress);
  const price = await fetchTokenPrice('ETH');
  contract.methods.balanceOf(address).call((error, result) => {
    if (!error && result) {
      const balanceWithDecimals = new BigNumber(result).dividedBy(ETH_DECIMALS).toFixed(TOKEN_SHOWN_DECIMALS);
      const value = new BigNumber(balanceWithDecimals).multipliedBy(price).toFixed(VALUE_SHOWN_DECIMALS);
      dispatch(fetchETHSuccess(accountId, balanceWithDecimals, value));
    }
    if (error) {
      console.log('get ETH balance error:', error);
    }
  });
}

async function getUSDTBalance(accountId, address, dispatch) {
  const Web3 = require('web3');
  const provider = new Web3.providers.HttpProvider('https://polygon-rpc.com');
  const web3 = new Web3(provider);
  const contractAddress = POL_USDT_CONTRACT_ADDR;
  const contract = new web3.eth.Contract(balanceOfAbi, contractAddress);
  const price = await fetchTokenPrice('USDT');
  contract.methods.balanceOf(address).call((error, result) => {
    if (!error && result) {
      const balanceWithDecimals = new BigNumber(result).dividedBy(USDT_DECIMALS).toFixed(TOKEN_SHOWN_DECIMALS);
      const value = new BigNumber(balanceWithDecimals).multipliedBy(price).toFixed(VALUE_SHOWN_DECIMALS);
      dispatch(fetchUSDTSuccess(accountId, balanceWithDecimals, value));
    }
    if (error) {
      console.log('get USDT balance error:', error);
    }
  });
}

async function getUSDCBalance(accountId, address, dispatch) {
  const Web3 = require('web3');
  const provider = new Web3.providers.HttpProvider('https://polygon-rpc.com');
  const web3 = new Web3(provider);
  const contractAddress = POL_USDC_CONTRACT_ADDR;
  const contract = new web3.eth.Contract(balanceOfAbi, contractAddress);
  const price = await fetchTokenPrice('USDC');
  contract.methods.balanceOf(address).call((error, result) => {
    if (!error && result) {
      const balanceWithDecimals = new BigNumber(result).dividedBy(USDC_DECIMALS).toFixed(TOKEN_SHOWN_DECIMALS);
      const value = new BigNumber(balanceWithDecimals).multipliedBy(price).toFixed(VALUE_SHOWN_DECIMALS);
      dispatch(fetchUSDCSuccess(accountId, balanceWithDecimals, value));
    }
    if (error) {
      console.log('get USDC balance error:', error);
    }
  });
}

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
    }).on('confirmation', function () {
      resolve();
    }).on('error', function (error) {
      console.log(error);
      reject(error);
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
          toast.success(`You transferred ${transferAmount} $CHINESE to ${to_account.get('username')}`);
        },
        ).catch((error) => {
          toast.error(`Transfer failed. ${error.message}`);
        });
      },
    }));
  } else {
    dispatch(openModal('CONFIRM', {
      message:
  <div style={{ textAlign: 'left' }}>
    <span>{intl.formatMessage(messages.transferWeb2LoggedIn)}</span>
    <a
      id={'logoutId'} href={'/auth/sign_out'}
      data-method={'delete'}
    >{intl.formatMessage(messages.transferWeb2Logout)}</a>
  </div>,
      confirm: intl.formatMessage(messages.transferEmptyConfirm),
      onConfirm: () => {
      },
    }));
  }
}

export function fetchTokens(accountId, address) {
  return (dispatch) => {
    dispatch(fetchTokensRequest(accountId));
    // void getBNBBalance(accountId, address, dispatch);
    void getPOLBalance(accountId, address, dispatch);
    void getCHINESEBalance(accountId, address, dispatch);
    // void getCHNGBalance(accountId, address, dispatch);
    void getETHBalance(accountId, address, dispatch);
    void getUSDTBalance(accountId, address, dispatch);
    void getUSDCBalance(accountId, address, dispatch);
  };
}

// export function fetchBNBSuccess(accountId, balance, value) {
//   return {
//     type: TOKENS_BNB_FETCH_SUCCESS,
//     accountId,
//     balance,
//     value,
//   };
// }

export function fetchPOLSuccess(accountId, balance, value) {
  return {
    type: TOKENS_POL_FETCH_SUCCESS,
    accountId,
    balance,
    value,
  };
}

export function fetchCHINESESuccess(accountId, balance, value) {
  return {
    type: TOKENS_CHINESE_FETCH_SUCCESS,
    accountId,
    balance,
    value,
  };
}

// export function fetchCHNGSuccess(accountId, balance, value) {
//   return {
//     type: TOKENS_CHNG_FETCH_SUCCESS,
//     accountId,
//     balance,
//     value,
//   };
// }

export function fetchETHSuccess(accountId, balance, value) {
  return {
    type: TOKENS_ETH_FETCH_SUCCESS,
    accountId,
    balance,
    value,
  };
}

export function fetchUSDTSuccess(accountId, balance, value) {
  return {
    type: TOKENS_USDT_FETCH_SUCCESS,
    accountId,
    balance,
    value,
  };
}

export function fetchUSDCSuccess(accountId, balance, value) {
  return {
    type: TOKENS_USDC_FETCH_SUCCESS,
    accountId,
    balance,
    value,
  };
}

export function fetchTokensRequest(accountId) {
  return {
    type: TOKENS_FETCH_REQUEST,
    accountId,
  };
}

const fetchTokenPrice = async (tokenName) => {
  try {
    const result = await axios.get(`${chaingeAPIBaseUrl}/open/v1/base/getTokenPrice`, {
      params: {
        token: tokenName,
      },
    });
    if (result.data.code === 200) {
      return result.data.data.price;
    }
  } catch (error) {
    console.log('fetch token price error:', error);
    throw error;
  }
  return 0;
};
