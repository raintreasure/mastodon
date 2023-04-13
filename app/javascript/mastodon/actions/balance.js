import api from '../api';

export const BALANCE_UPDATE_REQUEST = 'BALANCE_UPDATE_REQUEST';
export const BALANCE_UPDATE_SUCCESS = 'BALANCE_UPDATE_SUCCESS';
export const BALANCE_UPDATE_FAIL = 'BALANCE_UPDATE_FAIL';

export function balanceUpdateRequest(accountId) {
  return {
    type: BALANCE_UPDATE_REQUEST,
    accountId: accountId,
  };
}

export function balanceUpdateSuccess(newBalance) {
  return {
    type: BALANCE_UPDATE_SUCCESS,
    newBalance: newBalance,
  };
}

export function balanceUpdateFail(error) {
  return {
    type: BALANCE_UPDATE_FAIL,
    error: error,
  };
}

export function increaseBalance(accountId, increment) {
  return function (dispatch, getState) {
    // dispatch(balanceUpdateRequest(accountId));
    api(getState).patch(`/api/v1/accounts/${accountId}/balance`, { increment }).then(function (response) {
      dispatch(balanceUpdateSuccess(response.data.balance));
    }).catch(function (error) {
      dispatch(balanceUpdateFail(error));
    });
  };
}
