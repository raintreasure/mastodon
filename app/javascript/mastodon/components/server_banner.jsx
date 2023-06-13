import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';

import { Link } from 'react-router-dom';

import { connect } from 'react-redux';

import { fetchServer } from 'mastodon/actions/server';
import { ServerHeroImage } from 'mastodon/components/server_hero_image';
import ShortNumber from 'mastodon/components/short_number';
import { Skeleton } from 'mastodon/components/skeleton';
import Account from 'mastodon/containers/account_container';
import { domain } from 'mastodon/initial_state';


const mapStateToProps = state => ({
  server: state.getIn(['server', 'server']),
});

class ServerBanner extends PureComponent {

  static propTypes = {
    server: PropTypes.object,
    dispatch: PropTypes.func,
    intl: PropTypes.object,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchServer());
  }

  getServerUrl() {
    switch (process.env.REACT_APP_DAO) {
    case 'chinesedao':
      return 'https://chinese.org';
    case 'facedao':
      return 'https://facedao.pro';
    default:
      return 'https://chinese.org';
    }
  }

  getServerName() {
    switch (process.env.REACT_APP_DAO) {
    case 'chinesedao':
      return 'ChineseDAO';
    case 'facedao':
      return 'FaceDAO';
    default:
      return 'ChineseDAO';
    }
  }

  render() {
    const { server } = this.props;
    const isLoading = server.get('isLoading');

    return (
      <div className='server-banner'>
        <div className='server-banner__introduction'>
          <FormattedMessage
            id='server_banner.introduction'
            defaultMessage='{domain} is part of the decentralized social network powered by {mastodon}.'
            values={{
              domain: <strong>{domain}</strong>,
              mastodon: <a href={this.getServerUrl()} target='_blank'>{this.getServerName()}</a>,
            }}
          />
        </div>
        {/* 左侧server_banner的插图部分*/}
        <ServerHeroImage blurhash={server.getIn(['thumbnail', 'blurhash'])} src={server.getIn(['thumbnail', 'url'])} className='server-banner__hero' />

        <div className='server-banner__description'>
          {isLoading ? (
            <>
              <Skeleton width='100%' />
              <br />
              <Skeleton width='100%' />
              <br />
              <Skeleton width='70%' />
            </>
          ) : server.get('description')}
        </div>

        {/*<div className='server-banner__meta'>*/}
        {/*  <div className='server-banner__meta__column'>*/}
        {/*    <h4><FormattedMessage id='server_banner.administered_by' defaultMessage='Administered by:' /></h4>*/}

        {/*    <Account id={server.getIn(['contact', 'account', 'id'])} size={36} />*/}
        {/*  </div>*/}

        {/*  <div className='server-banner__meta__column'>*/}
        {/*    <h4><FormattedMessage id='server_banner.server_stats' defaultMessage='Server stats:' /></h4>*/}

        {/*    {isLoading ? (*/}
        {/*      <>*/}
        {/*        <strong className='server-banner__number'><Skeleton width='10ch' /></strong>*/}
        {/*        <br />*/}
        {/*        <span className='server-banner__number-label'><Skeleton width='5ch' /></span>*/}
        {/*      </>*/}
        {/*    ) : (*/}
        {/*      <>*/}
        {/*        <strong className='server-banner__number'><ShortNumber value={server.getIn(['usage', 'users', 'active_month'])} /></strong>*/}
        {/*        <br />*/}
        {/*        <span className='server-banner__number-label' title={intl.formatMessage(messages.aboutActiveUsers)}><FormattedMessage id='server_banner.active_users' defaultMessage='active users' /></span>*/}
        {/*      </>*/}
        {/*    )}*/}
        {/*  </div>*/}
        {/*</div>*/}

        <hr className='spacer' />

        <Link className='button button--block button-secondary' to='/about'><FormattedMessage
          id='server_banner.learn_more' defaultMessage='Learn more'
        /></Link>
      </div>
    );
  }

}

export default connect(mapStateToProps)(injectIntl(ServerBanner));
