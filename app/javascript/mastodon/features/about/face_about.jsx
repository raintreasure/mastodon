import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { defineMessages, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';

const messages = defineMessages({
  realTimeChatTitle: {
    id: 'about.face.realTimeChat.title',
    defaultMessage: 'real-time chat',
  },
  realTimeChatText: {
    id: 'about.face.realTimeChat.text',
    defaultMessage: 'Experience the power of communication our versatile real-time chat. Enjoy a wide range of features, including voice and video calls, file transfers, and Red Packet sharing. Our group chat supports up to 6,000 members, ensuring your conversations remain inclusive and engaging.',
  },
  social2earnTitle: {
    id: 'about.face.social2earn.title',
    defaultMessage: 'Social to Earn',
  },
  social2earnText: {
    id: 'about.face.social2earn.text',
    defaultMessage: 'Get the opportunity to earn tokens as you engage with others, share your knowledge, and support the growth of the platform. Watch your digital assets grow as you deepen your connections within our thriving network.',
  },
  inAppWalletTitle: {
    id: 'about.face.inAppWallet.title',
    defaultMessage: 'In-App Wallet',
  },
  inAppWalletText: {
    id: 'about.face.inAppWallet.text',
    defaultMessage: 'Our in-app wallet connects seamlessly with your existing decentralized wallets, allowing you to manage your digital assets with ease. Enjoy the freedom to access your funds, make transactions, and monitor your portfolio, all within our secure and user-friendly platform.',
  },
});


class FaceAbout extends React.PureComponent {

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
        >{intl.formatMessage(messages.realTimeChatTitle)}</li>
        <p>{intl.formatMessage(messages.realTimeChatText)}</p>

        <li
          style={{
            marginTop: '10px',
            marginBottom: '5px',
          }}
        >{intl.formatMessage(messages.social2earnTitle)}</li>
        <p>{intl.formatMessage(messages.social2earnText)}</p>

        <li
          style={{ marginTop: '10px', marginBottom: '5px' }}
        >{intl.formatMessage(messages.inAppWalletTitle)}</li>
        <p>{intl.formatMessage(messages.inAppWalletText)}</p>

      </ul>
    );
  }

}

export default (injectIntl(FaceAbout));
