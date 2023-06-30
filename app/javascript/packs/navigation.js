import web3auth from './use_web3auth';

function web3authLogout () {
  web3auth.logout();
}

const logout = document.getElementById('logout');
logout.addEventListener('click', web3authLogout);