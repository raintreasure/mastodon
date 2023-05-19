import { Map as ImmutableMap, List as ImmutableList } from 'immutable';
import {
  FETCH_TRANSACTIONS_REQUEST,
  FETCH_TRANSACTIONS_SUCCESS,
  FETCH_MORE_TRANSACTIONS_SUCCESS,
} from '../actions/transactions';

const ImmutableListState = ImmutableMap({
  next: null,
  isLoading: false,
  items: ImmutableList(),
});
const InitialState = ImmutableMap({
  transactions: ImmutableListState,
});

function appendToTransactions(state, path, transactions, page) {
  const hasMore = transactions.length === 5;
  return state.updateIn(path, map => {
    return map.set('isLoading', false).set('page', page).set('hasMore', hasMore).update('items', items =>
      items.concat(transactions),
    );
  });
}

export default function tokens(state = InitialState, action) {
  switch (action.type) {
  case FETCH_TRANSACTIONS_REQUEST:
    return state.setIn(['transactions', action.accountId, 'isLoading'], true);
  case FETCH_TRANSACTIONS_SUCCESS:
    const hasMore = action.transactions.length === 5;
    return state.setIn(['transactions', action.accountId, 'isLoading'], false)
      .setIn(['transactions', action.accountId, 'items'], action.transactions)
      .setIn(['transactions', action.accountId, 'page'], action.page)
      .setIn(['transactions', action.accountId, 'hasMore'], hasMore);
  case FETCH_MORE_TRANSACTIONS_SUCCESS:
    return appendToTransactions(state, ['transactions', action.accountId], action.transactions, action.page);
  default:
    return state;
  }
}

