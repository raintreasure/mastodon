import React from 'react';
import PropTypes from 'prop-types';

const Logo = (props) => (
  <img className={'logo'} src='chinese-dark.png' alt='Chinese.org' style={{ maxWidth:'100%', height:props.h }} />
);

Logo.propTypes = {
  h: PropTypes.string.isRequired,
};

export default Logo;
