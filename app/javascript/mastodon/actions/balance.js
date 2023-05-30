import api from '../api';

export const BALANCE_UPDATE_REQUEST = 'BALANCE_UPDATE_REQUEST';
export const BALANCE_UPDATE_SUCCESS = 'BALANCE_UPDATE_SUCCESS';
export const BALANCE_UPDATE_FAIL = 'BALANCE_UPDATE_FAIL';
export const UPDATE_BALANCE = 'UPDATE_BALANCE';
export const GET_EARNING_RECORDS_SUCCESS = 'GET_EARNING_RECORDS_SUCCESS';


export function balanceUpdateRequest(accountId) {
  return {
    type: BALANCE_UPDATE_REQUEST,
    accountId: accountId,
  };
}

export function balanceUpdateSuccess(new_balance) {
  return {
    type: BALANCE_UPDATE_SUCCESS,
    new_balance: new_balance,
  };
}

export function balanceUpdateFail(error) {
  return {
    type: BALANCE_UPDATE_FAIL,
    error: error,
  };
}

export function updateBalance(new_balance, balance_increment) {
  return {
    type: UPDATE_BALANCE,
    new_balance: new_balance,
    balance_increment: balance_increment,
  };
}

export function getEarningRecordsSuccess(records) {
  return {
    type:GET_EARNING_RECORDS_SUCCESS,
    earning_records: records,
  };
}

export function earn_online(accountId) {
  return function (dispatch, getState) {
    api(getState).patch(`/api/v1/accounts/${accountId}/balance`).then(function (response) {
      dispatch(updateBalance(response.data.new_balance, 0));
    }).catch(function (error) {
      dispatch(balanceUpdateFail(error));
      console.log('get balance failed', error);
    });
  };
}

export function getEarningsRecord(accountId) {
  return function (dispatch, getState) {
    api(getState).get(`/api/v1/accounts/${accountId}/earning_records`).then(function (response) {
      dispatch(getEarningRecordsSuccess(response.data.earnings));
    }).catch(function (error) {
      console.log('get earning records failed:', error);
    });
  };
}
