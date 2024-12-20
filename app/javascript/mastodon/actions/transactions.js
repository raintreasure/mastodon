import axios from 'axios';
import {
  CHINESE_CONTRACT_ADDR,
  FACEDAO_CONTRACT_ADDR,
  FSN_USDT_CONTRACT_ADDR,
  PQC_CONTRACT_ADDR, FSN_LOVE_CONTRACT_ADDR, BSC_LOVE_CONTRACT_ADDR, SEXY_CONTRACT_ADDR
} from './tokens';
import api from "mastodon/api";
import {CHAIN_BSC, CHAIN_FUSION} from "mastodon/utils/web3";

export const FETCH_TRANSACTIONS_REQUEST = 'FETCH_TRANSACTIONS_REQUEST';
export const FETCH_TRANSACTIONS_SUCCESS = 'FETCH_TRANSACTIONS_SUCCESS';
export const FETCH_MORE_TRANSACTIONS_SUCCESS = 'FETCH_MORE_TRANSACTIONS_SUCCESS';
const transferDataFuncHash = '0xc0e37b15';

export function fetchTransactions(accountId, address, blockchain) {
  return (dispatch) => {
    dispatch(fetchTransactionsRequest);
    if (process.env.REACT_APP_DAO === 'chinesedao') {
      void getFSNTransactions(accountId, CHINESE_CONTRACT_ADDR, address, dispatch, 'CHINESE');
    }
    if (process.env.REACT_APP_DAO === 'facedao') {
      void getBscLoveAndFaceTransactions(accountId, address, dispatch);
    }
    if (process.env.REACT_APP_DAO === 'pqcdao') {
      void getFSNTransactions(accountId, PQC_CONTRACT_ADDR, address, dispatch, 'PQC');
    }
    if (process.env.REACT_APP_DAO === 'lovedao') {
      // console.log('enter lovedao branch, start to get transactions, blockchain is ', blockchain)
      if (blockchain === CHAIN_BSC) {
        void getBscLoveTransactions(accountId, address, dispatch)
      }else if (blockchain === CHAIN_FUSION ) {
        void getFSNTransactions(accountId, FSN_LOVE_CONTRACT_ADDR, address, dispatch, 'LOVE');
      }
    }
    if (process.env.REACT_APP_DAO === 'sexydao') {
      void getFSNTransactions(accountId, SEXY_CONTRACT_ADDR, address, dispatch, 'SEXY');
    }
  };
}

async function getFSNTransactions(accountId, contract, addr, dispatch, token) {
  api().get('/get_blockchain_transactions', {
    params: {
      chain_id: '0x7f93',
      contract: contract.toLowerCase(),
      addr: addr.toLowerCase()
    }
  }).then(res => {
    // console.log(res)
    // console.log(res.data)
    const transactions = res.data.map(d => {
      return {
        hash: d.trx_hash,
        from: d.from,
        to: d.to,
        value: d.value,
        timeStamp: d.timestamp,
        message: d.message,
        tokenSymbol: token,
      }
    })
    dispatch(fetchTransactionsSuccess(accountId, transactions, 1));
  })
}

async function getPolChineseTransactions(accountId, address, dispatch) {
  axios.get('https://api.polygonscan.com/api', {
    params: {
      module: 'account',
      action: 'tokentx',
      contractAddress: CHINESE_CONTRACT_ADDR,
      address: address,
      startblock: 0,
      endblock: 99999999,
      page: 1,
      offset: 1000,
      sort: 'desc',
      apiKey: process.env.REACT_APP_POLYSCAN_API_KEY,
    },
  }).then(res => {
      dispatch(fetchTransactionsSuccess(accountId, res.data.result, 1));
    },
  ).catch(e => {
    console.log('error: ', e);
  });
}

async function getFSNPQCTransactions(accountId, address, dispatch) {
  axios.get('https://api.polygonscan.com/api', {
    params: {
      module: 'account',
      action: 'tokentx',
      contractAddress: CHINESE_CONTRACT_ADDR,
      address: address,
      startblock: 0,
      endblock: 99999999,
      page: 1,
      offset: 1000,
      sort: 'desc',
      apiKey: process.env.REACT_APP_POLYSCAN_API_KEY,
    },
  }).then(res => {
      dispatch(fetchTransactionsSuccess(accountId, res.data.result, 1));
    },
  ).catch(e => {
    console.log('error: ', e);
  });
}

