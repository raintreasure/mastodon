import React from 'react';
import { injectIntl } from 'react-intl';
import Button from '../../../components/button';
import api from '../../../api';

class WithdrawButton extends React.PureComponent {

  withdraw = (to_address) => {
    api().get('/withdraw', {
      params: { to_address } }).then(res => {
      console.log('api request res:', res);
    }).catch(err => {
      console.error(err);
    });
  };

  handleClick = async() => {
    const web3 = window.web3;
    const to_address = (await web3.eth.getAccounts())[0];
    void this.withdraw(to_address);
  };
  render() {
    return (
      <div className='withdraw_button'>
        <Button onClick={this.handleClick}>Withdraw</Button>
      </div>
    );
  }

}

export default injectIntl(WithdrawButton);
