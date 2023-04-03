import { useCallback } from 'react';

import { FormattedMessage } from 'react-intl';



import { openModal } from 'mastodon/actions/modal';
import { registrationsOpen } from 'mastodon/initial_state';
import { useAppDispatch } from 'mastodon/store';

const SignInBanner = () => {
  const dispatch = useAppDispatch();

  const openClosedRegistrationsModal = useCallback(
    () => dispatch(openModal({ modalType: 'CLOSED_REGISTRATIONS' })),
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

      <a href='/auth/sign_in' className='button button--block'><FormattedMessage id='sign_in_banner.web3auth_login' defaultMessage='Web3Auth Sign in' /></a>
      <a href='/auth/sign_in' className='button button--block button-tertiary'><FormattedMessage id='sign_in_banner.sign_in' defaultMessage='Email Sign in' /></a>
      {signupButton}
    </div>
  );
};

export default SignInBanner;
