import PropTypes from 'prop-types';

const axios = require('axios').default;

export const OPENSEA_API_KEY = process.env.REACT_APP_OPENSEA_API_KEY;  // 有效期截止2024年5月9日
export const OPENSEA_API_V1_BASE_URL = 'https://api.opensea.io/api/v1';
// const OPENSEA_API_V2_BASE_URL = 'https://api.opensea.io/api/v2';

export const NFTSCAN_API_KEY = process.env.REACT_APP_NFTSCAN_API_KEY;
export const NFTSCAN_API_V2_BASE_URL = 'https://polygonapi.nftscan.com/api/v2';

export const ASSETS_FETCH_REQUEST = 'ASSETS_FETCH_REQUEST';
export const ASSETS_OPENSEA_FETCH_SUCCESS = 'ASSETS_OPENSEA_FETCH_SUCCESS';

export const ASSETS_NFTSCAN_FETCH_SUCCESS = 'ASSETS_NFTSCAN_FETCH_SUCCESS';

export function fetchAssetsRequest(accountId) {
  return {
    type: ASSETS_FETCH_REQUEST,
    accountId,
  };
}

export function fetchOpenseaSuccess(accountId, assets) {
  return {
    type: ASSETS_OPENSEA_FETCH_SUCCESS,
    accountId,
    assets,
  };
}

export function fetchNftscanSuccess(accountId, assets) {
  return {
    type: ASSETS_NFTSCAN_FETCH_SUCCESS,
    accountId,
    assets,
  };
}

// eslint-disable-next-line no-unused-vars
const getOpenseaAssetsByGraphql = async (address, chain) => {
  const query = `
  account(address: '${address}', chain: '${chain}') {
    assets
  }
`;
  await axios
    .post('https://api.opensea.io/graphql/', { query }, {
      headers: { accept: 'application/json', 'X-API-KEY': OPENSEA_API_KEY },
    })
    .then(response => {
      // console.log(response.data);
    })
    .catch(error => {
      console.log(error);
    });
};

/**
 * 调用OpenSea API 获取某个地址的所有资产
 * @param accountId
 * @param address
 * @param dispatch
 * @returns {Promise<null>}
 */
// eslint-disable-next-line no-unused-vars
const getOpenseaAssets = async (accountId, address, dispatch) => {
  let options = {
    method: 'GET',
    url: OPENSEA_API_V1_BASE_URL+'/assets',
    params: {
      owner: address,
      order_direction: 'desc',
      limit: '20',
      cursor: '',  // 游标, 当前页数, 由此一个数据返回.数据在 response.data.next: string
      include_orders: 'false',
    },
    headers: { accept: 'application/json', 'X-API-KEY': OPENSEA_API_KEY },
  };

  let assetsList = [];

  try {
    let nextIndex = '';
    // getOpenseaAssetsByGraphql(address, 'ethereum');
    do {
      let result = await axios.get(options.url, {
        params: options.params,
        headers: options.headers,
      });
      // if (result.data.code !== 200) break;
      result.data.assets.map((asset)=>{
        assetsList.push(asset);
      });
      nextIndex = result.data.next;
      options.params.cursor = nextIndex;
      // console.log(assetsList);
    } while (nextIndex !== null);
  } catch (error) {
    console.log('fetch account assets error:', error);
    throw error;
  } finally {
    dispatch(fetchOpenseaSuccess(accountId, assetsList));
  }
};

const getNftscanAssets = async (accountId, address, dispatch) => {
  let options = {
    params:{
      // account_address: address,
      show_attribute: true,
      erc_type: '',  // erc721 || erc1155 || both
      contract_address: '',  // 合约地址
      // cursor: '',  // 游标指针
      // limit: '',  // page size, default 20 per p
    },
    method: 'GET',
    url: NFTSCAN_API_V2_BASE_URL + '/account/own/all/' + address,
    headers: { 'X-API-KEY': NFTSCAN_API_KEY },
  };

  let assetsList = [];

  try {
    let result = await axios.get(options.url, {
      params: options.params,
      headers: options.headers,
    });
    // if (result.data.code !== 200) break;
    result.data.data.map((collection)=>{
      collection.assets.map((asset)=>{
        assetsList.push(asset);
      });
    });

  } catch (error) {
    console.log('fetch polygon assets error:', error);
  } finally {
    dispatch(fetchNftscanSuccess(accountId, assetsList));
  }

};

