const getDarkWordmark = () => {
  switch (process.env.REACT_APP_DAO) {
    case 'chinesedao':
      return '/images/chinese-wordmark-dark.png';
    case 'facedao':
      return '/images/face-wordmark-dark.png';
    case 'lovedao':
      return '/images/love-wordmark-dark.png';
    case 'pqcdao':
      return '/images/pqc-wordmark-dark.png';
    case 'sexydao':
      return '/images/sexy-wordmark-dark.png';
    default:
      return '/images/chinese-wordmark-dark.png';
  }
};
const getLightWordmark = () => {
  switch (process.env.REACT_APP_DAO) {
    case 'chinesedao':
      return '/images/chinese-wordmark-light.png';
    case 'facedao':
      return '/images/face-wordmark-light.png';
    case 'lovedao':
      return '/images/love-wordmark-light.png';
    case 'pqcdao':
      return '/images/pqc-wordmark-light.png';
    case 'sexydao':
      return '/images/sexy-wordmark-light.png';
    default:
      return '/images/chinese-wordmark-light.png';
  }
};
const wordmarkPath =
  document.body && document.body.classList.contains('theme-mastodon-light')
    ? getLightWordmark()
    : getDarkWordmark();

export const getIcon = () => {
  switch (process.env.REACT_APP_DAO) {
    case 'chinesedao':
      return '/images/chinese-icon.png';
    case 'facedao':
      return '/images/face-icon.png';
    case 'lovedao':
      return '/images/love-icon.png';
    case 'pqcdao':
      return '/images/pqc-icon.png';
    case 'sexydao':
      return '/images/sexy-icon.png';
    default:
      return '/images/chinese-icon.png';
  }
};

export const WordmarkLogo: React.FC = () => (
  <>
    <img
      className={'logo logo--wordmark wordmark--dark'}
      src={getDarkWordmark()}
      alt='wordmark'
    />
    <img
      className={'logo logo--wordmark wordmark--light'}
      src={getLightWordmark()}
      alt='wordmark'
    />
  </>
);

export const SymbolLogo: React.FC = () => (
  <img src={getIcon()} alt='icon' className='logo logo--icon' />
);
