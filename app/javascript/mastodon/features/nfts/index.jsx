import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import Column from '../ui/components/column';
import MissingIndicator from '../../components/missing_indicator';
import LimitedAccountHint from '../account_timeline/components/limited_account_hint';
import ColumnBackButton from '../../components/column_back_button';
import HeaderContainer from '../account_timeline/containers/header_container';
import { normalizeForLookup } from '../../reducers/accounts_map';
import { getAccountHidden } from '../../selectors';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { connect } from 'react-redux';
import TimelineHint from '../../components/timeline_hint';
import { fetchAccount, lookupAccount } from '../../actions/accounts';

const mapStateToProps = (state, { params: { acct, id } }) => {
  const accountId = id || state.getIn(['accounts_map', normalizeForLookup(acct)]);

  if (!accountId) {
    return {
      isLoading: true,
    };
  }

  const account = state.getIn(['accounts', accountId]);
  const address = account.get('eth_address');

  return {
    accountId,
    account,
    address,
    remote: !!(state.getIn(['accounts', accountId, 'acct']) !== state.getIn(['accounts', accountId, 'username'])),
    remoteUrl: state.getIn(['accounts', accountId, 'url']),
    isAccount: !!state.getIn(['accounts', accountId]),
    hasMore: !!state.getIn(['user_lists', 'following', accountId, 'next']),
    isLoading: state.getIn(['user_lists', 'tokens', accountId, 'isLoading'], true),
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

class NFTs extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object,
    params: PropTypes.shape({
      acct: PropTypes.string,
      id: PropTypes.string,
    }).isRequired,
    accountId: PropTypes.string,
    address: PropTypes.string,
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
  };

  _load() {
    const { accountId, isAccount, dispatch } = this.props;

    if (!isAccount) dispatch(fetchAccount(accountId));
  }

  componentDidMount () {
    // api().get('/api/v1/instance/privacy_policy').then(({ data }) => {
    //   this.setState({ content: data.content, lastUpdated: data.updated_at, isLoading: false });
    // }).catch(() => {
    //   this.setState({ isLoading: false });
    // });
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

  render () {
    const {
      accountId, address, blockedBy, isAccount, multiColumn, suspended, hidden,
      remote, remoteUrl,
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
          <div className={''}>
            Your Address: {address}
          </div>
        }
        {remoteMessage}
      </Column>
    );
  }

}

export default connect(mapStateToProps)(injectIntl(NFTs));