// 将nums1 和 nums2 合并
function mergeTransactions(loveRes, faceRes) {
  let ret = [];
  let i = 0, j = 0;
  while (i < loveRes.length || j < faceRes.length) {
    if (i === loveRes.length) {
      ret.push(faceRes[j]);
      j++;
      continue;
    }

    if (j === faceRes.length) {
      ret.push(loveRes[i]);
      i++;
      continue;
    }
    const a = loveRes[i];
    const b = faceRes[j];
    if (a.timeStamp < b.timeStamp) {
      ret.push(faceRes[j]);
      j++;
    } else {
      ret.push(loveRes[i]);
      i++;
    }
  }
  return ret;
}

// function mergeTransactions(loveRes, faceRes) {
//   return loveRes
// }
async function getBscLoveAndFaceTransactions(accountId, address, dispatch) {
  axios.get('https://api.bscscan.com/api', {
    params: {
      module: 'account',
      action: 'tokentx',
      contractAddress: BSC_LOVE_CONTRACT_ADDR,
      address: address,
      startblock: 0,
      endblock: 99999999,
      page: 1,
      offset: 1000,
      sort: 'desc',
      apiKey: process.env.REACT_APP_BSCSCAN_API_KEY,
    },
  }).then(loveRes => {
      axios.get('https://api.bscscan.com/api', {
        params: {
          module: 'account',
          action: 'tokentx',
          contractAddress: FACEDAO_CONTRACT_ADDR,
          address: address,
          startblock: 0,
          endblock: 99999999,
          page: 1,
          offset: 1000,
          sort: 'desc',
          apiKey: process.env.REACT_APP_BSCSCAN_API_KEY,
        },
      }).then(faceRes => {
          const transactions = mergeTransactions(loveRes.data.result, faceRes.data.result);
          dispatch(fetchTransactionsSuccess(accountId, transactions, 1));
        },
      ).catch(e => {
        console.log('error: ', e);
      });
    },
  ).catch(e => {
    console.log('error: ', e);
  });
}

async function getBscLoveTransactions(accountId, address, dispatch) {
  axios.get('https://api.bscscan.com/api', {
    params: {
      module: 'account',
      action: 'tokentx',
      contractAddress: BSC_LOVE_CONTRACT_ADDR,
      address: address,
      startblock: 0,
      endblock: 99999999,
      page: 1,
      offset: 1000,
      sort: 'desc',
      apiKey: process.env.REACT_APP_BSCSCAN_API_KEY,
    },
  }).then(loveRes => {
      dispatch(fetchTransactionsSuccess(accountId, loveRes.data.result, 1));
    }
  ).catch(e => {
    console.log('error: ', e);
  });
}

export function fetchMoreTransactions(accountId, address, page) {
  return (dispatch) => {
    void getMoreTransactions(accountId, address, dispatch, page);
  };
}

async function getMoreTransactions(accountId, address, dispatch, page) {
  axios.get('https://api.polygonscan.com/api', {
    params: {
      module: 'account',
      action: 'tokentx',
      contractAddress: CHINESE_CONTRACT_ADDR,
      address: address,
      startblock: 0,
      endblock: 99999999,
      page: page,
      offset: 5,
      sort: 'desc',
      apiKey: process.env.REACT_APP_POLYSCAN_API_KEY,
    },
  }).then(res => {
    dispatch(fetchMoreTransactionsSuccess(accountId, res.data.result, page));
  }).catch(e => {
    console.log('error: ', e);
  });
}


export function fetchTransactionsRequest(accountId) {
  return {
    type: FETCH_TRANSACTIONS_REQUEST,
    accountId,
  };
}

export function fetchTransactionsSuccess(accountId, transactions, page) {
  return {
    type: FETCH_TRANSACTIONS_SUCCESS,
    accountId,
    transactions,
    page,
  };
}

export function fetchMoreTransactionsSuccess(accountId, transactions, page) {
  return {
    type: FETCH_MORE_TRANSACTIONS_SUCCESS,
    accountId,
    transactions,
    page,
  };
}
