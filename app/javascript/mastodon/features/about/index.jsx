import PropTypes from 'prop-types';
import {PureComponent} from 'react';

import {defineMessages, injectIntl, FormattedMessage} from 'react-intl';

import classNames from 'classnames';
import {Helmet} from 'react-helmet';

import ImmutablePropTypes from 'react-immutable-proptypes';
import {connect} from 'react-redux';

import {fetchServer, fetchExtendedDescription, fetchDomainBlocks} from 'mastodon/actions/server';
import Column from 'mastodon/components/column';
import {Icon} from 'mastodon/components/icon';
import {ServerHeroImage} from 'mastodon/components/server_hero_image';
import {Skeleton} from 'mastodon/components/skeleton';
import LinkFooter from 'mastodon/features/ui/components/link_footer';
import ChineseAbout from './chinese_about';
import FaceAbout from './face_about';

const messages = defineMessages({
  title: {id: 'column.about', defaultMessage: 'About'},
  rules: {id: 'about.rules', defaultMessage: 'Server rules'},
  blocks: {id: 'about.blocks', defaultMessage: 'Moderated servers'},
  silenced: {id: 'about.domain_blocks.silenced.title', defaultMessage: 'Limited'},
  silencedExplanation: {
    id: 'about.domain_blocks.silenced.explanation',
    defaultMessage: 'You will generally not see profiles and content from this server, unless you explicitly look it up or opt into it by following.',
  },
  suspended: {id: 'about.domain_blocks.suspended.title', defaultMessage: 'Suspended'},
  suspendedExplanation: {
    id: 'about.domain_blocks.suspended.explanation',
    defaultMessage: 'No data from this server will be processed, stored or exchanged, making any interaction or communication with users from this server impossible.',
  },
});

const mapStateToProps = state => ({
  server: state.getIn(['server', 'server']),
  extendedDescription: state.getIn(['server', 'extendedDescription']),
  domainBlocks: state.getIn(['server', 'domainBlocks']),
});

class Section extends PureComponent {

  static propTypes = {
    title: PropTypes.string,
    children: PropTypes.node,
    open: PropTypes.bool,
    onOpen: PropTypes.func,
  };

  state = {
    collapsed: !this.props.open,
  };

  handleClick = () => {
    const {onOpen} = this.props;
    const {collapsed} = this.state;

    this.setState({collapsed: !collapsed}, () => onOpen && onOpen());
  };

  render() {
    const {title, children} = this.props;
    const {collapsed} = this.state;

    return (
      <div className={classNames('about__section', {active: !collapsed})}>
        <div className='about__section__title' role='button' tabIndex={0} onClick={this.handleClick}>
          <Icon id={collapsed ? 'chevron-right' : 'chevron-down'} fixedWidth/> {title}
        </div>

        {!collapsed && (
          <div className='about__section__body'>{children}</div>
        )}
      </div>
    );
  }

}

class About extends PureComponent {

