import { Buffer } from 'buffer';
// @ts-ignore
window.Buffer = Buffer;

import { Web3Auth } from '@web3auth/modal';
import { TorusWalletConnectorPlugin } from '@web3auth/torus-wallet-connector-plugin';
// Adapters

import { WalletConnectV1Adapter } from '@web3auth/wallet-connect-v1-adapter';
import { MetamaskAdapter } from '@web3auth/metamask-adapter';
import { TorusWalletAdapter } from '@web3auth/torus-evm-adapter';


let web3auth = null;


(async function init() {
  // $(".btn-logged-in").hide();
  // $("#sign-tx").hide();

  const clientId = 'BM8O9IFmbeLZblS4bv6vX87yGiEOdsCPoSSD4QCgtM0I4l1pXz6GzQTwdSAlOelLl_xdYYtFDnIMj1R3uo9jl7M'; // get your clientId from https://dashboard.web3auth.io
  web3auth = new Web3Auth({
    clientId,
    chainConfig: {
      chainNamespace: 'eip155',
      chainId: '0x1',
      rpcTarget: 'https://rpc.ankr.com/eth', // This is the public RPC we have added, please pass on your own endpoint while creating an app
    },
    web3AuthNetwork: 'testnet',
  });
  // Add Torus Wallet Connector Plugin
  const torusPlugin =
    new TorusWalletConnectorPlugin({
      torusWalletOpts: {},
      walletInitOptions: {
        whiteLabel: {
          theme: { isDark: true, colors: { primary: '#00a8ff' } },
          logoDark: 'https://web3auth.io/images/w3a-L-Favicon-1.svg',
          logoLight: 'https://web3auth.io/images/w3a-D-Favicon-1.svg',
        },
        useWalletConnect: true,
        enableLogging: true,
      },
    });
  await web3auth.addPlugin(torusPlugin);

  const metamaskAdapter = new MetamaskAdapter({
    clientId,
    sessionTime: 86400, // 1 hour in seconds
    web3AuthNetwork: 'testnet',
    chainConfig: {
      chainNamespace: 'eip155',
      chainId: '0x1',
      rpcTarget: 'https://rpc.ankr.com/eth', // This is the public RPC we have added, please pass on your own endpoint while creating an app
    },
  });
  web3auth.configureAdapter(metamaskAdapter);

  // we can change the above settings using this function
  // metamaskAdapter.setAdapterSettings({
  //   sessionTime: 86400, // 1 day in seconds
  //   chainConfig: {
  //     chainNamespace: 'eip155',
  //     chainId: '0x1',
  //     rpcTarget: 'https://rpc.ankr.com/eth', // This is the public RPC we have added, please pass on your own endpoint while creating an app
  //   },
  //   web3AuthNetwork: 'testnet',
  // });

  const walletConnectAdapter =
    new WalletConnectV1Adapter({
      adapterSettings: {
        bridge: 'https://bridge.walletconnect.org',
      },
      clientId,
    });
  web3auth.configureAdapter(walletConnectAdapter);
  const torusAdapter = new TorusWalletAdapter({
    clientId,
  });
  web3auth.configureAdapter(torusAdapter);

  await web3auth.initModal();
})();

export default web3auth;