import axios from 'axios';
import {
  CHAIN_BSC,
  CHAIN_FUSION,
  CHAIN_POLYGON,
  getCurrentBlockchain,
  getLoveAddr,
  getWeb3Intance,
  transferAbi
} from '../utils/web3';
import BigNumber from 'bignumber.js';
import {
  CHINESE_CONTRACT_ADDR,
  FACEDAO_CONTRACT_ADDR,
  PQC_CONTRACT_ADDR
} from "mastodon/actions/tokens";

export const SWITCH_BLOCKCHAIN = 'SWITCH_BLOCKCHAIN';

export const web3authBlockchains = new Map([
  [CHAIN_POLYGON, {
    chainId: "0x89",
    displayName: "Polygon",
    chainNamespace: "eip155",
    tickerName: "Matic",
    ticker: "MATIC",
    decimals: 18,
    rpcTarget: "https://polygon-rpc.com",
    blockExplorer: "https://polygonscan.com/",
  }],
  [CHAIN_BSC, {
    chainId: "0x38",
    displayName: "Binance SmartChain Mainnet",
    chainNamespace: "eip155",
    tickerName: "BNB",
    ticker: "BNB",
    decimals: 18,
    rpcTarget: "https://rpc.ankr.com/bsc",
    blockExplorer: "https://bscscan.com",
  }],
  [CHAIN_FUSION, {
    chainId: "0x7f93",
    displayName: "Fusion",
    chainNamespace: "eip155",
    tickerName: "FSN",
    ticker: "FSN",
    decimals: 18,
    rpcTarget: "https://mainnet.fusionnetwork.io",
    blockExplorer: "https://fsnscan.com/",
  }],
]);


export const eipBlockchains = new Map([
  [CHAIN_BSC, {
    "chainId": "0x38",
    "chainName": "Binance SmartChain Mainnet",
    "rpcUrls": [
      "https://rpc.ankr.com/bsc"
    ],
    "nativeCurrency": {
      "name": "BNB",
      "symbol": "BNB",
      "decimals": 18
    },
    "blockExplorerUrls": [
      "https://bscscan.com/"
    ]
  }],
  [CHAIN_FUSION, {
    "chainId": "0x7f93",
    "chainName": "Fusion",
    "rpcUrls": [
      "https://mainnet.fusionnetwork.io"
    ],
    "nativeCurrency": {
      "name": "FSN",
      "symbol": "FSN",
      "decimals": 18
    },
    "blockExplorerUrls": [
      "https://fsnscan.com/"
    ]
  }],
  [CHAIN_POLYGON, {
    "chainId": "0x89",
    "chainName": "Polygon",
    "rpcUrls": [
      "https://polygon-rpc.com"
    ],
    "nativeCurrency": {
      "name": "MATIC",
      "symbol": "MATIC",
      "decimals": 18
    },
    "blockExplorerUrls": [
      "https://polygonscan.com/"
    ]
  }],
]);


export const switchToBSC = () => {
  return async function (dispatch) {
    const {ethereum} = window;
    try {
      ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{chainId: '0x38'}],
      }).then(()=>{
        dispatch(switchBlockchainSuccess(CHAIN_BSC));
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        console.log('switch error, should add chain')
      }
    }
  }
}
export const switchToFSN = () => {
  return async function (dispatch) {
    const {ethereum} = window;
    try {
      ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{chainId: '0x7f93'}],
      }).then(()=>{
        dispatch(switchBlockchainSuccess(CHAIN_FUSION));
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        console.log('switch error, should add chain')
      }
    }
  }
}
export const addBSC = () => {
  return async function (dispatch) {
    await window.ethereum.request({
      "method": "wallet_addEthereumChain",
      "params": [
        {
          "chainId": "0x38",
          "chainName": "Binance smart chain",
          "rpcUrls": [
            "https://bsc-dataseed.binance.org/"
          ],
          "nativeCurrency": {
            "name": "BNB",
            "symbol": "BNB",
            "decimals": 18
          },
          "blockExplorerUrls": [
            "https://bscscan.com/"
          ]
        }
      ]
    });
  }
}