/**
 * 获取当前账户的所有资产（721、1155）
 * @param accountId
 * @param address
 * @returns {(function(*): void)|*}
 */
export function fetchAssets(accountId, address) {
  return (dispatch) => {
    dispatch(fetchAssetsRequest(accountId));
    // void getOpenseaAssets(accountId, address, dispatch);
    void getNftscanAssets(accountId, address, dispatch);
  };
}

export const opensea_asset_model = PropTypes.shape({
  // base info
  id: PropTypes.number,
  token_id: PropTypes.string,
  name: PropTypes.string,
  description: PropTypes.string,
  num_sales: PropTypes.number,
  background_color: PropTypes.string,
  external_link: PropTypes.string,
  token_address: PropTypes.string,
  // owner
  owner: PropTypes.object, //
  // other
  decimals: PropTypes.any,
  token_metadata: PropTypes.any,
  is_nsfw: PropTypes.bool,

  // link
  image_url: PropTypes.string,
  image_preview_url: PropTypes.string,
  image_thumbnail_url: PropTypes.string,
  image_original_url: PropTypes.string,
  animation_url: PropTypes.string,
  animation_original_url: PropTypes.string,
  permalink: PropTypes.string,  // details page
  // Contract
  asset_contract: PropTypes.shape({
    address: PropTypes.string,
    chain_identifier: PropTypes.string,
  }),
  // Collection
  collection: PropTypes.shape({

  }),
  // Creator
  creator: PropTypes.shape({  // Creator
    user: PropTypes.shape({
      username: PropTypes.string,
    }),
    address: PropTypes.string,
  }),
});

export const nftscan_asset_model = PropTypes.shape({
  contract_address: PropTypes.string,
  contract_name: PropTypes.string,
  contract_token_id: PropTypes.string,
  token_id: PropTypes.string,
  erc_type: PropTypes.string,
  amount: PropTypes.string,
  minter: PropTypes.string,
  owner: PropTypes.string,
  own_timestamp: PropTypes.number,
  mint_timestamp: PropTypes.number,
  mint_transaction_hash: PropTypes.string,
  mint_price: PropTypes.number,
  token_uri: PropTypes.string,
  metadata_json: PropTypes.string,  // JSON
  name: PropTypes.string,
  content_type: PropTypes.string,
  content_uri: PropTypes.string,
  description: PropTypes.string,
  image_uri: PropTypes.string,
  external_link: PropTypes.string,
  latest_trade_price: PropTypes.number,
  latest_trade_symbol: PropTypes.string,
  latest_trade_token: PropTypes.any,  //TO-DO
  latest_trade_timestamp: PropTypes.number,
  nftscan_id: PropTypes.string,
  nftscan_uri: PropTypes.string,
  small_nftscan_uri: PropTypes.any,  //TO-DO
  attributes: PropTypes.shape({
    attribute_name: PropTypes.string,
    attribute_value: PropTypes.string,
    percentage: PropTypes.any,  //TO-DO
  }),
  rarity_score: PropTypes.any,  //TO-DO
  rarity_rank: PropTypes.any,  //TO-DO
});

export const nftscan_asset_metadata_json_model = PropTypes.shape({
  name: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
  external_url: PropTypes.string,
  animation_url: PropTypes.string,
  properties: PropTypes.shape({
    number: PropTypes.number,
    name: PropTypes.string,
  }),
});

/**
 * opensea_api_v1 调用请求样例
 * @type {{headers: {'X-API-KEY': string, accept: string}, method: string, params: {owner: string, limit: string, include_orders: string, order_direction: string}, url: string}}
 */
export const example_opensea_request_options = {
  method: 'GET',
  url: 'https://api.opensea.io/api/v1/assets',
  params: {
    owner: '0x897D79ae3Ad11A0aC4AF8D1B9B12B8c5b0E3cc5F',
    order_direction: 'desc',
    limit: '20',
    include_orders: 'false',
  },
  headers: {
    accept: 'application/json',
    'X-API-KEY': '26ee232021e04342814b392cd5d87e8d',
  },
};

