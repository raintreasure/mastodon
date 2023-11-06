import PropTypes from 'prop-types';
import {PureComponent} from 'react';

import {injectIntl, FormattedMessage} from 'react-intl';

import Button from '../../../components/button';
import {closeModal} from "mastodon/actions/modal";

class CancelableModal extends PureComponent {

  static propTypes = {
    message: PropTypes.node.isRequired,
    onClose: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    dispatch: PropTypes.func,
  };

  static defaultProps = {
    closeWhenConfirm: true,
  };

  handleCancel = () => {
    this.props.onClose();
  };

  render() {
    const {message} = this.props;

    return (
      <div className='modal-root__modal confirmation-modal'>
        <div className='confirmation-modal__container'>
          {message}
        </div>

        <div className='confirmation-modal__action-bar'>
          <Button onClick={this.handleCancel} className='confirmation-modal__cancel-button'>
            <FormattedMessage id='confirmation_modal.cancel' defaultMessage='Cancel'/>
          </Button>
        </div>
      </div>
    );
  }

}

export default injectIntl(CancelableModal);
