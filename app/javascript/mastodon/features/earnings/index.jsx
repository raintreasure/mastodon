
import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import axios from 'axios';

const api =axios.create({
  baseURL:'https://jsonplaceholder.typicode.com/posts'
})

class Earnings extends React.PureComponent {

  static propTypes = {
    intl: PropTypes.object,
    multiColumn: PropTypes.bool,
  };

  state = {
    courses: []
  };

  constructor(){
    super();
    api.get('/').then(res => {
      console.log(res.data)
      this.setState({ courses: res.data })
    })
  }
  

  render () {
    return (
      
      <div>
      {this.state.courses.map(course => <h2 key={course.id}>{course.title}</h2>)}
    </div>
    );
  }

}
export default injectIntl(Earnings);


