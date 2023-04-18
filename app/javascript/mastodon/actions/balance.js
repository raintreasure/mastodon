import api from '../api';

export const BALANCE_UPDATE_REQUEST = 'BALANCE_UPDATE_REQUEST';
export const BALANCE_UPDATE_SUCCESS = 'BALANCE_UPDATE_SUCCESS';
export const BALANCE_UPDATE_FAIL = 'BALANCE_UPDATE_FAIL';
export const UPDATE_BALANCE = 'UPDATE_BALANCE';

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

export function earn_online(accountId) {
  return function (dispatch, getState) {
    api(getState).patch(`/api/v1/accounts/${accountId}/balance` ).then(function (response) {
      // console.log('update balance returns:', response.data);
      // console.log('update balance returns:', response.data.new_balance);
      dispatch(updateBalance(response.data.new_balance, 0));
    }).catch(function (error) {
      dispatch(balanceUpdateFail(error));
    });
  };
}

