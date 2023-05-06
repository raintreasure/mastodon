import React from 'react';
import { connect } from 'react-redux';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import {
  lookupAccount,
  fetchAccount,
} from '../../actions/accounts';
import { FormattedMessage } from 'react-intl';
import Column from '../ui/components/column';
import HeaderContainer from '../account_timeline/containers/header_container';
import ColumnBackButton from '../../components/column_back_button';
import MissingIndicator from 'mastodon/components/missing_indicator';
import TimelineHint from 'mastodon/components/timeline_hint';
import LimitedAccountHint from '../account_timeline/components/limited_account_hint';
import { getAccountHidden } from 'mastodon/selectors';
import { normalizeForLookup } from 'mastodon/reducers/accounts_map';
import { fetchTokens } from '../../actions/tokens';
import { FSN_ICON, CHNG_ICON, ETH_ICON, USDT_ICON, USDC_ICON, CHINESE_ICON } from '../../../icons/data';

const mapStateToProps = (state, { params: { acct, id } }) => {
  const accountId = id || state.getIn(['accounts_map', normalizeForLookup(acct)]);

  if (!accountId) {
    return {
      isLoading: true,
    };
  }

  return {
    accountId,
    account: state.getIn(['accounts', accountId]),
    remote: !!(state.getIn(['accounts', accountId, 'acct']) !== state.getIn(['accounts', accountId, 'username'])),
    remoteUrl: state.getIn(['accounts', accountId, 'url']),
    isAccount: !!state.getIn(['accounts', accountId]),
    hasMore: !!state.getIn(['user_lists', 'following', accountId, 'next']),
    isLoading: state.getIn(['user_lists', 'tokens', accountId, 'isLoading'], true),
    balanceFSN: state.getIn(['user_lists', 'tokens', accountId, 'balance', 'FSN'], '0'),
    balanceCHINESE: state.getIn(['user_lists', 'tokens', accountId, 'balance', 'CHINESE'], '0'),
    balanceCHNG: state.getIn(['user_lists', 'tokens', accountId, 'balance', 'CHNG'], '0'),
    balanceETH: state.getIn(['user_lists', 'tokens', accountId, 'balance', 'ETH'], '0'),
    balanceUSDT: state.getIn(['user_lists', 'tokens', accountId, 'balance', 'USDT'], '0'),
    balanceUSDC: state.getIn(['user_lists', 'tokens', accountId, 'balance', 'USDC'], '0'),
    suspended: state.getIn(['accounts', accountId, 'suspended'], false),
    hidden: getAccountHidden(state, accountId),
    blockedBy: state.getIn(['relationships', accountId, 'blocked_by'], false),
  };
};

const RemoteHint = ({ url }) => (
  <TimelineHint url={url} resource={<FormattedMessage id='timeline_hint.resources.follows' defaultMessage='Follows' />} />
);

RemoteHint.propTypes = {
  url: PropTypes.string.isRequired,
};

class Tokens extends ImmutablePureComponent {

  static propTypes = {
    params: PropTypes.shape({
      acct: PropTypes.string,
      id: PropTypes.string,
    }).isRequired,
    accountId: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    hasMore: PropTypes.bool,
    isLoading: PropTypes.bool,
    blockedBy: PropTypes.bool,
    isAccount: PropTypes.bool,
    suspended: PropTypes.bool,
    hidden: PropTypes.bool,
    remote: PropTypes.bool,
    remoteUrl: PropTypes.string,
    multiColumn: PropTypes.bool,
    account: PropTypes.object,
    balanceFSN: PropTypes.string,
    balanceCHNG: PropTypes.string,
    balanceETH: PropTypes.string,
    balanceUSDT: PropTypes.string,
    balanceUSDC: PropTypes.string,
    balanceCHINESE: PropTypes.string,
  };

  _load() {
    const { accountId, isAccount, dispatch, account } = this.props;

    if (!isAccount) dispatch(fetchAccount(accountId));
    dispatch(fetchTokens(accountId, account.get('eth_address')));
  }

