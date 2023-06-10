
export const getEarnToken = () => {
  switch (process.env.REACT_APP_DAO) {
  case 'chinesedao':
    return '$CHINESE';
  case 'facedao':
    return '$LOVE';
  default:
    return '$CHINESE';
  }
};

export const getNativeToken = () => {
  switch (process.env.REACT_APP_DAO) {
  case 'chinesedao':
    return '$MATIC';
  case 'facedao':
    return '$BNB';
  default:
    return '$MATIC';
  }
};
