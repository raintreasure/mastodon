import React from 'react';
import { FormattedMessage } from 'react-intl';

import { getPublicCompressed } from '@toruslabs/eccrypto';

export default class Web3authLogin extends React.PureComponent {
  formLogin = async () => {
    const web3auth = window.web3auth;
    const inputWeb3authAddress = document.getElementById('user_web3auth_address');
    const inputWeb3authPubkey = document.getElementById('user_web3auth_pubkey');
    const inputWeb3authIdToken = document.getElementById('user_web3auth_id_token');
    const inputUserEmail = document.getElementById('user_email');
    const inputUserName = document.getElementById('user_display_name');
    const inputUserImg = document.getElementById('user_img_url');
    const web3authForm = document.getElementById('new_user');
    try {
      void await web3auth.connect();
      const id_token = await web3auth.authenticateUser();
      const userInfo = await web3auth.getUserInfo();
      if (JSON.stringify(userInfo) === '{}') {
        //wallet, currently do nothing special
      } else {
        //social media
        const app_scoped_privkey = await web3auth.provider?.request({
          method: 'eth_private_key', // use "private_key" for other non-evm chains
        });
        const app_pub_key = getPublicCompressed(Buffer.from(app_scoped_privkey.padStart(64, '0'), 'hex')).toString('hex');
        inputWeb3authPubkey.value = app_pub_key;
        const user = await web3auth.getUserInfo();
        if (user.email !== '') {
          inputUserEmail.value = user.email;
        }
        if (user.name !== '') {
          inputUserName.value = user.name;
        }
        if (user.profileImage !== '') {
          inputUserImg.value = user.profileImage;
        }
      }
      const Web3 = require('web3');
      const web3 = new Web3(window.web3auth.provider);
      const address = (await web3.eth.getAccounts())[0];
      inputWeb3authAddress.value = address;
      inputWeb3authIdToken.value = id_token.idToken;
      if (!inputUserEmail.value) {
        const email = (address + '@web3.com');
        inputUserEmail.value = email;
      }
      web3authForm.submit();
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    return (
      <>
        <button className='button button--block' onClick={this.formLogin}><FormattedMessage
          id='sign_in_banner.web3auth_login' defaultMessage='Sign in'
        /></button>
      </>
    );
  }

}
