import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import Button from '../../../components/button';
import { openModal } from '../../../actions/modal';
import { nftscan_asset_model } from '../../../actions/nfts';

class NFT extends React.PureComponent {

  state = {
    loading: false,
  };

  static propTypes = {
    intl: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    index: PropTypes.number,
    onClick: PropTypes.func,
    asset: nftscan_asset_model,
  };

  static defaultProps = {
    index: 0,
    // height: '100px',
    // width: '100px',
  };
  handleClick = (e) => {
    const { onClick } = this.props;

    if (e.button === 0 && !(e.ctrlKey || e.metaKey)) {
      if (this.hoverToPlay()) {
        e.target.pause();
        e.target.currentTime = 0;
      }
      e.preventDefault();
      onClick(0);
    }

    e.stopPropagation();
  };

  handleImageLoad = () => {
    this.setState({ loaded: true });
  };

  handleAssetDetailClick = () => {
    const {
      asset: { external_link },
      dispatch,
    } = this.props;
    dispatch(openModal('CONFIRM', {
      message: 'Ready to open a new window to check details of this NFT.',
      confirm: 'Confirm',
      onConfirm: () => {
        window.open(external_link, '_blank');
      },
    }));
  };

  render() {
    const {
      asset: {
        name, image_uri, description, latest_trade_price, latest_trade_symbol, erc_type,
      },
    } = this.props;
    const image_url = erc_type === 'erc721' ? `https://ipfs.io/ipfs/${image_uri}`: image_uri;
    return (
      <div className={'nft__item'}>
        {/*<div className={'nft__image'}>*/}
        {/*  <img src={image_url} title={name} alt={name} />*/}
        {/*</div>*/}
        <a
          className='nft__image'
          href={image_url}
          onClick={this.handleClick}
          target='_blank'
          rel='noopener noreferrer'
        >
          <img
            src={image_url}
            alt={description}
            title={name}
            // onLoad={this.handleImageLoad}
          />
        </a>
        <div className={'nft__info'}>
          <p className={'nft__info__name'}>{name}</p>
          {/*<p className={'nft__info__desc'}>{description}</p>*/}
          {
            latest_trade_price === null ?
              // <p>&nbsp;</p>
              <p className={'nft__info__creator'}>&nbsp;</p>
              :
              <p className={'nft__info__creator'}>latest trade price: <span>{ latest_trade_price }</span>&nbsp;<span>{ latest_trade_symbol }</span></p>
          }
          {/*<p className={'nft__info__creator'}>created by: <span>{creator.user.username}</span></p>*/}
          {/*<p className={'nft__info__link'}><a href={permalink}>Detail</a></p>*/}
          <p className={'nft__info__btn'}>
            <Button
              type='button'
              text={'Detail'}
              title={name}
              onClick={this.handleAssetDetailClick}
              disabled={this.state.loading}
            />
          </p>
        </div>
      </div>
    );
  }

}

export default (injectIntl(NFT));
