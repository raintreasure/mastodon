import React from 'react';
import PropTypes from 'prop-types';

const Logo = (props) =>{
  const logo_path = (document.body && document.body.classList.contains('theme-mastodon-light')) ? 'chinese-dark.png' : 'chinese-icon-s.png';
  return (
    <img className={'logo'} src={logo_path} alt='Chinese.org' style={{ maxWidth:'100%', height:props.h }} />
  );
};

Logo.propTypes = {
  h: PropTypes.string.isRequired,
};

export default Logo;
