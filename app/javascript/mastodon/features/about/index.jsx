import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Column from 'mastodon/components/column';
import LinkFooter from 'mastodon/features/ui/components/link_footer';
import { Helmet } from 'react-helmet';
import { fetchServer, fetchExtendedDescription, fetchDomainBlocks } from 'mastodon/actions/server';
import Skeleton from 'mastodon/components/skeleton';
import Icon from 'mastodon/components/icon';
import classNames from 'classnames';
import Image from 'mastodon/components/image';

// 定义了About页面的消息
const messages = defineMessages({
  title: { id: 'column.about', defaultMessage: 'About' },
  rules: { id: 'about.rules', defaultMessage: 'Server rules' },
  blocks: { id: 'about.blocks', defaultMessage: 'Moderated servers' },
  silenced: { id: 'about.domain_blocks.silenced.title', defaultMessage: 'Limited' },
  silencedExplanation: {
    id: 'about.domain_blocks.silenced.explanation',
    defaultMessage: 'You will generally not see profiles and content from this server, unless you explicitly look it up or opt into it by following.',
  },
  suspended: { id: 'about.domain_blocks.suspended.title', defaultMessage: 'Suspended' },
  suspendedExplanation: {
    id: 'about.domain_blocks.suspended.explanation',
    defaultMessage: 'No data from this server will be processed, stored or exchanged, making any interaction or communication with users from this server impossible.',
  },
  social2earnTitle: {
    id: 'about.social2earn.title',
    defaultMessage: 'Social to Earn',
  },
  social2earnText: {
    id: 'about.social2earn.text',
    defaultMessage: 'We believe in the value of DAO and socialFi. On our platform, you can post about Chinese culture, you can also post a reply, retweet, like, and bookmark. There is now a limited-time promotional event, posting and replying  will earn you a reward of 200 $CHINESE,while retweeting, liking, and bookmarking will earn you a reward of 100 $CHINESE. Moreover, as long as you stay online to contribute to the popularity of the community, you can earn 1 $CHINESE every 5 seconds.',
  },
  tokenomicsTitle: {
    id: 'about.tokenomics.title',
    defaultMessage: 'Tokenomics',
  },
  tokenomicsText: {
    id: 'about.tokenomics.text',
    defaultMessage: 'You can withdraw $CHINESE with no threshold after earning it. And you can use it to reward the posts and users you appreciate to promote your favourite Chinese culture. Currently, dao.chinese.org is running on Polygon, and $CHINESE has been connected to Ethereum, Polygon, Arbitrum, BNB smart Chain, and Fusion through Chainge CrossChain technoledge. You can explore more in Chainge: ',
  },
  creatingTitle: {
    id: 'about.creating.title',
    defaultMessage: 'Creating and Sharing',
  },
  creatingText: {
    id: 'about.creating.text',
    defaultMessage: 'Open to everyone for free. After the official launch, you can mint NFTs related to Chinese culture for free. All NFTs and social content are owned by the creators,  permanently retained, and governed by DAO. You can mint your own NFTs according to your preferences. We are committed to discovering and sharing the best arts and creations of Chinese culture around the world.',
  },
  giftTitle: {
    id: 'about.gift.title',
    defaultMessage: 'A Special Gift',
  },
  giftText: {
    id: 'about.gift.text',
    defaultMessage: 'After the official launch, you will receive a special gift: an NFT based on your family name. This will serve as a ticket for some social activities, making it easier for Chinese people around the world to find and integrate into big family, so as to lower the social threshold and improve the quality of social interaction.',
  },
});

// const severityMessages = {
//   silence: {
//     title: messages.silenced,
//     explanation: messages.silencedExplanation,
//   },
//
//   suspend: {
//     title: messages.suspended,
//     explanation: messages.suspendedExplanation,
//   },
// };

const mapStateToProps = state => ({
  server: state.getIn(['server', 'server']),
  extendedDescription: state.getIn(['server', 'extendedDescription']),
  domainBlocks: state.getIn(['server', 'domainBlocks']),
});

class Section extends React.PureComponent {

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
    const { onOpen } = this.props;
    const { collapsed } = this.state;

