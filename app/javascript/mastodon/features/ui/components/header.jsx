import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';

import { Link, withRouter } from 'react-router-dom';

import { connect } from 'react-redux';

import { openModal } from 'mastodon/actions/modal';
import { fetchServer } from 'mastodon/actions/server';
import { Avatar } from 'mastodon/components/avatar';
import { Icon } from 'mastodon/components/icon';
import { WordmarkLogo, SymbolLogo } from 'mastodon/components/logo';
import { me } from 'mastodon/initial_state';
import Web3authLoginNoBlock from './web3auth_login_noblock';
import Balance from './balance';

const Account = connect(state => ({
  account: state.getIn(['accounts', me]),
}))(({ account }) => (
  <Link to={`/@${account.get('acct')}`} title={account.get('acct')}>
    <Avatar account={account} size={35} />
  </Link>
));

const messages = defineMessages({
  search: { id: 'navigation_bar.search', defaultMessage: 'Search' },
});

const mapStateToProps = (state) => ({
  signupUrl: state.getIn(['server', 'server', 'registrations', 'url'], null) || '/auth/sign_up',
});

const mapDispatchToProps = (dispatch) => ({
  openClosedRegistrationsModal() {
    dispatch(openModal({ modalType: 'CLOSED_REGISTRATIONS' }));
  },
  dispatchServer() {
    dispatch(fetchServer());
  }
});

class Header extends PureComponent {

  static contextTypes = {
    identity: PropTypes.object,
  };

  static propTypes = {
    openClosedRegistrationsModal: PropTypes.func,
    location: PropTypes.object,
    signupUrl: PropTypes.string.isRequired,
    dispatchServer: PropTypes.func,
    intl: PropTypes.object.isRequired,
  };

  componentDidMount () {
    const { dispatchServer } = this.props;
    dispatchServer();
  }

  render () {
    const { signedIn } = this.context.identity;
    const { location, openClosedRegistrationsModal, signupUrl, intl } = this.props;

    let content;

    if (signedIn) {
      content = (
        <>
          {location.pathname !== '/search' && <Link to='/search' className='button button-secondary' aria-label={intl.formatMessage(messages.search)}><Icon id='search' /></Link>}
          {location.pathname !== '/publish' && <Link to='/publish' className='button button-secondary'><FormattedMessage id='compose_form.publish_form' defaultMessage='New post' /></Link>}
          <Account />
        </>
      );
    } else {

      content = (
        <>
          <Web3authLoginNoBlock />
          <a href='/auth/sign_in' className='button' style={{ maxWidth:'40%' }}><FormattedMessage id='sign_in_banner.sign_in' defaultMessage='Sign in' /></a>
        </>
      );
    }

    return (
      <>
        <div className='ui__header'>
          <div className={'ui__header__upper'}>
            <Link to='/' className='ui__header__logo'>
              <WordmarkLogo />
              <SymbolLogo />
            </Link>
            <div className='ui__header__links'>
              {content}
            </div>
          </div>
          <Balance is_side_bar={false} />
        </div>
      </>
    );
  }

}

export default injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(Header)));
