import React, {useEffect, useState} from 'react';
import {loadStripe} from '@stripe/stripe-js';
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import {Button} from 'antd';
import {createStripeIntent} from "mastodon/utils/account";
import {closeModal} from "mastodon/actions/modal";
import {subscribeAccount} from "mastodon/actions/accounts";

const StripeCheckoutForm = (props) => {
  const {feeInCent, dispatch, toAccountId} = props;
  const stripe = useStripe();
  const elements = useElements();
  const [errMessage, setErrMessage] = useState('');
  const [processing, setProcessing] = useState(false);
  const [elementReady, setElementReady] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const initCreateIntent = async () => {
    const res = await createStripeIntent(feeInCent)
    if (res.success === true) {
      console.log('create intent ok, data:', res.data);
      const {client_secret} = res.data;
      setClientSecret(client_secret)
    } else {
      setErrMessage(res.data)
    }
  }
  useEffect(() => {
    void initCreateIntent();
  }, [])

  const handleSubmit = async (event, clientSecret, dispatch) => {
    setProcessing(true);
    try {
      event.preventDefault();
      if (elements == null) {
        return;
      }
      // Trigger form validation and wallet collection
      const {error: submitError} = await elements.submit();
      if (submitError) {
        // Show error to your customer
        setErrMessage(submitError.message);
        return;
      }
      setErrMessage('');
      const {error, paymentIntent} = await stripe.confirmPayment({
        //`Elements` instance that was used to create the Payment Element
        elements,
        clientSecret,
        confirmParams: {
          return_url: process.env.REACT_APP_FRONTEND_DOMAIN,
        },
        redirect: 'if_required'
      });

      if (error) {
        setErrMessage(error.message);
      } else {
        if (paymentIntent.status === 'succeeded') {
          console.log('after confirm payment, enter success branch');
          const postUrl = `/api/v1/accounts/${toAccountId}/subscribe`;
          dispatch(subscribeAccount(postUrl, toAccountId));
          setErrMessage('');
          //close modal
          dispatch(closeModal({
            modalType: 'CANCELABLE',
            ignoreFocus: true,
          }));
        }
      }
    } catch (e) {
      console.log(e)
    } finally {
      setProcessing(false)
    }
  };
  return (
    <form style={{width: '100%'}}>
      <PaymentElement onReady={() => setElementReady(true)}/>

      <Button disabled={!stripe || !elements || processing || !elementReady || clientSecret === ''}
              className={'stripe_button'}
              onClick={(e) => {
                void handleSubmit(e, clientSecret, dispatch)
              }}>
        {processing ? 'Processing' : 'Pay'}
      </Button>
      <p style={{color: 'red'}}>{errMessage}</p>

    </form>
  );
};

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUB_KEY);


const StripeElement = (props) => {
  const {feeInCent, dispatch, toAccountId} = props;
  const options = {
    mode: 'payment',
    amount: feeInCent,
    currency: 'usd',
  };
  console.log('feeInCent is:', feeInCent)
  return (
    <Elements stripe={stripePromise} options={options}>
      <StripeCheckoutForm feeInCent={feeInCent} dispatch={dispatch} toAccountId={toAccountId}/>
    </Elements>
  );
}

export default StripeElement;
