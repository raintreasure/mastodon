import { daoName } from '../initial_state';

export const getEarnToken = () => {
  switch (daoName) {
  case 'chinesedao':
    return '$CHINESE';
  case 'facedao':
    return '$LOVE';
  default:
    return '$CHINESE';
  }
};

export const getNativeToken = () => {
  switch (daoName) {
  case 'chinesedao':
    return '$MATIC';
  case 'facedao':
    return '$BNB';
  default:
    return '$MATIC';
  }
};
