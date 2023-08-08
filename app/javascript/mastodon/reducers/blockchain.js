import { Map as ImmutableMap } from 'immutable';
import {SWITCH_BLOCKCHAIN} from "mastodon/actions/blockchain";

const getDefaultChain = () => {
  switch (process.env.REACT_APP_DAO) {
    case 'chinesedao':
      return 'fusion';
    case 'facedao':
      return 'bsc';
    case 'lovedao':
      return 'fusion';
    case 'pqcdao':
      return 'fusion';
    default:
      return 'fusion';

  }
};
const initialState = ImmutableMap({
  chain: getDefaultChain(),
});

export default function blockchain(state = initialState, action) {
  switch (action.type) {
    case SWITCH_BLOCKCHAIN:
      return state.setIn(['chain'], action.chain);
    default:
      return state;
  }
}
