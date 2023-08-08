import {
  CHINESE_CONTRACT_ADDR,
  CHINESE_DECIMALS,
  FACEDAO_CONTRACT_ADDR, FACEDAO_DECIMALS,
  LOVE_CONTRACT_ADDR,
  LOVE_DECIMALS, PQC_CONTRACT_ADDR, PQC_DECIMALS,
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
      return 'FaceDAO';
    case 'lovedao':
      return 'LOVE';
    case 'pqcdao':
      return 'PQC';
    default:
      return 'CHINESE';
  }
};

export const getNativeToken = () => {
  switch (process.env.REACT_APP_DAO) {
    case 'chinesedao':
      return 'FSN';
    case 'facedao':
      return 'BNB';
    case 'lovedao':
      return 'FSN';
    case 'pqcdao':
      return 'FSN';
    default:
      return 'FSN';
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
    case 'PQC':
      return PQC_CONTRACT_ADDR;
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
    case 'PQC':
      return PQC_DECIMALS;
    default:
      return CHINESE_DECIMALS;
  }
};

export const getServerUrl = () => {
  switch (process.env.REACT_APP_DAO) {
    case 'chinesedao':
      return 'https://chinese.org';
    case 'facedao':
      return 'https://facedao.pro';
    case 'pqcdao':
      return 'https://pqc.org';
    default:
      return 'https://chinese.org';
  }
}

export const getServerName = () => {
  switch (process.env.REACT_APP_DAO) {
    case 'chinesedao':
      return 'ChineseDAO';
    case 'facedao':
      return 'FaceDAO';
    case 'pqcdao':
      return 'PQCDAO';
    default:
      return 'ChineseDAO';
  }
}
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
    case 'lovedao':
      return 1e18;
    case 'pqcdao':
      return 1e18;
    default:
      return 1e18;
  }
};

export const GWei = 1e9;

const FSNConf = {
  displayName: 'Fusion',
  tickerName: 'FSN',
  ticker: 'FSN',
  chainNamespace: "eip155",
  chainId: '0x7f93',
  rpcTarget: 'https://mainnet.fusionnetwork.io',
  blockExplorer: 'https://fsnscan.com/',
}

const getChainConfig = () => {
  switch (process.env.REACT_APP_DAO) {
    case 'chinesedao':
      return FSNConf;
    case 'facedao':
      return {
        chainNamespace: "eip155",
        chainId: '0x38',
      };
    case 'lovedao':
      return FSNConf;
    case 'pqcdao':
      return FSNConf;
    default:
      return FSNConf;
  }
}

export const initWeb3auth = async () => {
  const clientId = process.env.REACT_APP_WEB3AUTH_CLIENT_ID;
  const web3auth = new Web3Auth({
    clientId: clientId,
    chainConfig: getChainConfig(),
    uiConfig: {
      appLogo: getIcon(),
      loginMethodsOrder: ['twitter', 'facebook', 'discord', 'google']
    }
  });
  window.web3auth = web3auth;
  await web3auth.initModal();
}
