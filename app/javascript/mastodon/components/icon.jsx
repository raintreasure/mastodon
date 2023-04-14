import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class Icon extends React.PureComponent {

  static propTypes = {
    id: PropTypes.string.isRequired,
    className: PropTypes.string,
    fixedWidth: PropTypes.bool,
  };

  render () {
    var { id, className, fixedWidth, ...other } = this.props;
    if (id === 'star')
      id = 'heart';

    return (
      <i className={classNames('fa', `fa-${id}`, className, { 'fa-fw': fixedWidth })} {...other} />
    );
  }

}