/**
 * opensea_api_v1 调用返回数据样例
 * @type {{next: null, assets: [{top_bid: null, traits: *[], image_thumbnail_url: string, image_preview_url: string, description: null, supports_wyvern: boolean, rarity_data: null, asset_contract: {owner: number, symbol: string, seller_fee_basis_points: number, address: string, opensea_version: string, total_supply: string, image_url: null, chain_identifier: string, description: string, default_to_fiat: boolean, opensea_buyer_fee_basis_points: number, schema_name: string, external_link: null, dev_seller_fee_basis_points: number, buyer_fee_basis_points: number, payout_address: null, opensea_seller_fee_basis_points: number, name: string, asset_contract_type: string, created_date: string, nft_version: null, only_proxied_transfers: boolean, dev_buyer_fee_basis_points: number}, last_sale: null, is_nsfw: boolean, token_id: string, transfer_fee_payment_token: null, seaport_sell_orders: null, id: number, token_metadata: null, owner: null, animation_url: null, creator: {address: string, profile_img_url: string, user: {username: string}, config: string}, num_sales: number, image_url: string, collection: {short_description: null, featured: boolean, fees: {seller_fees: {}, opensea_fees: {'0x0000a26b00c1f0df003000390027140000faa719': number}}, hidden: boolean, wiki_url: null, twitter_username: null, default_to_fiat: boolean, description: null, opensea_buyer_fee_basis_points: string, discord_url: null, is_nsfw: boolean, external_url: null, large_image_url: null, is_rarity_enabled: boolean, payout_address: null, opensea_seller_fee_basis_points: number, banner_image_url: null, safelist_request_status: string, featured_image_url: null, instagram_username: null, slug: string, is_subject_to_whitelist: boolean, image_url: null, is_creator_fees_enforced: boolean, dev_seller_fee_basis_points: string, medium_username: null, telegram_url: null, display_data: {images: *[], card_display_style: string}, name: string, chat_url: null, created_date: string, only_proxied_transfers: boolean, require_email: boolean, dev_buyer_fee_basis_points: string}, image_original_url: null, external_link: null, transfer_fee: null, background_color: null, animation_original_url: null, decimals: null, name: string, permalink: string, listing_date: null},{top_bid: null, traits: *[], image_thumbnail_url: string, image_preview_url: string, description: null, supports_wyvern: boolean, rarity_data: null, asset_contract: {owner: number, symbol: string, seller_fee_basis_points: number, address: string, opensea_version: string, total_supply: string, image_url: null, chain_identifier: string, description: string, default_to_fiat: boolean, opensea_buyer_fee_basis_points: number, schema_name: string, external_link: null, dev_seller_fee_basis_points: number, buyer_fee_basis_points: number, payout_address: null, opensea_seller_fee_basis_points: number, name: string, asset_contract_type: string, created_date: string, nft_version: null, only_proxied_transfers: boolean, dev_buyer_fee_basis_points: number}, last_sale: null, is_nsfw: boolean, token_id: string, transfer_fee_payment_token: null, seaport_sell_orders: null, id: number, token_metadata: null, owner: null, animation_url: null, creator: {address: string, profile_img_url: string, user: {username: string}, config: string}, num_sales: number, image_url: string, collection: {short_description: null, featured: boolean, fees: {seller_fees: {}, opensea_fees: {'0x0000a26b00c1f0df003000390027140000faa719': number}}, hidden: boolean, wiki_url: null, twitter_username: null, default_to_fiat: boolean, description: null, opensea_buyer_fee_basis_points: string, discord_url: null, is_nsfw: boolean, external_url: null, large_image_url: null, is_rarity_enabled: boolean, payout_address: null, opensea_seller_fee_basis_points: number, banner_image_url: null, safelist_request_status: string, featured_image_url: null, instagram_username: null, slug: string, is_subject_to_whitelist: boolean, image_url: null, is_creator_fees_enforced: boolean, dev_seller_fee_basis_points: string, medium_username: null, telegram_url: null, display_data: {images: *[], card_display_style: string}, name: string, chat_url: null, created_date: string, only_proxied_transfers: boolean, require_email: boolean, dev_buyer_fee_basis_points: string}, image_original_url: null, external_link: string, transfer_fee: null, background_color: null, animation_original_url: null, decimals: null, name: string, permalink: string, listing_date: null}], previous: null}}
 */
