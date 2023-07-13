import {
  CHINESE_CONTRACT_ADDR,
  CHINESE_DECIMALS,
  FACEDAO_CONTRACT_ADDR, FACEDAO_DECIMALS,
  LOVE_CONTRACT_ADDR,
  LOVE_DECIMALS,
} from '../actions/tokens';
import BigNumber from 'bignumber.js';
import {Web3Auth} from "@web3auth/modal";
import {getIcon} from "mastodon/components/logo";

export function minifyAddress(address) {
  if (address.length < 16) return address;
  const start = address.slice(0, 7);
  const end = address.slice(address.length - 7);
  return `${start}...${end}`;
}

export const transferAbi = [
  {
    'constant': false,
    'inputs': [
      {
        'name': '_to',
        'type': 'address',
      },
      {
        'name': '_value',
        'type': 'uint256',
      },
    ],
    'name': 'transfer',
    'outputs': [
      {
        'name': '',
        'type': 'bool',
      },
    ],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
];
export const getEarnToken = () => {
  switch (process.env.REACT_APP_DAO) {
    case 'chinesedao':
      return 'CHINESE';
    case 'facedao':
      return 'LOVE';
    default:
      return 'CHINESE';
  }
};

export const getNativeToken = () => {
  switch (process.env.REACT_APP_DAO) {
    case 'chinesedao':
      return 'MATIC';
    case 'facedao':
      return 'BNB';
    default:
      return 'MATIC';
  }
};

export const getContractAddr = (token) => {
  switch (token) {
    case 'CHINESE':
      return CHINESE_CONTRACT_ADDR;
    case 'LOVE':
      return LOVE_CONTRACT_ADDR;
    case 'FaceDAO':
      return FACEDAO_CONTRACT_ADDR;
    default:
      return CHINESE_CONTRACT_ADDR;
  }
};
export const getContractDecimal = (token) => {
  switch (token) {
    case 'CHINESE':
      return CHINESE_DECIMALS;
    case 'LOVE':
      return LOVE_DECIMALS;
    case 'FaceDAO':
      return FACEDAO_DECIMALS;
    default:
      return CHINESE_DECIMALS;
  }
};
export const getChainId = () => {
  switch (process.env.REACT_APP_DAO) {
    case 'chinesedao':
      return '0x89';
    case 'facedao':
      return '0x38';
    default:
      return '0x89';
  }
};
export const getAmountWithDecimals = (amount, token) => {
  const amountWithDecimals = new BigNumber(amount).multipliedBy(getContractDecimal(token));
  return amountWithDecimals.toFixed(0);
};

export const getNativeTokenDecimals = () => {
  switch (process.env.REACT_APP_DAO) {
    case 'chinesedao':
      return 1e18;
    case 'facedao':
      return 1e18;
    default:
      return 1e18;
  }
};

export const GWei = 1e9;

const getDefaultChainId = () => {
  switch (process.env.REACT_APP_DAO) {
    case 'chinesedao':
      return '0x89';
    case 'facedao':
      return '0x38';
    case 'lovedao':
      return '0x89';
    default:
      return '0x89';
  }
}

export const initWeb3auth = async () => {
  const clientId = process.env.REACT_APP_WEB3AUTH_CLIENT_ID;
  const web3auth = new Web3Auth({
    clientId: clientId,
    chainConfig: {
      chainNamespace: "eip155",
      chainId: getDefaultChainId(),
    },
    uiConfig: {
      appLogo: getIcon(),
      loginMethodsOrder:['twitter', 'facebook', 'discord', 'google']
    }
  });
  window.web3auth = web3auth;
  await web3auth.initModal();
}
