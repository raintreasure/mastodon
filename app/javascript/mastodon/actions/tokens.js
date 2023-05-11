export const TOKENS_FETCH_REQUEST = 'TOKENS_FETCH_REQUEST';
export const TOKENS_FSN_FETCH_SUCCESS = 'TOKENS_FSN_FETCH_SUCCESS';
export const TOKENS_CHINESE_FETCH_SUCCESS = 'TOKENS_CHINESE_FETCH_SUCCESS';
export const TOKENS_CHNG_FETCH_SUCCESS = 'TOKENS_CHNG_FETCH_SUCCESS';
export const TOKENS_ETH_FETCH_SUCCESS = 'TOKENS_ETH_FETCH_SUCCESS';
export const TOKENS_USDT_FETCH_SUCCESS = 'TOKENS_USDT_FETCH_SUCCESS';
export const TOKENS_USDC_FETCH_SUCCESS = 'TOKENS_USDC_FETCH_SUCCESS';

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
  console.log('get balance from fusion:', balance);
  dispatch(fetchFSNSuccess(accountId, balance));
}
async function getCHINESEBalance(accountId, address, dispatch) {
  const Web3 = require('web3');
  const provider = new Web3.providers.HttpProvider('https://mainnet.fusionnetwork.io');
  const web3 = new Web3(provider);
  const contractAddress = '0x03a6eed53b5dcb0395dfbecf4cbc816dc6f93790';
  const contract = new web3.eth.Contract(balanceOfAbi, contractAddress);
  contract.methods.balanceOf(address).call((error, result) => {
    if(!error && result) {
      dispatch(fetchCHINESESuccess(accountId, result));
      console.log('get CHINESE balance: ', result);
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
  const contractAddress = '0x05573124c64c69d85687152b2942bcb0a3b26d99';
  const contract = new web3.eth.Contract(balanceOfAbi, contractAddress);
  contract.methods.balanceOf(address).call((error, result) => {
    if(!error && result) {
      dispatch(fetchCHNGSuccess(accountId, result));
      console.log('get CHNG balance: ', result);
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
  const contractAddress = '0x796d74a86db307b0b0e02fed9fa19ccb1906ce37';
  const contract = new web3.eth.Contract(balanceOfAbi, contractAddress);
  contract.methods.balanceOf(address).call((error, result) => {
    if(!error && result) {
      dispatch(fetchETHSuccess(accountId, result));
      console.log('get ETH balance: ', result);
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
  const contractAddress = '0x9636d3294e45823ec924c8d89dd1f1dffcf044e6';
  const contract = new web3.eth.Contract(balanceOfAbi, contractAddress);
  contract.methods.balanceOf(address).call((error, result) => {
    if(!error && result) {
      dispatch(fetchUSDTSuccess(accountId, result));
      console.log('get USDT balance: ', result);
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
  const contractAddress = '0x6b52048a01c41d1625a6893c80fbe4aa2c22bb54';
  const contract = new web3.eth.Contract(balanceOfAbi, contractAddress);
  contract.methods.balanceOf(address).call((error, result) => {
    if(!error && result) {
      dispatch(fetchUSDCSuccess(accountId, result));
      console.log('get USDC balance: ', result);
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
export function fetchFSNSuccess(accountId, balance) {
  return {
    type: TOKENS_FSN_FETCH_SUCCESS,
    accountId,
    balance,
  };
}
export function fetchCHINESESuccess(accountId, balance) {
  return {
    type: TOKENS_CHINESE_FETCH_SUCCESS,
    accountId,
    balance,
  };
}
export function fetchCHNGSuccess(accountId, balance) {
  return {
    type: TOKENS_CHNG_FETCH_SUCCESS,
    accountId,
    balance,
  };
}
export function fetchETHSuccess(accountId, balance) {
  return {
    type: TOKENS_ETH_FETCH_SUCCESS,
    accountId,
    balance,
  };
}
export function fetchUSDTSuccess(accountId, balance) {
  return {
    type: TOKENS_USDT_FETCH_SUCCESS,
    accountId,
    balance,
  };
}
export function fetchUSDCSuccess(accountId, balance) {
  return {
    type: TOKENS_USDC_FETCH_SUCCESS,
    accountId,
    balance,
  };
}
export function fetchTokensRequest(accountId) {
  return {
    type: TOKENS_FETCH_REQUEST,
    accountId,
  };
}