    this.setState({ collapsed: !collapsed }, () => onOpen && onOpen());
  };

  render() {
    const { title, children } = this.props;
    const { collapsed } = this.state;

    return (
      <div className={classNames('about__section', { active: !collapsed })}>
        <div className='about__section__title' role='button' tabIndex='0' onClick={this.handleClick}>
          <Icon id={collapsed ? 'chevron-right' : 'chevron-down'} fixedWidth /> {title}
        </div>

        {!collapsed && (
          <div className='about__section__body'>{children}</div>
        )}
      </div>
    );
  }

}

class About extends React.PureComponent {

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
    const { dispatch } = this.props;
    dispatch(fetchServer());
    dispatch(fetchExtendedDescription());
  }

  handleDomainBlocksOpen = () => {
    const { dispatch } = this.props;
    dispatch(fetchDomainBlocks());
  };
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
    const { multiColumn, intl, server, extendedDescription } = this.props;
    const isLoading = server.get('isLoading');

    return (
      <Column bindToDocument={!multiColumn} label={intl.formatMessage(messages.title)}>
        <div className='scrollable about'>
          <div className='about__header'>
            <Image
              blurhash={server.getIn(['thumbnail', 'blurhash'])} src={server.getIn(['thumbnail', 'url'])}
              srcSet={server.getIn(['thumbnail', 'versions'])?.map((value, key) => `${value} ${key.replace('@', '')}`).join(', ')}
              className='about__header__hero'
            />
            <h1>{isLoading ? <Skeleton width='10ch' /> : server.get('domain')}</h1>
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
          {/* 管理员信息 */}
          {/*<div className='about__meta'>*/}
          {/*  <div className='about__meta__column'>*/}
          {/*    <h4><FormattedMessage id='server_banner.administered_by' defaultMessage='Administered by:' /></h4>*/}

          {/*    <Account id={server.getIn(['contact', 'account', 'id'])} size={36} />*/}
          {/*  </div>*/}

          {/*  <hr className='about__meta__divider' />*/}

          {/*  <div className='about__meta__column'>*/}
          {/*    <h4><FormattedMessage id='about.contact' defaultMessage='Contact:' /></h4>*/}

          {/*    {isLoading ? <Skeleton width='10ch' /> : <a className='about__mail' href={`mailto:${server.getIn(['contact', 'email'])}`}>{server.getIn(['contact', 'email'])}</a>}*/}
          {/*  </div>*/}
          {/*</div>*/}

          {/* 关于 */}
          <Section open title={intl.formatMessage(messages.title)}>
            {extendedDescription.get('isLoading') ? (
              <>
                <Skeleton width='100%' />
                <br />
                <Skeleton width='100%' />
                <br />
                <Skeleton width='100%' />
                <br />
                <Skeleton width='70%' />
              </>
            ) : (
              process.env.REACT_APP_DAO === 'chinesedao' ?
                (<ul style={{ margin: '10px' }}>
                  <li style={{
                    marginTop: '10px',
                    marginBottom: '5px',
                  }}
                  >{intl.formatMessage(messages.social2earnTitle)}</li>
                  <p>{intl.formatMessage(messages.social2earnText)}</p>
                  <li
                    style={{
                      marginTop: '10px',
                      marginBottom: '5px',
                    }}
                  >{intl.formatMessage(messages.tokenomicsTitle)}</li>
                  <p>{intl.formatMessage(messages.tokenomicsText)}</p>
                  <li
                    style={{ marginTop: '10px', marginBottom: '5px' }}
                  >{intl.formatMessage(messages.creatingTitle)}</li>
                  <p>{intl.formatMessage(messages.creatingText)}</p>
                  <li style={{ marginTop: '10px', marginBottom: '5px' }}>{intl.formatMessage(messages.giftTitle)}</li>
                  <p>{intl.formatMessage(messages.giftText)}</p>
                </ul>
                )
                :
                (
                  <ul style={{ margin: '10px' }} />
                )
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

          <LinkFooter />
          {/* Footer标语 */}
          {/*<div className='about__footer'>*/}
          {/*  <p><FormattedMessage id='about.disclaimer' defaultMessage='Mastodon is free, open-source software, and a trademark of Mastodon gGmbH.' /></p>*/}
          {/*</div>*/}
        </div>

        <Helmet>
          <title>{intl.formatMessage(messages.title)}</title>
          <meta name='robots' content='all' />
        </Helmet>
      </Column>
    );
  }

}

export default connect(mapStateToProps)(injectIntl(About));
