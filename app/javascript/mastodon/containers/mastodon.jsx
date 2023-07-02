import PropTypes from 'prop-types';
import {PureComponent} from 'react';

import {Helmet} from 'react-helmet';
import {BrowserRouter, Route} from 'react-router-dom';

import {Provider as ReduxProvider} from 'react-redux';

import {ScrollContext} from 'react-router-scroll-4';

import {fetchCustomEmojis} from 'mastodon/actions/custom_emojis';
import {hydrateStore} from 'mastodon/actions/store';
import {connectUserStream} from 'mastodon/actions/streaming';
import ErrorBoundary from 'mastodon/components/error_boundary';
import UI from 'mastodon/features/ui';
import initialState, {title as siteTitle} from 'mastodon/initial_state';
import {IntlProvider} from 'mastodon/locales';
import {store} from 'mastodon/store';
import {Web3Auth} from "@web3auth/modal";

const title = process.env.NODE_ENV === 'production' ? siteTitle : `${siteTitle} (Dev)`;

const hydrateAction = hydrateStore(initialState);

store.dispatch(hydrateAction);
if (initialState.meta.me) {
  store.dispatch(fetchCustomEmojis());
}

const createIdentityContext = state => ({
  signedIn: !!state.meta.me,
  accountId: state.meta.me,
  disabledAccountId: state.meta.disabled_account_id,
  accessToken: state.meta.access_token,
  permissions: state.role ? state.role.permissions : 0,
});

export default class Mastodon extends PureComponent {

  static childContextTypes = {
    identity: PropTypes.shape({
      signedIn: PropTypes.bool.isRequired,
      accountId: PropTypes.string,
      disabledAccountId: PropTypes.string,
      accessToken: PropTypes.string,
    }).isRequired,
  };

  identity = createIdentityContext(initialState);

  getChildContext() {
    return {
      identity: this.identity,
    };
  }

  async initWeb3auth() {
    const clientId = 'BM8O9IFmbeLZblS4bv6vX87yGiEOdsCPoSSD4QCgtM0I4l1pXz6GzQTwdSAlOelLl_xdYYtFDnIMj1R3uo9jl7M'; // get your clientId from https://dashboard.web3auth.io
    const web3auth = new Web3Auth({
      clientId: clientId, // Get your Client ID from Web3Auth Dashboard
      chainConfig: {
        chainNamespace: "eip155",
        chainId: "0x1",
      },
    });
    await web3auth.initModal();
    window.web3auth = web3auth;
  }

  componentDidMount() {
    if (!window.web3auth) {
      this.initWeb3auth();
    }

    if (this.identity.signedIn) {
      this.disconnect = store.dispatch(connectUserStream());
    }
  }

  componentWillUnmount() {
    if (this.disconnect) {
      this.disconnect();
      this.disconnect = null;
    }
  }

  shouldUpdateScroll(prevRouterProps, {location}) {
    return !(location.state?.mastodonModalKey && location.state?.mastodonModalKey !== prevRouterProps?.location?.state?.mastodonModalKey);
  }

  render() {
    return (
      <IntlProvider>
        <ReduxProvider store={store}>
          <ErrorBoundary>
            <BrowserRouter>
              <ScrollContext shouldUpdateScroll={this.shouldUpdateScroll}>
                <Route path='/' component={UI}/>
              </ScrollContext>
            </BrowserRouter>

            <Helmet defaultTitle={title} titleTemplate={`%s - ${title}`}/>
          </ErrorBoundary>
        </ReduxProvider>
      </IntlProvider>
    );
  }

}
