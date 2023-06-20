import React from 'react';
import { injectIntl } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import BigNumber from 'bignumber.js';
import { getEarnToken } from '../utils/web3';

class EarningRecord extends ImmutablePureComponent {

  static propType = {
    value: PropTypes.string.isRequired,
    op: PropTypes.string.isRequired,
    createTime: PropTypes.string.isRequired,
  };

  render() {
    const {  value, op, createTime } = this.props;

    return (
      <div className={'tokens__transactions'}>
        <div className={'tokens__transactions__info'}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
            <p>{op}</p>
            <p style={{ color:'grey', fontSize:'x-small' }}>{createTime}</p>
          </div>
        </div>
        <div className={'tokens__transactions__amount'}>
          <p>{'+'  + (new BigNumber(value)).dividedBy(1e18).toFixed(2)}</p>
          <p>${getEarnToken()}</p>
        </div>
      </div>
    );
  }

}

export default injectIntl(EarningRecord);
