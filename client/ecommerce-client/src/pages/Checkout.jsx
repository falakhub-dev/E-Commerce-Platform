import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { createIntent, confirmOrder } from '../api/checkout';

const stripePromise = loadStripe('pk_test_replace');

function CheckoutForm({ clientSecret, orderId }) {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: elements.getElement(CardElement) }
    });
    if (error) {
      alert(error.message);
    } else if (paymentIntent.status === 'succeeded') {
      await confirmOrder(orderId);
      alert('Payment successful');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe}>Pay</button>
    </form>
  );
}

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState(null);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    createIntent().then(res => {
      setClientSecret(res.data.clientSecret);
      setOrderId(res.data.orderId);
    }).catch(() => alert('Login and add items to cart first'));
  }, []);

  if (!clientSecret) return <p>Preparing payment…</p>;

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <div className="container">
        <h2>Checkout</h2>
        <CheckoutForm clientSecret={clientSecret} orderId={orderId} />
      </div>
    </Elements>
  );
}
