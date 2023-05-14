import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

class NFT extends React.PureComponent {

  static propTypes = {
    asset: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      image_url: PropTypes.string,
      description: PropTypes.string,
      // external_link: PropTypes.string,
      token_id: PropTypes.string,
      token_address: PropTypes.string,
      // created_Date: PropTypes.string,
    }),
    base_link: PropTypes.string,
  };

  // static defaultProps = {
  //   height: '100px',
  //   width: '100px',
  // };

  render() {
    const {
      asset: { name, image_url, description, token_id, token_address },
      base_link,
    } = this.props;

    return (
      <div className={'nft__item'}>
        <div className={'nft__image'}>
          <img src={image_url} alt={name}>{description}</img>
        </div>
        <div className={'nft__info'}>
          <p className={'nft__info__name'}>{name}</p>
          <p className={'nft__info__desc'}>{description}</p>
          <p className={'nft__info__link'}><a href={`${base_link}/${token_address}/${token_id}`}>Detail</a></p>
        </div>
      </div>
    );
  }

}

export default (injectIntl(NFT));
