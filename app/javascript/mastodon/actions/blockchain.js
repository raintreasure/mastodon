import axios from 'axios';
import { transferAbi } from '../utils/web3';

export const getGasAmountForTransfer = async (fromAddress, toAddress, amount, contractAddress) => {
  const Web3 = require('web3');
  const web3 = new Web3(window.web3auth.provider);
  const contract = new web3.eth.Contract(transferAbi, contractAddress);
  return new Promise((resolve, reject) => {
    contract.methods.transfer(toAddress, amount).estimateGas({ from: fromAddress }).then(res => {
      resolve(res);
    }).catch(e=>{
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
