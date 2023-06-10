import { Buffer } from 'buffer';
// @ts-ignore
window.Buffer = Buffer;

// import { Web3Auth } from '@web3auth/modal';  web3auth/modal only appears after 3.0.0, when web3auth started to
// support react18, since mastodon is using react 16, we use @web3auth/web3auth instead
import { Web3Auth } from '@web3auth/web3auth';
import { TorusWalletConnectorPlugin } from '@web3auth/torus-wallet-connector-plugin';
// Adapters

import { WalletConnectV1Adapter } from '@web3auth/wallet-connect-v1-adapter';
import { MetamaskAdapter } from '@web3auth/metamask-adapter';
import { TorusWalletAdapter } from '@web3auth/torus-evm-adapter';



(async function init() {
  // $(".btn-logged-in").hide();
  // $("#sign-tx").hide();
  const getChainId = () => {
    switch (process.env.REACT_APP_DAO) {
    case 'chinesedao':
      return '0x89';
    case 'facedao':
      return '0x38';
    default:
      return '0x89';
    }
  };
  const getRpcUrl = () => {
    switch (process.env.REACT_APP_DAO) {
    case 'chinesedao':
      return 'https://rpc.ankr.com/polygon';
    case 'facedao':
      return 'https://rpc.ankr.com/bsc';
    default:
      return 'https://rpc.ankr.com/polygon';
    }
  };
  const getWeb3authName = () => {
    switch (process.env.REACT_APP_DAO) {
    case 'chinesedao':
      return 'Chinese.org';
    case 'facedao':
      return 'FaceDAO.com';
    default:
      return 'Chinese.org';
    }
  };
  const clientId = process.env.REACT_APP_WEB3AUTH_CLIENT_ID;
  window.web3auth = new Web3Auth({
    clientId,
    chainConfig: {
      chainNamespace: 'eip155',
      chainId: getChainId(),
      rpcTarget: getRpcUrl(), // This is the public RPC we have added, please pass on your own endpoint while creating an app
    },
    uiConfig: {
      appName: getWeb3authName(),
      appLogo: '/images/icon.png',
      theme: 'light',
      loginMethodsOrder: ['twitter', 'google'],
    },
  });

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
  await window.web3auth.addPlugin(torusPlugin);

  const metamaskAdapter = new MetamaskAdapter({
    clientId,
    sessionTime: 86400, // 1 hour in seconds

    // // web3AuthNetwork: 'testnet',
    // chainConfig: {
    //   chainNamespace: 'eip155',
    //   chainId: '0x7f93',
    //   rpcTarget: 'https://mainnet.fusionnetwork.io', // This is the public RPC we have added, please pass on your own endpoint while creating an app
    // },
  });
  window.web3auth.configureAdapter(metamaskAdapter);

  const walletConnectAdapter =
    new WalletConnectV1Adapter({
      adapterSettings: {
        bridge: 'https://bridge.walletconnect.org',
      },
      clientId,
    });
  window.web3auth.configureAdapter(walletConnectAdapter);
  const torusAdapter = new TorusWalletAdapter({
    clientId,
  });
  window.web3auth.configureAdapter(torusAdapter);
  await window.web3auth.initModal();
})();
