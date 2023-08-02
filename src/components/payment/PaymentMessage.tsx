import React from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

function PaymentMesage(): JSX.Element {
  const [loaded, setLoaded] = React.useState<boolean>(false);
  const stripe = useStripe();
  const [message, setMessage] = React.useState<string>('');

  React.useEffect(() => {
    const clientSecret = new URLSearchParams(window.location.search).get('payment_intent_client_secret') as string;

    stripe?.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      // Inspect the PaymentIntent `status` to indicate the status of the payment
      // to your customer.
      //
      // Some payment methods will [immediately succeed or fail][0] upon
      // confirmation, while others will first enter a `processing` state.
      //
      // [0]: https://stripe.com/docs/payments/payment-methods#payment-notification
      switch (paymentIntent?.status) {
        case 'succeeded':
          setMessage('Success! Payment received.');
          break;

        case 'processing':
          setMessage("Payment processing. We'll update you when payment is received.");
          break;

        case 'requires_payment_method':
          // Redirect your user back to your payment page to attempt collecting
          // payment again
          setMessage('Payment failed. Please try another payment method.');
          break;

        default:
          setMessage('Something went wrong.');
          break;
      }
      setLoaded(true);
    });
  }, [stripe]);

  return (
    <section>
      <Container maxWidth="sm">
        {!loaded && (
          <Typography variant="h5" component="div" align="center" sx={{ flexGrow: 1, fontWeight: 'bold', mt: 5 }}>
            We are checking the status of your payment ...
          </Typography>
        )}
        {loaded && (
          <Typography variant="h5" component="div" align="center" sx={{ flexGrow: 1, fontWeight: 'bold', mt: 5 }}>
            {message}
          </Typography>
        )}
      </Container>
    </section>
  );
}

export default PaymentMesage;
