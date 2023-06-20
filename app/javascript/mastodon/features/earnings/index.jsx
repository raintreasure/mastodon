import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { normalizeForLookup } from '../../reducers/accounts_map';
import { getAccountHidden } from '../../selectors';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { fetchAccount, lookupAccount } from '../../actions/accounts';
import Column from '../ui/components/column';
import MissingIndicator from '../../components/missing_indicator';
import LoadingIndicator from '../../components/loading_indicator';
import ColumnBackButton from '../../components/column_back_button';
import HeaderContainer from '../account_timeline/containers/header_container';
import { connect } from 'react-redux';
import { getEarningsRecord } from '../../actions/balance';
import ScrollableList from '../../components/scrollable_list';
import LimitedAccountHint from '../account_timeline/components/limited_account_hint';
import { getEarnToken } from '../../utils/web3';

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
    hidden: getAccountHidden(state, accountId),
    blockedBy: state.getIn(['relationships', accountId, 'blocked_by'], false),
    earning_records: state.getIn(['balance', 'earning_records']),
  };
};

class Earnings extends React.PureComponent {

  static propTypes = {
    params: PropTypes.shape({
      acct: PropTypes.string, id: PropTypes.string,
    }).isRequired,
    accountId: PropTypes.string,
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
    intl: PropTypes.object,
    earning_records: PropTypes.array,
  };


  state = {
    isLoading: true,
  };

  _load() {
    const { accountId, isAccount, dispatch } = this.props;
    if (!isAccount) dispatch(fetchAccount(accountId));
    dispatch(getEarningsRecord(accountId));
  }

  componentDidMount() {
    const { params: { acct }, accountId, dispatch } = this.props;

    if (accountId) {
      this._load();
    } else {
      dispatch(lookupAccount(acct));
    }
  }

  capitalizeFirstLetter(str) {
    if (str && str.length > 0) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
    return str;
  }

  render() {
    const {
      isAccount,
      multiColumn,
      earning_records,
      suspended,
      blockedBy,
      hidden,
      accountId,
    } = this.props;

    if (!isAccount) {
      return (<Column>
        <MissingIndicator />
      </Column>);
    }

    if (!earning_records) {
      return (<Column>
        <LoadingIndicator />
      </Column>);
    }
    let emptyMessage;
    if (suspended) {
      emptyMessage = <FormattedMessage id='empty_column.account_suspended' defaultMessage='Account suspended' />;
    } else if (hidden) {
      emptyMessage = <LimitedAccountHint accountId={accountId} />;
    } else if (blockedBy) {
      emptyMessage = <FormattedMessage id='empty_column.account_unavailable' defaultMessage='Profile unavailable' />;
    } else {
      emptyMessage =
        (<FormattedMessage
          id='account.tokens.earnings.empty'
          defaultMessage='This user has no earnings yet.'
        />);
    }

    return (<Column>
      <ColumnBackButton multiColumn={multiColumn} />
      <ScrollableList
        scrollKey='earnings'
        hasMore={false}
        isLoading={false}
        onLoadMore={this.handleLoadMore}
        prepend={<HeaderContainer accountId={this.props.accountId} hideTabs />}
        alwaysPrepend
        emptyMessage={emptyMessage}
        bindToDocument={!multiColumn}
      >
        {earning_records.map(r =>
          // <EarningRecord value={r.earn} op={r.op_type} createTime={r.created_at}/>
          (<div className={'earning__record'} key={r.id}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
              <p>{this.capitalizeFirstLetter(r.op_type)}</p>
              <p style={{ color: 'grey', fontSize: 'x-small' }}>{r.created_at}</p>
            </div>
            <div>
              <p style={{ fontSize: 'larger' }}>+ {r.earn} ${getEarnToken()}</p>
            </div>
          </div>),
        )}
      </ScrollableList>
    </Column>);
  }


}

export default connect(mapStateToProps)(injectIntl(Earnings));
