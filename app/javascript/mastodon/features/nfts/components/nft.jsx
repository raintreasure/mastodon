import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import Button from '../../../components/button';
import { openModal } from '../../../actions/modal';

const assetShape = PropTypes.shape({
  // base info
  id: PropTypes.number,
  token_id: PropTypes.string,
  name: PropTypes.string,
  description: PropTypes.string,
  num_sales: PropTypes.number,
  background_color: PropTypes.string,
  external_link: PropTypes.string,
  token_address: PropTypes.string,
  // owner
  owner: PropTypes.object, //
  // other
  decimals: PropTypes.any,
  token_metadata: PropTypes.any,
  is_nsfw: PropTypes.bool,

  // link
  image_url: PropTypes.string,
  image_preview_url: PropTypes.string,
  image_thumbnail_url: PropTypes.string,
  image_original_url: PropTypes.string,
  animation_url: PropTypes.string,
  animation_original_url: PropTypes.string,
  permalink: PropTypes.string,  // details page
  // Contract
  asset_contract: PropTypes.shape({
    address: PropTypes.string,
    chain_identifier: PropTypes.string,
  }),
  // Collection
  collection: PropTypes.shape({

  }),
  // Creator
  creator: PropTypes.shape({  // Creator
    user: PropTypes.shape({
      username: PropTypes.string,
    }),
    address: PropTypes.string,
  }),
});

class NFT extends React.PureComponent {

  state = {
    loading: false,
  };

  static propTypes = {
    intl: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    index: PropTypes.number,
    onClick: PropTypes.func,
    asset: assetShape,
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
      asset: { permalink },
      dispatch,
    } = this.props;
    dispatch(openModal('CONFIRM', {
      message: 'Ready to open a new window to check details of this NFT.',
      confirm: 'Confirm',
      onConfirm: () => {
        window.open(permalink, '_blank');
      },
    }));
  };

  render() {
    const {
      asset: {
        name, image_url, description, creator,
        // permalink,
      },
    } = this.props;


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
          <p className={'nft__info__desc'}>{description}</p>
          <p className={'nft__info__creator'}>created by: <span>{creator.user.username}</span></p>
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