export const example_opensea_response_data = {
  'next': null,
  'previous': null,
  'assets': [
    {
      'id': 1207021795,
      'token_id': '62188555947537607368652164423806882640118054554091766553535796329021190439012',
      'num_sales': 0,
      'background_color': null,
      'image_url': 'https://i.seadn.io/gcs/files/ed58edcffb0e7baeb800cbaf67397aee.jpg?w=500&auto=format',
      'image_preview_url': 'https://i.seadn.io/gcs/files/ed58edcffb0e7baeb800cbaf67397aee.jpg?w=500&auto=format',
      'image_thumbnail_url': 'https://i.seadn.io/gcs/files/ed58edcffb0e7baeb800cbaf67397aee.jpg?w=500&auto=format',
      'image_original_url': null,
      'animation_url': null,
      'animation_original_url': null,
      'name': 'Goose or duck',
      'description': null,
      'external_link': null,
      'asset_contract': {
        'address': '0x495f947276749ce646f68ac8c248420045cb7b5e',
        'asset_contract_type': 'semi-fungible',
        'chain_identifier': 'ethereum',
        'created_date': '2020-12-02T17:40:53.232025',
        'name': 'OpenSea Shared Storefront',
        'nft_version': null,
        'opensea_version': '2.0.0',
        'owner': 458910490,
        'schema_name': 'ERC1155',
        'symbol': 'OPENSTORE',
        'total_supply': '0',
        'description': '',
        'external_link': null,
        'image_url': null,
        'default_to_fiat': false,
        'dev_buyer_fee_basis_points': 0,
        'dev_seller_fee_basis_points': 0,
        'only_proxied_transfers': false,
        'opensea_buyer_fee_basis_points': 0,
        'opensea_seller_fee_basis_points': 250,
        'buyer_fee_basis_points': 0,
        'seller_fee_basis_points': 250,
        'payout_address': null,
      },
      'permalink': 'https://opensea.io/assets/ethereum/0x495f947276749ce646f68ac8c248420045cb7b5e/62188555947537607368652164423806882640118054554091766553535796329021190439012',
      'collection': {
        'banner_image_url': null,
        'chat_url': null,
        'created_date': '2022-10-07T12:59:30.821614+00:00',
        'default_to_fiat': false,
        'description': null,
        'dev_buyer_fee_basis_points': '0',
        'dev_seller_fee_basis_points': '0',
        'discord_url': null,
        'display_data': {
          'card_display_style': 'contain',
          'images': [],
        },
        'external_url': null,
        'featured': false,
        'featured_image_url': null,
        'hidden': true,
        'safelist_request_status': 'not_requested',
        'image_url': null,
        'is_subject_to_whitelist': false,
        'large_image_url': null,
        'medium_username': null,
        'name': 'Untitled Collection #531917301',
        'only_proxied_transfers': false,
        'opensea_buyer_fee_basis_points': '0',
        'opensea_seller_fee_basis_points': 250,
        'payout_address': null,
        'require_email': false,
        'short_description': null,
        'slug': 'untitled-collection-531917301',
        'telegram_url': null,
        'twitter_username': null,
        'instagram_username': null,
        'wiki_url': null,
        'is_nsfw': false,
        'fees': {
          'seller_fees': {},
          'opensea_fees': {
            '0x0000a26b00c1f0df003000390027140000faa719': 250,
          },
        },
        'is_rarity_enabled': false,
        'is_creator_fees_enforced': true,
      },
      'decimals': null,
      'token_metadata': null,
      'is_nsfw': false,
      'owner': null,
      'seaport_sell_orders': null,
      'creator': {
        'user': {
          'username': 'bursonz',
        },
        'address': '0x897d79ae3ad11a0ac4af8d1b9b12b8c5b0e3cc5f',
        'config': '',
        'profile_img_url': '',
      },
      'traits': [],
      'last_sale': null,
      'top_bid': null,
      'listing_date': null,
      'supports_wyvern': true,
      'rarity_data': null,
      'transfer_fee': null,
      'transfer_fee_payment_token': null,
    },
    {
      'id': 691795352,
      'token_id': '62188555947537607368652164423806882640118054554091766553535796327921678811236',
      'num_sales': 0,
      'background_color': null,
      'image_url': 'https://i.seadn.io/gae/da9Qd-_xpf0lCbKaUinm0HV7MjRgpX4PqEfJosGWZWym5RuQuehu9-dqJpY4t3ozsOoTx-HyzMZb2t6hbmR_o_9PS9cADAmu8WQ0d1U?w=500&auto=format',
      'image_preview_url': 'https://i.seadn.io/gae/da9Qd-_xpf0lCbKaUinm0HV7MjRgpX4PqEfJosGWZWym5RuQuehu9-dqJpY4t3ozsOoTx-HyzMZb2t6hbmR_o_9PS9cADAmu8WQ0d1U?w=500&auto=format',
      'image_thumbnail_url': 'https://i.seadn.io/gae/da9Qd-_xpf0lCbKaUinm0HV7MjRgpX4PqEfJosGWZWym5RuQuehu9-dqJpY4t3ozsOoTx-HyzMZb2t6hbmR_o_9PS9cADAmu8WQ0d1U?w=500&auto=format',
      'image_original_url': null,
      'animation_url': null,
      'animation_original_url': null,
      'name': 'StarZ',
      'description': null,
      'external_link': 'https://faineant.cn/StarZ.html',
      'asset_contract': {
        'address': '0x495f947276749ce646f68ac8c248420045cb7b5e',
        'asset_contract_type': 'semi-fungible',
        'chain_identifier': 'ethereum',
        'created_date': '2020-12-02T17:40:53.232025',
        'name': 'OpenSea Shared Storefront',
        'nft_version': null,
        'opensea_version': '2.0.0',
        'owner': 458910490,
        'schema_name': 'ERC1155',
        'symbol': 'OPENSTORE',
        'total_supply': '0',
        'description': '',
        'external_link': null,
        'image_url': null,
        'default_to_fiat': false,
        'dev_buyer_fee_basis_points': 0,
        'dev_seller_fee_basis_points': 0,
        'only_proxied_transfers': false,
        'opensea_buyer_fee_basis_points': 0,
        'opensea_seller_fee_basis_points': 250,
        'buyer_fee_basis_points': 0,
        'seller_fee_basis_points': 250,
        'payout_address': null,
      },
      'permalink': 'https://opensea.io/assets/ethereum/0x495f947276749ce646f68ac8c248420045cb7b5e/62188555947537607368652164423806882640118054554091766553535796327921678811236',
      'collection': {
        'banner_image_url': null,
        'chat_url': null,
        'created_date': '2022-10-07T12:59:30.821614+00:00',
        'default_to_fiat': false,
        'description': null,
        'dev_buyer_fee_basis_points': '0',
        'dev_seller_fee_basis_points': '0',
        'discord_url': null,
        'display_data': {
          'card_display_style': 'contain',
          'images': [],
        },
        'external_url': null,
        'featured': false,
        'featured_image_url': null,
        'hidden': true,
        'safelist_request_status': 'not_requested',
        'image_url': null,
        'is_subject_to_whitelist': false,
        'large_image_url': null,
        'medium_username': null,
        'name': 'Untitled Collection #531917301',
        'only_proxied_transfers': false,
        'opensea_buyer_fee_basis_points': '0',
        'opensea_seller_fee_basis_points': 250,
        'payout_address': null,
        'require_email': false,
        'short_description': null,
        'slug': 'untitled-collection-531917301',
        'telegram_url': null,
        'twitter_username': null,
        'instagram_username': null,
        'wiki_url': null,
        'is_nsfw': false,
        'fees': {
          'seller_fees': {},
          'opensea_fees': {
            '0x0000a26b00c1f0df003000390027140000faa719': 250,
          },
        },
        'is_rarity_enabled': false,
        'is_creator_fees_enforced': true,
      },
      'decimals': null,
      'token_metadata': null,
      'is_nsfw': false,
      'owner': null,
      'seaport_sell_orders': null,
      'creator': {
        'user': {
          'username': 'bursonz',
        },
        'address': '0x897d79ae3ad11a0ac4af8d1b9b12b8c5b0e3cc5f',
        'config': '',
        'profile_img_url': '',
      },
      'traits': [],
      'last_sale': null,
      'top_bid': null,
      'listing_date': null,
      'supports_wyvern': true,
      'rarity_data': null,
      'transfer_fee': null,
      'transfer_fee_payment_token': null,
    },
  ],
};
