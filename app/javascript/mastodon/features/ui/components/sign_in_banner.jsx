import React from 'react';
import { FormattedMessage } from 'react-intl';
import Web3authLogin from './web3auth_login';

const SignInBanner = () => {

  return (
    <div className='sign-in-banner'>
      <p><FormattedMessage id='sign_in_banner.text' defaultMessage='Sign in to follow profiles or hashtags, favourite, share and reply to posts. You can also interact from your account on a different server.' /></p>
      <Web3authLogin />
      <a href='/auth/sign_in' className='button button--block button-tertiary'><FormattedMessage id='sign_in_banner.sign_in' defaultMessage='Web2 Email  Signin/up' /></a>
    </div>
  );
};

export default SignInBanner;
