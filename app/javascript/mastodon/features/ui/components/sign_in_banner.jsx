import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';
import { registrationsOpen } from 'mastodon/initial_state';
import { openModal } from 'mastodon/actions/modal';

const SignInBanner = () => {
  const dispatch = useDispatch();

  const openClosedRegistrationsModal = useCallback(
    () => dispatch(openModal('CLOSED_REGISTRATIONS')),
    [dispatch],
  );

  let signupButton;

  if (registrationsOpen) {
    signupButton = (
      <a href='/auth/sign_up' className='button button--block button-tertiary'>
        <FormattedMessage id='sign_in_banner.create_account' defaultMessage='Email Sign up' />
      </a>
    );
  } else {
    signupButton = (
      <button className='button button--block button-tertiary' onClick={openClosedRegistrationsModal}>
        <FormattedMessage id='sign_in_banner.create_account' defaultMessage='Email Sign up' />
      </button>
    );
  }


  return (
    <div className='sign-in-banner'>
      <p><FormattedMessage id='sign_in_banner.text' defaultMessage='Sign in to follow profiles or hashtags, favourite, share and reply to posts. You can also interact from your account on a different server.' /></p>

      {/* <button className='button button--block' onClick={web3authLogin}><FormattedMessage id='sign_in_banner.web3auth_login' defaultMessage='Web3Auth Sign in' /></button>
      <button className='button button--block' onClick={logout}><FormattedMessage id='sign_in_banner.web3auth_logout' defaultMessage='Web3Auth Logout' /></button> */}

      <a href='/auth/sign_in?type=web3auth' className='button button--block'><FormattedMessage id='sign_in_banner.web3auth_login' defaultMessage='Web3Auth Sign in' /></a>
      <a href='/auth/sign_in?type=email' className='button button--block button-tertiary'><FormattedMessage id='sign_in_banner.sign_in' defaultMessage='Email Sign in' /></a>
      {signupButton}
    </div>
  );
};

export default SignInBanner;
