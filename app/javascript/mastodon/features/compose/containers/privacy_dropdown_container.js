import { connect } from 'react-redux';

import { changeComposeVisibility } from '../../../actions/compose';
import { openModal, closeModal } from '../../../actions/modal';
import { isUserTouching } from '../../../is_mobile';
import PrivacyDropdown from '../components/privacy_dropdown';
import {me} from "mastodon/initial_state";

const mapStateToProps = state => ({
  value: state.getIn(['compose', 'privacy']),
  account: state.getIn(['accounts', me]),
});

const mapDispatchToProps = dispatch => ({

  onChange (value) {
    dispatch(changeComposeVisibility(value));
  },

  isUserTouching,
  onModalOpen: props => dispatch(openModal({
    modalType: 'ACTIONS',
    modalProps: props,
  })),
  onModalClose: () => dispatch(closeModal({
    modalType: undefined,
    ignoreFocus: false,
  })),

});

export default connect(mapStateToProps, mapDispatchToProps)(PrivacyDropdown);
