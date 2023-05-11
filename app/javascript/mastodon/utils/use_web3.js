
export const getWeb3 = () => {
  // if logged in by web3auth
  if (window.web3auth.provider) {
    const Web3 = require('web3');
    return new Web3(window.web3auth.provider);
  }
  // if logged in by web3 email
  console.log('http provider chosen');
  const Web3 = require('web3');
  const provider = new Web3.providers.HttpProvider('https://mainnet.fusionnetwork.io');
  const web3 = new Web3(provider);

  return web3;
};

