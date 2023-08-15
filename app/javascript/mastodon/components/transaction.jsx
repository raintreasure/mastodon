import React from 'react';
import { injectIntl } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import { arrowToIcon, arrowFromIcon } from '../utils/icons';
import BigNumber from 'bignumber.js';
import { minifyAddress, getContractDecimal } from '../utils/web3';

class Transaction extends ImmutablePureComponent {

  static propType = {
    isIndirection: PropTypes.bool.isRequired,
    peerAddress: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
    createTime: PropTypes.string.isRequired,
    message: PropTypes.string,
  };

  render() {
    const { isIndirection, peerAddress, value, token, createTime, message } = this.props;
    // console.log('message is ', message)
    // console.log('message type is ', typeof message)
    return (
      <div className={'tokens__transactions'}>
        <div className={'tokens__transactions__info'}>
          <div
            className={'tokens__transactions__icon'}
            style={{ backgroundColor: isIndirection ? 'darkgreen' : 'darkorange' }}
          >
            <div style={{ margin: '3px' }}>{isIndirection ? arrowToIcon : arrowFromIcon}</div>
          </div>
          <div className={'tokens__transactions__sender'}>
            <p>{window.innerWidth >= 600 ? peerAddress : minifyAddress(peerAddress)}</p>
            {message && <p style={{fontWeight:'bold'}}>"{message}"</p>}
            <p className={'tokens__transactions__time'}>{createTime}</p>
          </div>
        </div>
        <div className={'tokens__transactions__amount'}>
          <p>{(isIndirection ? '+' : '-') + (new BigNumber(value)).dividedBy(getContractDecimal(token)).toFixed(2)}</p>
          <p>{token}</p>
        </div>
      </div>
    );
  }

}

export default injectIntl(Transaction);
