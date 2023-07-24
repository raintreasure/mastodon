import axios from 'axios';
import { CHINESE_CONTRACT_ADDR, LOVE_CONTRACT_ADDR, FACEDAO_CONTRACT_ADDR } from './tokens';

export const FETCH_TRANSACTIONS_REQUEST = 'FETCH_TRANSACTIONS_REQUEST';
export const FETCH_TRANSACTIONS_SUCCESS = 'FETCH_TRANSACTIONS_SUCCESS';
export const FETCH_MORE_TRANSACTIONS_SUCCESS = 'FETCH_MORE_TRANSACTIONS_SUCCESS';

export function fetchTransactions(accountId, address) {
  return (dispatch) => {
    dispatch(fetchTransactionsRequest);
    if (process.env.REACT_APP_DAO === 'chinesedao') {
      void getPolChineseTransactions(accountId, address, dispatch);
    }
    if (process.env.REACT_APP_DAO === 'facedao') {
      void getBscLoveAndFaceTransactions(accountId, address, dispatch);
    }
    if (process.env.REACT_APP_DAO === 'pccdap') {
      void getBscLoveAndFaceTransactions(accountId, address, dispatch);
    }
  };
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
      contractAddress: LOVE_CONTRACT_ADDR,
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
