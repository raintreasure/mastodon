import axios from 'axios';
import {transferAbi} from '../utils/web3';
import Web3 from "web3";

export const SWITCH_BLOCKCHAIN = 'SWITCH_BLOCKCHAIN';

export const blockchains = new Map();
blockchains.set('polygon', {
  chainId: "0x89",
  displayName: "Polygon",
  chainNamespace: "eip155",
  tickerName: "Matic",
  ticker: "MATIC",
  decimals: 18,
  rpcTarget: "https://polygon-rpc.com",
  blockExplorer: "https://polygonscan.com/",
});
blockchains.set('bsc', {
  chainId: "0x38",
  displayName: "BSC",
  chainNamespace: "eip155",
  tickerName: "BNB",
  ticker: "BNB",
  decimals: 18,
  rpcTarget: "https://bsc-dataseed2.binance.org",
  blockExplorer: "https://bscscan.com/",
});

export const switchBlockchain = (chain) => {

  // console.log(`going to switch to ${'goerli'}`);
  console.log(`going to switch to ${chain}`);
  return async function (dispatch) {
    await web3auth.connect();
    // const chainConfig = blockchains.get('goerli');
    const chainConfig = blockchains.get(chain);
    console.log(' chain config:', chainConfig);
    if (chainConfig && window.web3auth) {
      console.log(`web3auth is connected: ${window.web3auth.connected}`)
      console.log(`web3auth status: ${window.web3auth.status}`)
      window.web3auth.switchChain({chainId: chainConfig.chainId}).then(async () => {
        console.log('first switch success');
        const Web3 = require('web3');
        const web3 = new Web3(window.web3auth.provider);
        const chainId = await web3.eth.getChainId();
        console.log(`current chainid is ${chainId}`);
        dispatch(switchBlockchainSuccess(chain));
      }).catch(async (e) => {
        console.log('first switch error:', e);
        await window.web3auth.addChain(chainConfig)

        window.web3auth.switchChain({chainId: chainConfig.chainId}).then(async () => {
            console.log('second switch success');
            dispatch(switchBlockchainSuccess(chain));
            const Web3 = require('web3');
            const web3 = new Web3(window.web3auth.provider);
            const chainId = await web3.eth.getChainId();
            console.log(`current chainid is ${chainId}`);
          },
        ).catch(e => {
          console.log('Failed to switch chain, error:', e);
        });
      });
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
  const Web3 = require('web3');
  const web3 = new Web3(window.web3auth.provider);
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

export function getGasPrice() {
  switch (process.env.REACT_APP_DAO) {
    case 'chinesedao':
      return getPolygonGasPrice;
    case 'facedao':
      return getBSCGasPrice;
    default:
      return getPolygonGasPrice;
  }
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
