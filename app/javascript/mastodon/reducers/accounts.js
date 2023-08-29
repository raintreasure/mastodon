import {Map as ImmutableMap, fromJS, List as ImmutableList } from 'immutable';
import {ACCOUNT_REVEAL, FETCH_SUBSCRIBING_ACCOUNTS} from 'mastodon/actions/accounts';
import {ACCOUNT_IMPORT, ACCOUNTS_IMPORT} from 'mastodon/actions/importer';

const initialState = ImmutableMap();

const normalizeAccount = (state, account) => {
  account = {...account};

  delete account.followers_count;
  delete account.following_count;
  delete account.statuses_count;

  account.hidden = state.getIn([account.id, 'hidden']) === false ? false : account.limited;

  return state.set(account.id, fromJS(account));
};

const normalizeAccounts = (state, accounts) => {
  accounts.forEach(account => {
    state = normalizeAccount(state, account);
  });

  return state;
};

export default function accounts(state = initialState, action) {
  switch (action.type) {
    case ACCOUNT_IMPORT:
      return normalizeAccount(state, action.account);
    case ACCOUNTS_IMPORT:
      return normalizeAccounts(state, action.accounts);
    case ACCOUNT_REVEAL:
      return state.setIn([action.id, 'hidden'], false);
    case FETCH_SUBSCRIBING_ACCOUNTS:
      return state.set('subscribing_accounts', ImmutableList(action.accounts.map(acc => acc.target_account_id)))
    default:
      return state;
  }
}
