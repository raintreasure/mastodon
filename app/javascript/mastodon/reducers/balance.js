import {
  BALANCE_UPDATE_FAIL, UPDATE_BALANCE,
} from '../actions/balance';

import { Map as ImmutableMap } from 'immutable';

const initialState = ImmutableMap();

export default function balance(state = initialState, action) {
  switch (action.type) {
  case UPDATE_BALANCE:
    return state.withMutations((state) => {
      state.setIn(['new_balance'], { new_balance: action.new_balance, balance_increment:action.balance_increment });
      // state.setIn(['balance_increment'], action.balance_increment);
    });
  case BALANCE_UPDATE_FAIL:
    return state;
  default:
    return state;
  }
}
