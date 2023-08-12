import { Map as ImmutableMap } from 'immutable';
import {SWITCH_BLOCKCHAIN} from "mastodon/actions/blockchain";
import {CHAIN_BSC, CHAIN_FUSION} from "mastodon/utils/web3";

const getDefaultChain = () => {
  switch (process.env.REACT_APP_DAO) {
    case 'chinesedao':
      return CHAIN_FUSION;
    case 'facedao':
      return CHAIN_BSC;
    case 'lovedao':
      return CHAIN_FUSION;
    case 'pqcdao':
      return CHAIN_FUSION;
    default:
      return CHAIN_FUSION;

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
