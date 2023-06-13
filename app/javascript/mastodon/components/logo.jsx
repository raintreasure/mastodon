import React from 'react';
import PropTypes from 'prop-types';

const Logo = (props) => {
  const getDarkWordmark = () => {
    switch(process.env.REACT_APP_DAO) {
    case 'chinesedao':
      return '/images/chinese-dark.png';
    case 'facedao':
      return '/images/face-wordmark-dark.png';
    default:
      return '/images/chinese-dark.png';
    }
  };
  const getLightWordmark = () => {
    switch(process.env.REACT_APP_DAO) {
    case 'chinesedao':
      return '/images/chinese-light.png';
    case 'facedao':
      return '/images/face-wordmark-light.png';
    default:
      return '/images/chinese-light.png';
    }
  };
  const logo_path = (document.body && document.body.classList.contains('theme-mastodon-light')) ? getLightWordmark() : getDarkWordmark();
  return (
    <img className={'logo'} src={logo_path} alt='facedao.com' style={{ minWidth: 'fit', height: props.h }} />
  );
};

Logo.propTypes = {
  h: PropTypes.string.isRequired,
};

export default Logo;
