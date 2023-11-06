import {openModal} from "mastodon/actions/modal";
import {getEarnToken} from "mastodon/utils/web3";
import {transferERC20} from "mastodon/actions/transfer";
import {subscribeAccount, unsubscribeAccount} from "mastodon/actions/accounts";
import {toast} from "react-hot-toast";
import React from "react";
import axios from "axios";

export const hasSetTokenFee = (account) => {
  return account.get('subscription_fee') !== null;
}
export const hasSetUSDFee = (account) => {
  return account.get('subscription_fee_usd') !== null;
}
export const hasSetSubscriptionFee = (account) => {
  const ret = (account.get('subscription_fee') !== null || account.get('subscription_fee_usd') !== null)
  // console.log('hasSetSubscriptionFee returns ', ret);
  return ret;
}

export const showSubscriptionFeature = (account) => {
  return (process.env.REACT_APP_ENABLE_SUBSCRIPTION === 'true' && hasSetSubscriptionFee(account));
}


let reqInstance = axios.create({
  headers: {
    Authorization: process.env.REACT_APP_AUTH_KEY
  }
});

export const createStripeIntent = async (feeInCent) => {
  let ret
  try {
    const res = await reqInstance.get(process.env.REACT_APP_SERVER_ADDRESS + '/stripe/intent?fee_in_cent=' + feeInCent);
    ret = {success: true, data: res.data.result}
  } catch (e) {
    if (e && e.response && e.response.data && e.response.data.message) {
      ret = {success: false, data: e.response.data.message}
    } else {
      ret = {success: false, data: "Failed to create intent"}
    }
  }
  return ret;
}

