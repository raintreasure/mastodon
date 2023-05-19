import axios from 'axios';
import { CHINESE_CONTRACT_ADDR } from './tokens';

export const FETCH_TRANSACTIONS_REQUEST = 'FETCH_TRANSACTIONS_REQUEST';
export const FETCH_TRANSACTIONS_SUCCESS = 'FETCH_TRANSACTIONS_SUCCESS';
export const FETCH_MORE_TRANSACTIONS_SUCCESS = 'FETCH_MORE_TRANSACTIONS_SUCCESS';

export function fetchTransactions(accountId, address) {
  return (dispatch) => {
    dispatch(fetchTransactionsRequest);
    void getTransactions(accountId, address, dispatch);
  };
}

async function getTransactions(accountId, address, dispatch) {
  axios.get('https://api.polygonscan.com/api', {
    params: {
      module: 'account',
      action: 'tokentx',
      contractAddress: CHINESE_CONTRACT_ADDR,
      address: address,
      startblock: 0,
      endblock: 99999999,
      page: 1,
      offset: 5,
      sort: 'desc',
      apiKey: 'E6TXTFRPZSH4R6MY6PHCRUJIV5NZAD4E3C',
    },
  }).then(res => {
    dispatch(fetchTransactionsSuccess(accountId, res.data.result, 1));
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
      apiKey: 'E6TXTFRPZSH4R6MY6PHCRUJIV5NZAD4E3C',
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
