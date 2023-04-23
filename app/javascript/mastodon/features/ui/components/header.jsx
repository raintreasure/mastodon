import React from 'react';
import Logo from 'mastodon/components/logo';
import { Link, withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { me } from 'mastodon/initial_state';
import Avatar from 'mastodon/components/avatar';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { openModal } from 'mastodon/actions/modal';
import Web3authLoginNoBlock from './web3auth_login_noblock';
import Balance from './balance';

const Account = connect(state => ({
  account: state.getIn(['accounts', me]),
}))(({ account }) => (
  <Link to={`/@${account.get('acct')}`} title={account.get('acct')}>
    <Avatar account={account} size={35} />
  </Link>
));

const mapDispatchToProps = (dispatch) => ({
  openClosedRegistrationsModal() {
    dispatch(openModal('CLOSED_REGISTRATIONS'));
  },
});

class Header extends React.PureComponent {

  static contextTypes = {
    identity: PropTypes.object,
  };

  static propTypes = {
    openClosedRegistrationsModal: PropTypes.func,
    location: PropTypes.object,
  };

  render() {
    const { signedIn } = this.context.identity;
    const { location } = this.props;
    let content;

    if (signedIn) {
      content = (
        <>
          {location.pathname !== '/publish' &&
            <Link to='/publish' className='button'><FormattedMessage
              id='compose_form.publish_form'
              defaultMessage='Publish'
            /></Link>}
          <Account />
        </>
      );
    } else {

      content = (
        <>
          <Web3authLoginNoBlock />
          <a href='/auth/sign_in' className='button' style={{ maxWidth: '40%' }}><FormattedMessage
            id='sign_in_banner.sign_in' defaultMessage='Sign in'
          /></a>
        </>
      );
    }

    return (
      <>
        <div className='ui__header'>
          <div className={'ui__header__upper'}>
            <Link to='/' className='ui__header__logo'><Logo h={'40px'} /></Link>
            <div className='ui__header__links'>
              {content}
            </div>
          </div>
          {signedIn && <Balance is_side_bar={false} />}
        </div>
      </>
    );
  }

}

export default withRouter(connect(null, mapDispatchToProps)(Header));