export const switchBlockchain = (chain) => {

  // console.log(`going to switch to ${'goerli'}`);
  console.log(`going to switch to ${chain}`);
  return async function (dispatch) {
    const chainConfig = web3authBlockchains.get(chain);
    if (chainConfig && window.web3auth) {
      console.log(`web3auth is connected: ${window.web3auth.connected}`)
      console.log(`web3auth status: ${window.web3auth.status}`)
      if (window.web3auth.connected) {
        window.web3auth.switchChain({chainId: chainConfig.chainId}).then(async () => {
          const Web3 = require('web3');
          const web3 = new Web3(window.web3auth.provider);
          const chainId = await web3.eth.getChainId();
          console.log(`current chainid is ${chainId}`);
          dispatch(switchBlockchainSuccess(chain));
        }).catch(async (e) => {
          console.log('try add chain after first switch error:', e);
          await window.web3auth.addChain(chainConfig)
        });
      } else {
        const {ethereum} = window;
        const eipChainConfig = eipBlockchains.get(chain)
        try {
          ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{chainId: eipChainConfig.chainId}],
          }).then(()=>{
            dispatch(switchBlockchainSuccess(chain));
          });
        } catch (switchError) {
          // This error code indicates that the chain has not been added to MetaMask.
          if (switchError.code === 4902) {
            console.log('switch error, try add chain')
            ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [eipChainConfig],
            }).then(()=>{
              dispatch(switchBlockchainSuccess(chain));
            });
          }
        }
      }
    }
  };
};

export function switchBlockchainSuccess(chain) {
  return {
    type: SWITCH_BLOCKCHAIN,
    chain: chain,
  };
}

export const getGasAmountForTransfer = async (fromAddress, toAddress, amount, contractAddress) => {
  const web3 = getWeb3Intance()
  const contract = new web3.eth.Contract(transferAbi, contractAddress);
  return new Promise((resolve, reject) => {
    contract.methods.transfer(toAddress, amount).estimateGas({from: fromAddress}).then(res => {
      resolve(res);
    }).catch(e => {
      console.log('get GasAmount For Transfer error:', e);
      reject(e);
    });
  });
};

export function getGasPrice_bak() {
  switch (process.env.REACT_APP_DAO) {
    case 'chinesedao':
      return getFusionGasPrice;
    case 'facedao':
      return getBSCGasPrice;
    case 'lovedao':
      return getPolygonGasPrice;
    case 'pqcdao':
      return getFusionGasPrice;
    default:
      return getPolygonGasPrice;
  }
}

export function getGasPrice(blockchain) {
  switch (blockchain) {
    case CHAIN_FUSION:
      return getFusionGasPrice;
    case CHAIN_BSC:
      return getBSCGasPrice;
    case CHAIN_POLYGON:
      return getPolygonGasPrice;
    default:
      return getFusionGasPrice;
  }
}

async function getFusionGasPrice() {
  return new Promise((resolve, reject) => {
      axios.post('https://mainnet.fusionnetwork.io',
        {
          jsonrpc: '2.0',
          method: 'eth_gasPrice',
          params: [],
          id: 1,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }).then(res => {
        resolve(BigNumber(res.data.result).dividedBy(1e9).toNumber());
      }).catch(e => {
        console.log('get fsn gas price error:', e);
        reject(e);
      })
    }
  )
}

async function getBSCGasPrice() {
  return new Promise((resolve, reject) => {
    axios.get('https://api.bscscan.com/api', {
      params: {
        module: 'gastracker',
        action: 'gasoracle',
        apiKey: process.env.REACT_APP_BSCSCAN_API_KEY,
      },
    }).then(res => {
      console.log('get bsc gas price:', res.data.result);
      resolve(res.data.result.ProposeGasPrice);
    }).catch(e => {
      console.log('get bsc gas price error:', e);
      reject(e);
    });
  });
}

async function getPolygonGasPrice() {
  return new Promise((resolve, reject) => {
    axios.get('https://api.polygonscan.com/api', {
      params: {
        module: 'gastracker',
        action: 'gasoracle',
        apiKey: process.env.REACT_APP_POLYSCAN_API_KEY,
      },
    }).then(res => {
      console.log('get pol gas price:', res.data);
      resolve(res.data.result.ProposeGasPrice);
    }).catch(e => {
      console.log('get pol gas price error:', e);
      reject(e);
    });
  });
}

export const getWithdrawContractAddr = () => {
  switch (process.env.REACT_APP_DAO) {
    case 'chinesedao':
      return CHINESE_CONTRACT_ADDR;
    case 'facedao':
      return FACEDAO_CONTRACT_ADDR;
    case 'lovedao':
      return getLoveAddr();
    case 'pqcdao':
      return PQC_CONTRACT_ADDR;
    default:
      return CHINESE_CONTRACT_ADDR;
  }
};

export const switchChainIfNeeded = async (expectedBlockchain, dispatch) => {
  const currentBlockchain = await getCurrentBlockchain();
  if (currentBlockchain !== expectedBlockchain) {
    dispatch(switchBlockchain(expectedBlockchain));
  }
}
