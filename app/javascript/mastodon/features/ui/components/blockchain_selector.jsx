import React from 'react';
import {me} from "mastodon/initial_state";
import {switchBlockchain, switchChainIfNeeded} from "mastodon/actions/blockchain";
import {CHAIN_BSC, CHAIN_FUSION} from "mastodon/utils/web3";
import {BNB_ICON, FSN_ICON} from "../../../../icons/data";
import {Select} from "antd";
import {injectIntl} from 'react-intl';
import {connect} from 'react-redux';

const {Option} = Select;
import PropTypes from "prop-types";
import ImmutablePropTypes from "react-immutable-proptypes";

const mapStateToProps = state => ({
  account: state.getIn(['accounts', me]),
  blockchain: state.getIn(['blockchain', 'chain']),
});

class BlockchainSelector extends React.PureComponent {
  static propTypes = {
    is_side_bar: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    account: ImmutablePropTypes.map.isRequired,
    blockchain: PropTypes.string,
  };

  async switchChainIfNeededWhenMount() {
    const {is_side_bar, blockchain, dispatch} = this.props;
    if (is_side_bar && blockchain) {
      await switchChainIfNeeded(blockchain, dispatch)
    }
  }
  componentDidMount() {
    void this.switchChainIfNeededWhenMount()
  }

  handleSelectChain(chain, dispatch) {
    dispatch(switchBlockchain(chain));
  }

  render() {
    const {is_side_bar, blockchain, dispatch} = this.props;
    return (
      <Select
        defaultValue={blockchain}
        className={is_side_bar ? 'chain__selector__sidebar' : 'chain__selector'}
        onSelect={(value) => this.handleSelectChain(value, dispatch)}
        value={blockchain}
      >
        <Option value={CHAIN_FUSION}>
          <div className={'chain__selector__item'}>
            <img src={FSN_ICON} className={'chain__selector__icon'} alt={CHAIN_FUSION}/>
            {is_side_bar ? 'Fusion' : 'FSN'}
          </div>
        </Option>
        {/*<Option value='polygon'>*/}
        {/*  <div className={'chain__selector__item'}>*/}
        {/*    <img src={POL_ICON} className={'chain__selector__icon'} alt={'polygon'}/>*/}
        {/*    {is_side_bar ? 'Polygon' : 'POL'}*/}
        {/*  </div>*/}
        {/*</Option>*/}
        <Option value={CHAIN_BSC}>
          <div className={'chain__selector__item'}>
            <img src={BNB_ICON} className={'chain__selector__icon'} alt={CHAIN_BSC}/>
            BSC
          </div>
        </Option>

      </Select>
    )
  }
}
export default connect(mapStateToProps)(injectIntl(BlockchainSelector));
