import Web3 from "web3";
import {
  CHAIN_BSC,
  CHAIN_FUSION,
  getEthAddr,
  getGatewayUrl,
  getLoveAddr,
  getUsdcAddr,
  getUsdtAddr
} from "mastodon/utils/web3";

const axios = require('axios').default;

const chaingeAPIBaseUrl = 'https://openapi.chainge.finance';

export const TOKENS_BNB_FETCH_SUCCESS = 'TOKENS_BNB_FETCH_SUCCESS';
export const BNB_DECIMALS = 1e18;
export const TOKENS_POL_FETCH_SUCCESS = 'TOKENS_POL_FETCH_SUCCESS';
export const POL_DECIMALS = 1e18;
export const TOKENS_FSN_FETCH_SUCCESS = 'TOKENS_FSN_FETCH_SUCCESS';
export const FSN_DECIMALS = 1e18;

export const TOKENS_CHINESE_FETCH_SUCCESS = 'TOKENS_CHINESE_FETCH_SUCCESS';
export const CHINESE_CONTRACT_ADDR = '0x03a6eed53b5dcb0395dfbecf4cbc816dc6f93790';
export const CHINESE_DECIMALS = 1e18;
export const TOKENS_ETH_FETCH_SUCCESS = 'TOKENS_ETH_FETCH_SUCCESS';
// export const BSC_ETH_CONTRACT_ADDR = '0x2170ed0880ac9a755fd29b2688956bd959f933f8';
export const POL_ETH_CONTRACT_ADDR = '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619';
export const BSC_ETH_CONTRACT_ADDR = '0x2170Ed0880ac9A755fd29B2688956BD959F933F8';
export const FSN_ETH_CONTRACT_ADDR = '0x796d74a86db307b0b0e02fed9fa19ccb1906ce37';

export const ETH_DECIMALS = 1e18;
export const TOKENS_USDT_FETCH_SUCCESS = 'TOKENS_USDT_FETCH_SUCCESS';
export const BSC_USDT_CONTRACT_ADDR = '0x55d398326f99059ff775485246999027b3197955';
export const POL_USDT_CONTRACT_ADDR = '0xc2132D05D31c914a87C6611C10748AEb04B58e8F';
export const FSN_USDT_CONTRACT_ADDR = '0x9636D3294E45823Ec924c8d89dd1F1dffCF044e6';
export const USDT_DECIMALS = 1e6;
export const TOKENS_USDC_FETCH_SUCCESS = 'TOKENS_USDC_FETCH_SUCCESS';
export const BSC_USDC_CONTRACT_ADDR = '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d';
export const POL_USDC_CONTRACT_ADDR = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174';
export const FSN_USDC_CONTRACT_ADDR = '0x6b52048a01c41d1625a6893c80fbe4aa2c22bb54';

export const USDC_DECIMALS = 1e6;
export const TOKENS_LOVE_FETCH_SUCCESS = 'TOKENS_LOVE_FETCH_SUCCESS';
export const FSN_LOVE_CONTRACT_ADDR = '0xf5c5edf98c47bfe3a1d29c7ffe9a93ffc09a9205';
export const BSC_LOVE_CONTRACT_ADDR = '0x6452961d566449fa5364a182b802a32e17f5cc5f';
export const LOVE_DECIMALS = 1;
export const TOKENS_FACEDAO_FETCH_SUCCESS = 'TOKENS_FACEDAO_FETCH_SUCCESS';
export const FACEDAO_CONTRACT_ADDR = '0xb700597d8425CEd17677Bc68042D7d92764ACF59';
export const FACEDAO_DECIMALS = 1e18;
export const TOKENS_PQC_FETCH_SUCCESS = 'TOKENS_PQC_FETCH_SUCCESS';
export const PQC_CONTRACT_ADDR = '0xbd9749e4da1fb181ce6e413946cf760dec67b415';
export const PQC_DECIMALS = 1e18;
export const TOKENS_SEXY_FETCH_SUCCESS = 'TOKENS_SEXY_FETCH_SUCCESS';
export const SEXY_CONTRACT_ADDR = '0x05038f190eb986e8bbfc2708806026174fb4bebe';
export const SEXY_DECIMALS = 1e6;

