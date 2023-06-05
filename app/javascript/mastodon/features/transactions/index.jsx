import React from 'react';
import { connect } from 'react-redux';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { debounce } from 'lodash';
import {LoadingIndicator} from '../../components/loading_indicator';
import {
  lookupAccount, fetchAccount,
} from '../../actions/accounts';
import { FormattedMessage } from 'react-intl';
import Column from '../ui/components/column';
import HeaderContainer from '../account_timeline/containers/header_container';
import ColumnBackButton from '../../components/column_back_button';
import ScrollableList from '../../components/scrollable_list';
import {TimelineHint} from 'mastodon/components/timeline_hint';
import LimitedAccountHint from '../account_timeline/components/limited_account_hint';
import { getAccountHidden } from 'mastodon/selectors';
import { normalizeForLookup } from 'mastodon/reducers/accounts_map';
import { fetchTransactions, fetchMoreTransactions } from '../../actions/transactions';
import Transaction from '../../components/transaction';
import BundleColumnError from "mastodon/features/ui/components/bundle_column_error";

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
    isAccount: !!state.getIn(['accounts', accountId]),
    transactions: state.getIn(['tokens', 'transactions', accountId, 'items']),
    currentPage: state.getIn(['tokens', 'transactions', accountId, 'page']),
    hasMore: state.getIn(['tokens', 'transactions', accountId, 'hasMore']),
    isLoading: state.getIn(['tokens', 'transactions', accountId, 'isLoading'], true),
    hidden: getAccountHidden(state, accountId),
    blockedBy: state.getIn(['relationships', accountId, 'blocked_by'], false),
  };
};

const RemoteHint = ({ url }) => (<TimelineHint url={url} resource={'Transactions'} />);

RemoteHint.propTypes = {
  url: PropTypes.string.isRequired,
};

class Transactions extends ImmutablePureComponent {

  static propTypes = {
    params: PropTypes.shape({
      acct: PropTypes.string, id: PropTypes.string,
    }).isRequired,
    accountId: PropTypes.string,
    account: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    accountIds: ImmutablePropTypes.list,
    hasMore: PropTypes.bool,
    isLoading: PropTypes.bool,
    blockedBy: PropTypes.bool,
    isAccount: PropTypes.bool,
    suspended: PropTypes.bool,
    hidden: PropTypes.bool,
    remote: PropTypes.bool,
    remoteUrl: PropTypes.string,
    multiColumn: PropTypes.bool,
    transactions: PropTypes.array,
    currentPage: PropTypes.number,
  };

  _load() {
    const { accountId, isAccount, dispatch, account } = this.props;
    if (!isAccount) dispatch(fetchAccount(accountId));
    dispatch(fetchTransactions(accountId, account.get('eth_address')));
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

  refetchRelationship() {
    const { params: { acct }, dispatch } = this.props;
    dispatch(lookupAccount(acct));
  }

  handleLoadMore = debounce(() => {
    const { accountId, currentPage, dispatch, account } = this.props;
    const newPage = currentPage + 1;
    dispatch(fetchMoreTransactions(accountId, account.get('eth_address'), newPage));
  }, 300, { leading: true });
  formatTime = (timestamp) => {
    const d = new Date(parseInt(timestamp) * 1000);
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
  };

  render() {
    const {
      accountId,
      account,
      blockedBy,
      isAccount,
      multiColumn,
      isLoading,
      suspended,
      hidden,
      remote,
      remoteUrl,
      transactions,
    } = this.props;
    const address = account.get('eth_address');
    const addressInLower = address && address.toLowerCase();

    if (!isAccount) {
      return (
        <BundleColumnError/>
      );
    }

    if (!transactions) {
      return (<Column>
        <LoadingIndicator />
      </Column>);
    }

    let emptyMessage;

    const forceEmptyState = blockedBy || suspended || hidden;

    if (suspended) {
      emptyMessage = <FormattedMessage id='empty_column.account_suspended' defaultMessage='Account suspended' />;
    } else if (hidden) {
      emptyMessage = <LimitedAccountHint accountId={accountId} />;
    } else if (blockedBy) {
      emptyMessage = <FormattedMessage id='empty_column.account_unavailable' defaultMessage='Profile unavailable' />;
    } else if (remote && transactions.isEmpty()) {
      emptyMessage = <RemoteHint url={remoteUrl} />;
    } else {
      emptyMessage =
        (<FormattedMessage
          id='account.tokens.transactions.empty'
          defaultMessage='This user has not triggered any transactions yet.'
        />);
    }

    const remoteMessage = remote ? <RemoteHint url={remoteUrl} /> : null;

    return (<Column>
      <ColumnBackButton multiColumn={multiColumn} />
      <button onClick={this.refetchRelationship}>fetch relationship
      </button>
      <ScrollableList
        scrollKey='following'
        hasMore={!forceEmptyState && false}
        isLoading={isLoading}
        onLoadMore={this.handleLoadMore}
        prepend={<HeaderContainer accountId={this.props.accountId} hideTabs />}
        alwaysPrepend
        append={remoteMessage}
        emptyMessage={emptyMessage}
        bindToDocument={!multiColumn}
      >
        {transactions.map(t => (<Transaction
          key={t.hash} isIndirection={t.to === addressInLower}
          peerAddress={t.to === addressInLower ? t.from : t.to} value={t.value}
          token={t.tokenSymbol}
          createTime={this.formatTime(t.timeStamp)}
        />))}
      </ScrollableList>
    </Column>);
  }

}

export default connect(mapStateToProps)(Transactions);