  static propTypes = {
    server: ImmutablePropTypes.map,
    extendedDescription: ImmutablePropTypes.map,
    domainBlocks: ImmutablePropTypes.contains({
      isLoading: PropTypes.bool,
      isAvailable: PropTypes.bool,
      items: ImmutablePropTypes.list,
    }),
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    multiColumn: PropTypes.bool,
  };

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(fetchServer());
    dispatch(fetchExtendedDescription());
  }

  handleDomainBlocksOpen = () => {
    const {dispatch} = this.props;
    dispatch(fetchDomainBlocks());
  };

  getServerUrl() {
    switch (process.env.REACT_APP_DAO) {
      case 'chinesedao':
        return 'https://chinese.org';
      case 'facedao':
        return 'https://facedao.pro';
      case 'pqcdao':
        return 'https://pqcsf.pro';
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
      case 'pqcdao':
        return 'PQCDAO';
      default:
        return 'ChineseDAO';
    }
  }

  getAboutInfo() {
    switch (process.env.REACT_APP_DAO) {
      case 'chinesedao':
        return <ChineseAbout/>;
      case 'facedao':
        return <FaceAbout/>;
      default:
        return (<ul style={{margin: '10px'}}/>);
    }
  }

  render() {
    const {multiColumn, intl, server, extendedDescription} = this.props;
    const isLoading = server.get('isLoading');

    return (
      <Column bindToDocument={!multiColumn} label={intl.formatMessage(messages.title)}>
        <div className='scrollable about'>
          <div className='about__header'>
            <ServerHeroImage blurhash={server.getIn(['thumbnail', 'blurhash'])} src={server.getIn(['thumbnail', 'url'])}
                             srcSet={server.getIn(['thumbnail', 'versions'])?.map((value, key) => `${value} ${key.replace('@', '')}`).join(', ')}
                             className='about__header__hero'/>
            <h1>{isLoading ? <Skeleton width='10ch'/> : server.get('domain')}</h1>
            <p><FormattedMessage
              id='about.powered_by' defaultMessage='Decentralized social media powered by {mastodon}'
              values={{
                mastodon: <a
                  href={this.getServerUrl()} className='about__mail'
                  target='_blank'
                >{this.getServerName()}</a>,
              }}
            /></p>
          </div>

          {/* 关于 */}
          <Section open title={intl.formatMessage(messages.title)}>
            {extendedDescription.get('isLoading') ? (
              <>
                <Skeleton width='100%'/>
                <br/>
                <Skeleton width='100%'/>
                <br/>
                <Skeleton width='100%'/>
                <br/>
                <Skeleton width='70%'/>
              </>
            ) : (
              this.getAboutInfo()
            )
              // (extendedDescription.get('content')?.length > 0 ? (
              //   <div
              //     className='prose'
              //     dangerouslySetInnerHTML={{__html: extendedDescription.get('content')}}
              //   />
              // ) : (
              //
              //   <p><FormattedMessage id='about.not_available'
              //                        defaultMessage='This information has not been made available on this server.'/></p>
              // ))
            }
          </Section>

          {/* 站点规则 */}
          {/*<Section title={intl.formatMessage(messages.rules)}>*/}
          {/*  {!isLoading && (server.get('rules').isEmpty() ? (*/}
          {/*    <p><FormattedMessage id='about.not_available' defaultMessage='This information has not been made available on this server.' /></p>*/}
          {/*  ) : (*/}
          {/*    <ol className='rules-list'>*/}
          {/*      {server.get('rules').map(rule => (*/}
          {/*        <li key={rule.get('id')}>*/}
          {/*          <span className='rules-list__text'>{rule.get('text')}</span>*/}
          {/*        </li>*/}
          {/*      ))}*/}
          {/*    </ol>*/}
          {/*  ))}*/}
          {/*</Section>*/}

          {/* 被限制的服务器 */}
          {/*<Section title={intl.formatMessage(messages.blocks)} onOpen={this.handleDomainBlocksOpen}>*/}
          {/*  {domainBlocks.get('isLoading') ? (*/}
          {/*    <>*/}
          {/*      <Skeleton width='100%' />*/}
          {/*      <br />*/}
          {/*      <Skeleton width='70%' />*/}
          {/*    </>*/}
          {/*  ) : (domainBlocks.get('isAvailable') ? (*/}
          {/*    <>*/}
          {/*      <p><FormattedMessage id='about.domain_blocks.preamble' defaultMessage='Mastodon generally allows you to view content from and interact with users from any other server in the fediverse. These are the exceptions that have been made on this particular server.' /></p>*/}

          {/*      <div className='about__domain-blocks'>*/}
          {/*        {domainBlocks.get('items').map(block => (*/}
          {/*          <div className='about__domain-blocks__domain' key={block.get('domain')}>*/}
          {/*            <div className='about__domain-blocks__domain__header'>*/}
          {/*              <h6><span title={`SHA-256: ${block.get('digest')}`}>{block.get('domain')}</span></h6>*/}
          {/*              <span className='about__domain-blocks__domain__type' title={intl.formatMessage(severityMessages[block.get('severity')].explanation)}>{intl.formatMessage(severityMessages[block.get('severity')].title)}</span>*/}
          {/*            </div>*/}
          {/*            /!* 填充内容 *!/*/}
          {/*            <p>{(block.get('comment') || '').length > 0 ? block.get('comment') : <FormattedMessage id='about.domain_blocks.no_reason_available' defaultMessage='Reason not available' />}</p>*/}
          {/*          </div>*/}
          {/*        ))}*/}
          {/*      </div>*/}
          {/*    </>*/}
          {/*  ) : (*/}
          {/*    <p><FormattedMessage id='about.not_available' defaultMessage='This information has not been made available on this server.' /></p>*/}
          {/*  ))}*/}
          {/*</Section>*/}

          <LinkFooter/>
          {/* Footer标语 */}
          {/*<div className='about__footer'>*/}
          {/*  <p><FormattedMessage id='about.disclaimer' defaultMessage='Mastodon is free, open-source software, and a trademark of Mastodon gGmbH.' /></p>*/}
          {/*</div>*/}
        </div>

        <Helmet>
          <title>{intl.formatMessage(messages.title)}</title>
          <meta name='robots' content='all'/>
        </Helmet>
      </Column>
    );
  }

}

export default connect(mapStateToProps)(injectIntl(About));
