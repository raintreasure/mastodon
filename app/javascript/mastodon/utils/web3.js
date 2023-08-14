import {
  BSC_LOVE_CONTRACT_ADDR,
  CHINESE_CONTRACT_ADDR,
  CHINESE_DECIMALS,
  FACEDAO_CONTRACT_ADDR, FACEDAO_DECIMALS, FSN_LOVE_CONTRACT_ADDR,
  LOVE_DECIMALS, PQC_CONTRACT_ADDR, PQC_DECIMALS,
} from '../actions/tokens';
import BigNumber from 'bignumber.js';
import {Web3Auth} from "@web3auth/modal";
import {getIcon} from "mastodon/components/logo";

export const CHAIN_FUSION = 'fusion';
export const CHAIN_BSC = 'bsc';
export const CHAIN_POLYGON = 'polygon';

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

export const getNativeToken = (blockchain) => {
  switch (blockchain) {
    case CHAIN_FUSION:
      return 'FSN';
    case CHAIN_BSC:
      return 'BNB';
    case CHAIN_POLYGON:
      return 'POL';
    default:
      return 'FSN';
  }
};

export const getLoveAddr = (blockchain) => {
  switch (blockchain) {
    case CHAIN_FUSION:
      return FSN_LOVE_CONTRACT_ADDR
    case CHAIN_BSC:
      return BSC_LOVE_CONTRACT_ADDR
    default:
      return FSN_LOVE_CONTRACT_ADDR
  }
}
export const getContractAddr = (token, blockchain) => {
  switch (token) {
    case 'CHINESE':
      return CHINESE_CONTRACT_ADDR;
    case 'LOVE':
      return getLoveAddr(blockchain);
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

export const getThumbnailUrl = ()=>{
  switch (process.env.REACT_APP_DAO) {
    case 'chinesedao':
      return 'preview/preview-chinese.png';
    case 'facedao':
      return 'preview/preview-face.png';
    case 'lovedao':
      return 'preview/preview-love.png';
    case 'pqcdao':
      return '/preview/preview-pqc.jpg';
    default:
      return 'preview/preview.png';
  }
}

export const getServerUrl = () => {
  switch (process.env.REACT_APP_DAO) {
    case 'chinesedao':
      return 'https://chinese.org';
    case 'facedao':
      return 'https://facedao.pro';
    case 'lovedao':
      return 'https://lovedao.org';
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
    case 'lovedao':
      return 'LoveDAO';
    case 'pqcdao':
      return 'PQCdao';
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
  // web3auth.on("DISCONNECT", () => {
  //   alert('web3auth disconnected')
  // })
  // web3auth.on("disconnect", () => {
  //   alert('web3auth disconnected')
  // })
  // web3auth.on("disconnected", () => {
  //   alert('web3auth disconnected')
  // })
}

export const getWeb3Intance = () => {
  const Web3 = require('web3');
  let web3Instance
  if (window.web3auth && window.web3auth.connected) {
    web3Instance = new Web3(window.web3auth.provider);
  } else {
    web3Instance = new Web3(Web3.givenProvider);
  }
  return web3Instance
}
export const getCurrentBlockchain = async () => {
  const web3 = getWeb3Intance();
  const currentChainId = await web3.eth.getChainId()
  console.log("current chain id is ", currentChainId)
  switch (currentChainId) {
    case 56:
      return CHAIN_BSC
    case 138:
      return CHAIN_POLYGON
    case 32659:
      return CHAIN_FUSION
    default:
      return CHAIN_FUSION
  }
}
export const supportEIP1559 = (blockchain) => {
  if (blockchain === CHAIN_BSC || blockchain === CHAIN_FUSION) {
    return false;
  }
  return true
}
