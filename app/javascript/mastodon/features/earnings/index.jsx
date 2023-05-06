
import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';


class Earnings extends React.PureComponent {

  static propTypes = {
    intl: PropTypes.object,
    multiColumn: PropTypes.bool,
  };

  state = {
    content: null,
    lastUpdated: null,
    isLoading: true,
  };

  componentDidMount () {
    // api().get('/api/v1/instance/privacy_policy').then(({ data }) => {
    //   this.setState({ content: data.content, lastUpdated: data.updated_at, isLoading: false });
    // }).catch(() => {
    //   this.setState({ isLoading: false });
    // });
  }

  render () {
    return (
      <p>Earnings</p>
    );
  }

}

export default injectIntl(Earnings);