// export const TOKENS_CHNG_FETCH_SUCCESS = 'TOKENS_CHNG_FETCH_SUCCESS';
// export const CHNG_CONTRACT_ADDR = '0x05573124c64c69d85687152b2942bcb0a3b26d99';
// export const CHNG_DECIMALS = 1e18;

const TOKEN_SHOWN_DECIMALS = 2;
const VALUE_SHOWN_DECIMALS = 3;

const BSC_RPC_URL = 'https://bsc-dataseed2.binance.org';
const POL_RPC_URL = 'https://polygon-rpc.com';
const FSN_RPC_URL = 'https://mainnet.fusionnetwork.io'

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

async function getPOLBalance(accountId, address, dispatch) {
  const Web3 = require('web3');
  const provider = new Web3.providers.HttpProvider(POL_RPC_URL);
  const web3 = new Web3(provider);
  const balance = await web3.eth.getBalance(address);
  const price = await fetchTokenPrice('POL');
  const balanceWithDecimals = new BigNumber(balance).dividedBy(POL_DECIMALS).toFixed(TOKEN_SHOWN_DECIMALS);
  const value = new BigNumber(balanceWithDecimals).multipliedBy(price).toFixed(VALUE_SHOWN_DECIMALS);
  dispatch(fetchPOLSuccess(accountId, balanceWithDecimals, value));
}

async function getBNBBalance(accountId, address, dispatch) {
  const Web3 = require('web3');
  const provider = new Web3.providers.HttpProvider(BSC_RPC_URL);
  const web3 = new Web3(provider);
  const balance = await web3.eth.getBalance(address);
  const price = await fetchTokenPrice('BNB');
  const balanceWithDecimals = new BigNumber(balance).dividedBy(BNB_DECIMALS).toFixed(TOKEN_SHOWN_DECIMALS);
  const value = new BigNumber(balanceWithDecimals).multipliedBy(price).toFixed(VALUE_SHOWN_DECIMALS);
  dispatch(fetchBNBSuccess(accountId, balanceWithDecimals, value));
}

async function getFSNBalance(accountId, address, dispatch) {
  const Web3 = require('web3');
  const provider = new Web3.providers.HttpProvider(FSN_RPC_URL);
  const web3 = new Web3(provider);
  const balance = await web3.eth.getBalance(address);
  const price = await fetchTokenPrice('FSN');
  const balanceWithDecimals = new BigNumber(balance).dividedBy(FSN_DECIMALS).toFixed(TOKEN_SHOWN_DECIMALS);
  const value = new BigNumber(balanceWithDecimals).multipliedBy(price).toFixed(VALUE_SHOWN_DECIMALS);
  dispatch(fetchFSNSuccess(accountId, balanceWithDecimals, value));
}


