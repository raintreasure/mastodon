import web3auth from './use_web3auth';
import { getPublicCompressed } from '@toruslabs/eccrypto';

const inputWeb3authAddress = document.getElementById('user_web3auth_address');
const inputWeb3authPubkey = document.getElementById('user_web3auth_pubkey');
const inputWeb3authIdToken = document.getElementById('user_web3auth_id_token');
const inputUserEmail = document.getElementById('user_email');
var Web3 = require('web3');

const web3authForm = document.getElementById('new_user');
document.getElementById('web3auth_connect').addEventListener('click', async () => {
  try {
    void await web3auth.connect();
    const id_token = await web3auth.authenticateUser();
    const userInfo =  await web3auth.getUserInfo();
    if (JSON.stringify(userInfo) === '{}'){
      //wallet, currently do nothing special
    } else {
      //social media
      const app_scoped_privkey = await web3auth.provider?.request({
        method: 'eth_private_key', // use "private_key" for other non-evm chains
      });
      const app_pub_key = getPublicCompressed(Buffer.from(app_scoped_privkey.padStart(64, '0'), 'hex')).toString('hex');
      inputWeb3authPubkey.value = app_pub_key;
      console.log('web3auth pubkey: ', app_pub_key);
      const user = await web3auth.getUserInfo();
      console.log('user info:', user);
      console.log('social media email:', user.email);
      console.log('social media name:', user.name);
      console.log('social media profile image:', user.profileImage);
    }
    const web3 = new Web3(web3auth.provider);
    const address = (await web3.eth.getAccounts())[0];
    inputWeb3authAddress.value = address;
    console.log('web3auth address: ', address);
    console.log('web3auth id token:', id_token.idToken);
    inputWeb3authIdToken.value = id_token.idToken;
    const email = (address + '@web3.com');
    inputUserEmail.value = email;
    console.log('email:', email);
    web3authForm.submit();
  } catch (error) {
    console.error(error.message);
  }
});

document.getElementById('web3auth_disconnect').addEventListener('click', async () => {
  try {
    console.log('click web3auth logout');
    void await web3auth.logout();
  } catch (error) {
    console.error(error.message);
  }
});
