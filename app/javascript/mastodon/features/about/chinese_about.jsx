import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { defineMessages, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';

// 定义了About页面的消息
const messages = defineMessages({
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


class ChineseAbout extends React.PureComponent {

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




  render() {
    const { intl } = this.props;

    return (
      <ul style={{ margin: '10px' }}>
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
    );
  }

}

export default (injectIntl(ChineseAbout));