async function getCHINESEBalance(accountId, address, dispatch) {
  const Web3 = require('web3');
  const provider = new Web3.providers.HttpProvider(FSN_RPC_URL);
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


async function getLOVEBalance(accountId, address, dispatch, blockchain) {
  const Web3 = require('web3');
  const provider = new Web3.providers.HttpProvider(getGatewayUrl(blockchain));
  const web3 = new Web3(provider);
  const contractAddress = getLoveAddr(blockchain);
  const contract = new web3.eth.Contract(balanceOfAbi, contractAddress);
  const price = await fetchTokenPrice('LOVE');

  contract.methods.balanceOf(address).call((error, result) => {
    if (!error && result) {
      const balanceWithDecimals = new BigNumber(result).dividedBy(LOVE_DECIMALS).toFixed(TOKEN_SHOWN_DECIMALS);
      const value = new BigNumber(balanceWithDecimals).multipliedBy(price).toFixed(VALUE_SHOWN_DECIMALS);
      dispatch(fetchLOVESuccess(accountId, balanceWithDecimals, value));
    }
    if (error) {
      console.log('get LOVE balance error:', error);
    }
  });
}

async function getFaceDAOBalance(accountId, address, dispatch) {
  const Web3 = require('web3');
  const provider = new Web3.providers.HttpProvider(BSC_RPC_URL);
  const web3 = new Web3(provider);
  const contractAddress = FACEDAO_CONTRACT_ADDR;
  const contract = new web3.eth.Contract(balanceOfAbi, contractAddress);
  const price = await fetchTokenPrice('FACEDAO');
  contract.methods.balanceOf(address).call((error, result) => {
    if (!error && result) {
      const balanceWithDecimals = new BigNumber(result).dividedBy(FACEDAO_DECIMALS).toFixed(TOKEN_SHOWN_DECIMALS);
      const value = new BigNumber(balanceWithDecimals).multipliedBy(price).toFixed(VALUE_SHOWN_DECIMALS);
      dispatch(fetchFaceDAOSuccess(accountId, balanceWithDecimals, value));
    }
    if (error) {
      console.log('get FaceDAO balance error:', error);
    }
  });
}

async function getPQCBalance(accountId, address, dispatch) {
  const Web3 = require('web3');
  const provider = new Web3.providers.HttpProvider(FSN_RPC_URL);
  const web3 = new Web3(provider);
  const contractAddress = PQC_CONTRACT_ADDR;
  const contract = new web3.eth.Contract(balanceOfAbi, contractAddress);
  const price = await fetchTokenPrice('PQC');
  // console.log('pqc price is ', price);
  contract.methods.balanceOf(address).call((error, result) => {
    if (!error && result) {
      const balanceWithDecimals = new BigNumber(result).dividedBy(PQC_DECIMALS).toFixed(TOKEN_SHOWN_DECIMALS);
      const value = new BigNumber(balanceWithDecimals).multipliedBy(price).toFixed(VALUE_SHOWN_DECIMALS);
      dispatch(fetchPQCSuccess(accountId, balanceWithDecimals, value));
    }
    if (error) {
      console.log('get PQC balance error:', error);
    }
  });
}
async function getSEXYBalance(accountId, address, dispatch) {
  const Web3 = require('web3');
  const provider = new Web3.providers.HttpProvider(FSN_RPC_URL);
  const web3 = new Web3(provider);
  const contractAddress = SEXY_CONTRACT_ADDR;
  const contract = new web3.eth.Contract(balanceOfAbi, contractAddress);
  const price = await fetchTokenPrice('SEXY');
  // console.log('sexy price is ', price);
  contract.methods.balanceOf(address).call((error, result) => {
    if (!error && result) {
      const balanceWithDecimals = new BigNumber(result).dividedBy(SEXY_DECIMALS).toFixed(TOKEN_SHOWN_DECIMALS);
      const value = new BigNumber(balanceWithDecimals).multipliedBy(price).toFixed(VALUE_SHOWN_DECIMALS);
      dispatch(fetchSEXYSuccess(accountId, balanceWithDecimals, value));
    }
    if (error) {
      console.log('get SEXY balance error:', error);
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


async function getETHBalance(accountId, address, dispatch, blockchain) {
  let contractAddr = '';
  let rpc_url = '';
  switch (process.env.REACT_APP_DAO) {
    case 'chinesedao':
      contractAddr = FSN_ETH_CONTRACT_ADDR;
      rpc_url = FSN_RPC_URL;
      break;
    case 'facedao':
      contractAddr = BSC_ETH_CONTRACT_ADDR;
      rpc_url = BSC_RPC_URL;
      break;
    case 'lovedao':
      contractAddr = getEthAddr(blockchain);
      rpc_url = getGatewayUrl(blockchain);
      break;
    case 'pqcdao':
      contractAddr = FSN_ETH_CONTRACT_ADDR;
      rpc_url = FSN_RPC_URL;
      break;
    case 'sexydao':
      contractAddr = FSN_ETH_CONTRACT_ADDR;
      rpc_url = FSN_RPC_URL;
      break;
    default:
      contractAddr = POL_ETH_CONTRACT_ADDR;
      rpc_url = POL_RPC_URL;
  }
  const Web3 = require('web3');
  const provider = new Web3.providers.HttpProvider(rpc_url);
  const web3 = new Web3(provider);
  const contract = new web3.eth.Contract(balanceOfAbi, contractAddr);
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

async function getUSDTBalance(accountId, address, dispatch, blockchain) {
  let contractAddr = '';
  let rpc_url = '';
  switch (process.env.REACT_APP_DAO) {
    case 'chinesedao':
      contractAddr = FSN_USDT_CONTRACT_ADDR;
      rpc_url = FSN_RPC_URL;
      break;
    case 'facedao':
      contractAddr = BSC_USDT_CONTRACT_ADDR;
      rpc_url = BSC_RPC_URL;
      break;
    case 'lovedao':
      contractAddr = getUsdtAddr(blockchain);
      rpc_url = getGatewayUrl(blockchain);
      break;
    case 'pqcdao':
      contractAddr = FSN_USDT_CONTRACT_ADDR;
      rpc_url = FSN_RPC_URL;
      break;
    case 'sexydao':
      contractAddr = FSN_USDT_CONTRACT_ADDR;
      rpc_url = FSN_RPC_URL;
      break;
    default:
      contractAddr = POL_USDT_CONTRACT_ADDR;
      rpc_url = POL_RPC_URL;
  }
  const Web3 = require('web3');
  const provider = new Web3.providers.HttpProvider(rpc_url);
  const web3 = new Web3(provider);
  const contract = new web3.eth.Contract(balanceOfAbi, contractAddr);
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

async function getUSDCBalance(accountId, address, dispatch, blockchain) {
  let contractAddr = '';
  let rpc_url = '';
  switch (process.env.REACT_APP_DAO) {
    case 'chinesedao':
      contractAddr = FSN_USDC_CONTRACT_ADDR;
      rpc_url = FSN_RPC_URL;
      break;
    case 'facedao':
      contractAddr = BSC_USDC_CONTRACT_ADDR;
      rpc_url = BSC_RPC_URL;
      break;
    case 'lovedao':
      contractAddr = getUsdcAddr(blockchain)
      rpc_url = getGatewayUrl(blockchain);
      break;
    case 'pqcdao':
      contractAddr = FSN_USDC_CONTRACT_ADDR;
      rpc_url = FSN_RPC_URL;
      break;
    case 'sexydao':
      contractAddr = FSN_USDC_CONTRACT_ADDR;
      rpc_url = FSN_RPC_URL;
      break;
    default:
      contractAddr = POL_USDC_CONTRACT_ADDR;
      rpc_url = POL_RPC_URL;
  }
  const Web3 = require('web3');
  const provider = new Web3.providers.HttpProvider(rpc_url);
  const web3 = new Web3(provider);
  const contract = new web3.eth.Contract(balanceOfAbi, contractAddr);
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

export function fetchTokens(accountId, address, blockchain) {

  return (dispatch) => {
    if (process.env.REACT_APP_DAO === 'facedao') {
      void getBNBBalance(accountId, address, dispatch);
      void getLOVEBalance(accountId, address, dispatch, blockchain);
      void getFaceDAOBalance(accountId, address, dispatch);
    }
    if (process.env.REACT_APP_DAO === 'chinesedao') {
      void getFSNBalance(accountId, address, dispatch);
      void getCHINESEBalance(accountId, address, dispatch);
    }
    if (process.env.REACT_APP_DAO === 'lovedao') {
      if (blockchain === CHAIN_FUSION) {
        void getFSNBalance(accountId, address, dispatch);
      } else if (blockchain === CHAIN_BSC) {
        void getBNBBalance(accountId, address, dispatch);
      }
      void getLOVEBalance(accountId, address, dispatch, blockchain);
    }
    if (process.env.REACT_APP_DAO === 'pqcdao') {
      void getFSNBalance(accountId, address, dispatch);
      void getPQCBalance(accountId, address, dispatch);
    }
    if (process.env.REACT_APP_DAO === 'sexydao') {
      void getFSNBalance(accountId, address, dispatch);
      void getSEXYBalance(accountId, address, dispatch);
    }
    // void getCHNGBalance(accountId, address, dispatch);
    void getETHBalance(accountId, address, dispatch, blockchain);
    void getUSDTBalance(accountId, address, dispatch, blockchain);
    void getUSDCBalance(accountId, address, dispatch, blockchain);
  };
}

export function fetchBNBSuccess(accountId, balance, value) {
  return {
    type: TOKENS_BNB_FETCH_SUCCESS,
    accountId,
    balance,
    value,
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

export function fetchLOVESuccess(accountId, balance, value) {
  return {
    type: TOKENS_LOVE_FETCH_SUCCESS,
    accountId,
    balance,
    value,
  };
}

export function fetchFaceDAOSuccess(accountId, balance, value) {
  return {
    type: TOKENS_FACEDAO_FETCH_SUCCESS,
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
export function fetchPQCSuccess(accountId, balance, value) {
  return {
    type: TOKENS_PQC_FETCH_SUCCESS,
    accountId,
    balance,
    value,
  };
}
export function fetchSEXYSuccess(accountId, balance, value) {
  return {
    type: TOKENS_SEXY_FETCH_SUCCESS,
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


