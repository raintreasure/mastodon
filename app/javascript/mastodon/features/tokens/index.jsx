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
import {
  ETH_ICON,
  USDT_ICON,
  USDC_ICON,
  CHINESE_ICON,
  POL_ICON,
  BNB_ICON,
  FACE_ICON,
  LOVE_ICON,
} from '../../../icons/data';
import { daoName } from '../../initial_state';

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
    balancePOL: state.getIn(['user_lists', 'tokens', accountId, 'balance', 'POL'], '0'),
    valuePOL: state.getIn(['user_lists', 'tokens', accountId, 'value', 'POL'], '0'),
    balanceBNB: state.getIn(['user_lists', 'tokens', accountId, 'balance', 'BNB'], '0'),
    valueBNB: state.getIn(['user_lists', 'tokens', accountId, 'value', 'BNB'], '0'),
    balanceCHINESE: state.getIn(['user_lists', 'tokens', accountId, 'balance', 'CHINESE'], '0'),
    valueCHINESE: state.getIn(['user_lists', 'tokens', accountId, 'value', 'CHINESE'], '0'),
    balanceLOVE: state.getIn(['user_lists', 'tokens', accountId, 'balance', 'LOVE'], '0'),
    valueLOVE: state.getIn(['user_lists', 'tokens', accountId, 'value', 'LOVE'], '0'),
    balanceFACE: state.getIn(['user_lists', 'tokens', accountId, 'balance', 'FACE'], '0'),
    valueFACE: state.getIn(['user_lists', 'tokens', accountId, 'value', 'FACE'], '0'),
    balanceETH: state.getIn(['user_lists', 'tokens', accountId, 'balance', 'ETH'], '0'),
    valueETH: state.getIn(['user_lists', 'tokens', accountId, 'value', 'ETH'], '0'),
    balanceUSDT: state.getIn(['user_lists', 'tokens', accountId, 'balance', 'USDT'], '0'),
    valueUSDT: state.getIn(['user_lists', 'tokens', accountId, 'value', 'USDT'], '0'),
    balanceUSDC: state.getIn(['user_lists', 'tokens', accountId, 'balance', 'USDC'], '0'),
    valueUSDC: state.getIn(['user_lists', 'tokens', accountId, 'value', 'USDC'], '0'),
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
    balanceBNB: PropTypes.string,
    valueBNB: PropTypes.string,
    balancePOL: PropTypes.string,
    valuePOL: PropTypes.string,
    balanceLOVE: PropTypes.string,
    valueLOVE: PropTypes.string,
    balanceFACE: PropTypes.string,
    valueFACE: PropTypes.string,
    balanceETH: PropTypes.string,
    valueETH: PropTypes.string,
    balanceUSDT: PropTypes.string,
    valueUSDT: PropTypes.string,
    balanceUSDC: PropTypes.string,
    valueUSDC: PropTypes.string,
    balanceCHINESE: PropTypes.string,
    valueCHINESE: PropTypes.string,
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
      accountId, blockedBy, isAccount, multiColumn, suspended, hidden, remote, remoteUrl,
      balancePOL, balanceBNB, balanceCHINESE, balanceETH, balanceUSDT, balanceUSDC, balanceFACE, balanceLOVE,
      valuePOL, valueBNB, valueCHINESE, valueETH, valueUSDT, valueUSDC, valueLOVE, valueFACE,
    } = this.props;
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
              {daoName === 'chinesedao' &&
                <div className={'token__item'}>
                  <div className={'token__symbol'}>
                    <img src={POL_ICON} className={'token__icon'} alt={'POL_ICON'} />
                    <span>MATIC</span>
                  </div>
                  <div className={'token__nums'}>
                    <p className={'token__nums__balance'}>{balancePOL}</p>
                    <p className={'token__nums__value'}>$ {valuePOL}</p>
                  </div>
                </div>
              }
              {daoName === 'facedao' &&
                <div className={'token__item'}>
                  <div className={'token__symbol'}>
                    <img src={BNB_ICON} className={'token__icon'} alt={'BNB_ICON'} />
                    <span>BNB</span>
                  </div>
                  <div className={'token__nums'}>
                    <p className={'token__nums__balance'}>{balanceBNB}</p>
                    <p className={'token__nums__value'}>$ {valueBNB}</p>
                  </div>
                </div>
              }
              {daoName === 'chinesedao' &&
                <div className={'token__item'}>
                  <div className={'token__symbol'}>
                    <img src={CHINESE_ICON} className={'token__icon'} alt={'CHINESE_ICON'} />
                    <span>CHINESE</span>
                  </div>
                  <div className={'token__nums'}>
                    <p className={'token__nums__balance'}>{balanceCHINESE}</p>
                    <p className={'token__nums__value'}>$ {valueCHINESE}</p>
                  </div>
                </div>
              }
              {daoName === 'facedao' &&
                <div className={'token__item'}>
                  <div className={'token__symbol'}>
                    <img src={LOVE_ICON} className={'token__icon'} alt={'LOVE_ICON'} />
                    <span>LOVE</span>
                  </div>
                  <div className={'token__nums'}>
                    <p className={'token__nums__balance'}>{balanceLOVE}</p>
                    <p className={'token__nums__value'}>$ {valueLOVE}</p>
                  </div>
                </div>
              }
              {daoName === 'facedao' &&
                <div className={'token__item'}>
                  <div className={'token__symbol'}>
                    <img src={FACE_ICON} className={'token__icon'} alt={'FACE_ICON'} />
                    <span>FACE</span>
                  </div>
                  <div className={'token__nums'}>
                    <p className={'token__nums__balance'}>{balanceFACE}</p>
                    <p className={'token__nums__value'}>$ {valueFACE}</p>
                  </div>
                </div>
              }

              <div className={'token__item'}>
                <div className={'token__symbol'}>
                  <img src={ETH_ICON} className={'token__icon'} alt={'ETH_ICON'} />
                  <span>ETH</span>
                </div>
                <div className={'token__nums'}>
                  <p className={'token__nums__balance'}>{balanceETH}</p>
                  <p className={'token__nums__value'}>$ {valueETH}</p>
                </div>
              </div>
              <div className={'token__item'}>
                <div className={'token__symbol'}>
                  <img src={USDT_ICON} className={'token__icon'} alt={'USDT_ICON'} />
                  <span>USDT</span>
                </div>
                <div className={'token__nums'}>
                  <p className={'token__nums__balance'}>{balanceUSDT}</p>
                  <p className={'token__nums__value'}>$ {valueUSDT}</p>
                </div>
              </div>
              <div className={'token__item'}>
                <div className={'token__symbol'}>
                  <img src={USDC_ICON} className={'token__icon'} alt={'USDC_ICON'} />
                  <span>USDC</span>
                </div>
                <div className={'token__nums'}>
                  <p className={'token__nums__balance'}>{balanceUSDC}</p>
                  <p className={'token__nums__value'}>$ {valueUSDC}</p>
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