  componentDidMount() {
    const { params: { acct }, accountId, dispatch } = this.props;

    if (accountId) {
      this._load();
    } else {
      dispatch(lookupAccount(acct));
    }
  }

  componentDidUpdate(prevProps) {
    const { params: { acct }, accountId, dispatch } = this.props;

    if (prevProps.accountId !== accountId && accountId) {
      this._load();
    } else if (prevProps.params.acct !== acct) {
      dispatch(lookupAccount(acct));
    }
  }

  render() {
    const {
      accountId, blockedBy, isAccount, multiColumn, isLoading, suspended, hidden,
      remote, remoteUrl, balanceFSN, balanceCHINESE, balanceCHNG, balanceETH, balanceUSDT, balanceUSDC,
    } = this.props;
    console.log('isLoading is :', isLoading);
    if (!isAccount) {
      return (
        <Column>
          <MissingIndicator />
        </Column>
      );
    }

    let emptyMessage;

    const forceEmptyState = blockedBy || suspended || hidden;

    if (suspended) {
      emptyMessage = <FormattedMessage id='empty_column.account_suspended' defaultMessage='Account suspended' />;
    } else if (hidden) {
      emptyMessage = <LimitedAccountHint accountId={accountId} />;
    } else if (blockedBy) {
      emptyMessage = <FormattedMessage id='empty_column.account_unavailable' defaultMessage='Profile unavailable' />;
    } else if (remote) {
      emptyMessage = <RemoteHint url={remoteUrl} />;
    } else {
      emptyMessage =
        <FormattedMessage id='account.follows.empty' defaultMessage="This user doesn't follow anyone yet." />;
    }

    const remoteMessage = remote ? <RemoteHint url={remoteUrl} /> : null;

    return (
      <Column>
        <ColumnBackButton multiColumn={multiColumn} />
        <HeaderContainer accountId={this.props.accountId} hideTabs />
        {forceEmptyState ?
          emptyMessage
          :
          <div className={'token'}>
            <div className={'token__wrapper'}>
              <div className={'token__item'}>
                <div className={'token__symbol'}>
                  <img src={FSN_ICON} className={'token__icon'} alt={'FSN_ICON'} />
                  <span>FSN</span>
                </div>
                <div>
                  <p>{balanceFSN}</p>
                  <p>$ 0.01</p>
                </div>
              </div>
              <div className={'token__item'}>
                <div className={'token__symbol'}>
                  <img src={CHINESE_ICON} className={'token__icon'}  alt={'CHINESE_ICON'} />
                  <span>CHINESE</span>
                </div>
                <div>
                  <p>{balanceCHINESE}</p>
                  <p>$ 0.01</p>
                </div>
              </div>
              <div className={'token__item'}>
                <div className={'token__symbol'}>
                  <img src={CHNG_ICON} className={'token__icon'} alt={'CHNG_ICON'} />
                  <span>CHNG</span>
                </div>
                <div>
                  <p>{balanceCHNG}</p>
                  <p>$ 0.01</p>
                </div>
              </div>
              <div className={'token__item'}>
                <div className={'token__symbol'}>
                  <img src={ETH_ICON} className={'token__icon'} alt={'ETH_ICON'} />
                  <span>ETH</span>
                </div>
                <div>
                  <p>{balanceETH}</p>
                  <p>$ 0.01</p>
                </div>
              </div>
              <div className={'token__item'}>
                <div className={'token__symbol'}>
                  <img src={USDT_ICON} className={'token__icon'} alt={'USDT_ICON'} />
                  <span>USDT</span>
                </div>
                <div>
                  <p>{balanceUSDT}</p>
                  <p>$ 0.01</p>
                </div>
              </div>
              <div className={'token__item'}>
                <div className={'token__symbol'}>
                  <img src={USDC_ICON} className={'token__icon'} alt={'USDC_ICON'} />
                  <span>USDC</span>
                </div>
                <div>
                  <p>{balanceUSDC}</p>
                  <p>$ 0.01</p>
                </div>
              </div>
            </div>
          </div>
        }
        {remoteMessage}
      </Column>
    );
  }

}

export default connect(mapStateToProps)(Tokens);
