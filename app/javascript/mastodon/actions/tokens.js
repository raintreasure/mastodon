const axios = require('axios').default;

const chaingeAPIBaseUrl = 'https://openapi.chainge.finance';

export const TOKENS_FETCH_REQUEST = 'TOKENS_FETCH_REQUEST';
export const TOKENS_FSN_FETCH_SUCCESS = 'TOKENS_FSN_FETCH_SUCCESS';
export const FSN_DECIMALS = 1e18;
export const TOKENS_CHINESE_FETCH_SUCCESS = 'TOKENS_CHINESE_FETCH_SUCCESS';
export const CHINESE_CONTRACT_ADDR = '0x03a6eed53b5dcb0395dfbecf4cbc816dc6f93790';
export const CHINESE_DECIMALS = 1e18;
export const TOKENS_CHNG_FETCH_SUCCESS = 'TOKENS_CHNG_FETCH_SUCCESS';
export const CHNG_CONTRACT_ADDR = '0x05573124c64c69d85687152b2942bcb0a3b26d99';
export const CHNG_DECIMALS = 1e18;
export const TOKENS_ETH_FETCH_SUCCESS = 'TOKENS_ETH_FETCH_SUCCESS';
export const ETH_CONTRACT_ADDR = '0x796d74a86db307b0b0e02fed9fa19ccb1906ce37';
export const ETH_DECIMALS = 1e18;
export const TOKENS_USDT_FETCH_SUCCESS = 'TOKENS_USDT_FETCH_SUCCESS';
export const USDT_CONTRACT_ADDR = '0x9636d3294e45823ec924c8d89dd1f1dffcf044e6';
export const USDT_DECIMALS = 1e6;
export const TOKENS_USDC_FETCH_SUCCESS = 'TOKENS_USDC_FETCH_SUCCESS';
export const USDC_CONTRACT_ADDR = '0x6b52048a01c41d1625a6893c80fbe4aa2c22bb54';
export const USDC_DECIMALS = 1e6;
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

async function getFSNBalance(accountId, address, dispatch) {
  const Web3 = require('web3');
  const provider = new Web3.providers.HttpProvider('https://mainnet.fusionnetwork.io');
  const web3 = new Web3(provider);
  const balance = await web3.eth.getBalance(address);
  const price = await fetchTokenPrice('FSN');
  const balanceWithDecimals = new BigNumber(balance).dividedBy(FSN_DECIMALS).toFixed(TOKEN_SHOWN_DECIMALS);
  const value = new BigNumber(balanceWithDecimals).multipliedBy(price).toFixed(VALUE_SHOWN_DECIMALS);
  console.log('get balance from fusion:', balanceWithDecimals);
  dispatch(fetchFSNSuccess(accountId, balanceWithDecimals, value));
}

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

async function getCHNGBalance(accountId, address, dispatch) {
  const Web3 = require('web3');
  const provider = new Web3.providers.HttpProvider('https://mainnet.fusionnetwork.io');
  const web3 = new Web3(provider);
  const contractAddress = CHNG_CONTRACT_ADDR;
  const contract = new web3.eth.Contract(balanceOfAbi, contractAddress);
  const price = await fetchTokenPrice('CHNG');
  contract.methods.balanceOf(address).call((error, result) => {
    if (!error && result) {
      const balanceWithDecimals = new BigNumber(result).dividedBy(CHNG_DECIMALS).toFixed(TOKEN_SHOWN_DECIMALS);
      const value = new BigNumber(balanceWithDecimals).multipliedBy(price).toFixed(VALUE_SHOWN_DECIMALS);
      dispatch(fetchCHNGSuccess(accountId, balanceWithDecimals, value));
    }
    if (error) {
      console.log('get CHNG balance error:', error);
    }
  });
}

async function getETHBalance(accountId, address, dispatch) {
  const Web3 = require('web3');
  const provider = new Web3.providers.HttpProvider('https://mainnet.fusionnetwork.io');
  const web3 = new Web3(provider);
  const contractAddress = ETH_CONTRACT_ADDR;
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
  const provider = new Web3.providers.HttpProvider('https://mainnet.fusionnetwork.io');
  const web3 = new Web3(provider);
  const contractAddress = USDT_CONTRACT_ADDR;
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
  const provider = new Web3.providers.HttpProvider('https://mainnet.fusionnetwork.io');
  const web3 = new Web3(provider);
  const contractAddress = USDC_CONTRACT_ADDR;
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

export function fetchTokens(accountId, address) {
  return (dispatch) => {
    dispatch(fetchTokensRequest(accountId));
    void getFSNBalance(accountId, address, dispatch);
    void getCHINESEBalance(accountId, address, dispatch);
    void getCHNGBalance(accountId, address, dispatch);
    void getETHBalance(accountId, address, dispatch);
    void getUSDTBalance(accountId, address, dispatch);
    void getUSDCBalance(accountId, address, dispatch);
  };
}

export function fetchFSNSuccess(accountId, balance, value) {
  return {
    type: TOKENS_FSN_FETCH_SUCCESS,
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

export function fetchCHNGSuccess(accountId, balance, value) {
  return {
    type: TOKENS_CHNG_FETCH_SUCCESS,
    accountId,
    balance,
    value,
  };
}

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
      console.log(tokenName, ' price: ', result.data.data.price);
      return result.data.data.price;
    }
  } catch (error) {
    console.log('fetch token price error:', error);
    throw error;
  }
  return 0;
};
