import React from 'react';
import {connect} from 'react-redux';
import {defineMessages, injectIntl} from 'react-intl';
import PropTypes from 'prop-types';
import {getAbbrBlockchain, getEarnToken} from "mastodon/utils/web3";
import {Dropdown} from "antd";
import Button from "mastodon/components/button";

const mapStateToProps = state => ({
  blockchain: state.getIn(['blockchain', 'chain']),
});

const messages = defineMessages({
  buyTitle: {id: 'exchange.buy.title', defaultMessage: 'Buy {token}'},
  sellTitle: {id: 'exchange.sell.title', defaultMessage: 'Sell {token}'},
  exchangeTitle: {id: 'exchange.title', defaultMessage: 'Exchange'},

  buyTitleLovedao: {id: 'exchange.lovedao.buy.title', defaultMessage: 'Get {token}'},
  sellTitleLovedao: {id: 'exchange.lovedao.sell.title', defaultMessage: 'Redeem'},
  exchangeTitleLovedao: {id: 'exchange.lovedao.title', defaultMessage: 'Convert'},

});

class ExchangeButton extends React.PureComponent {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    blockchain: PropTypes.string,
  };
  static contextTypes = {
    identity: PropTypes.object.isRequired,
  };

  render() {
    const {intl, blockchain} = this.props;
    const {signedIn} = this.context.identity;

    const abbrBlockchain = getAbbrBlockchain(blockchain);
    const buyUrl = `https://dapp.chainge.finance/?fromChain=${abbrBlockchain}&toChain=${abbrBlockchain}&fromToken=USDT&toToken=${getEarnToken()}`;
    const sellUrl = `https://dapp.chainge.finance/?fromChain=${abbrBlockchain}&toChain=${abbrBlockchain}&fromToken=${getEarnToken()}&toToken=USDT`;
    const items = [
      {
        label: <a href={buyUrl} target={'_blank'}>
          <span>{intl.formatMessage(process.env.REACT_APP_DAO === 'lovedao' ? messages.buyTitleLovedao : messages.buyTitle,
            {token: getEarnToken()})}
          </span>
        </a>,
        key: '0',
      },
      {
        label: <a href={sellUrl} target={'_blank'}>
          <span>{intl.formatMessage(process.env.REACT_APP_DAO === 'lovedao' ? messages.sellTitleLovedao : messages.sellTitle,
            {token: getEarnToken()})}</span>
        </a>,
        key: '1',
      }
    ];

    return (
      <div>
        <Dropdown
          menu={{items}}
          trigger={['click']}
          disabled={!signedIn}>
          <Button
            type='button'
            text={intl.formatMessage(process.env.REACT_APP_DAO === 'lovedao' ? messages.exchangeTitleLovedao : messages.exchangeTitle)}
            title={intl.formatMessage(process.env.REACT_APP_DAO === 'lovedao' ? messages.exchangeTitleLovedao : messages.exchangeTitle)}
          />

        </Dropdown>
      </div>

    );
  }

}

export default connect(mapStateToProps)(injectIntl(ExchangeButton));
