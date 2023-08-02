import * as React from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import FormGroup from '@mui/material/FormGroup';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';

function CheckoutForm(): JSX.Element {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = React.useState<string | undefined>(undefined);

  const performSubmit = (event: { preventDefault: () => void }): void => {
    handleSubmit(event);
  };

  const handleSubmit = async (event: { preventDefault: () => void }): Promise<void> => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (stripe == null || elements == null) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const { error } = await stripe.confirmPayment({
      // `Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: location.protocol + '//' + location.host + '/PaymentStatus',
      },
    });

    if (error != null) {
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Show error to your customer (for example, payment
      // details incomplete)
      setErrorMessage(error.message);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  };
  return (
    <form onSubmit={performSubmit}>
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <PaymentElement />
        </Grid>
      </Grid>
      <Grid container spacing={0} justifyContent="right">
        <Grid item xs={12} sm={6}>
          <FormGroup>
            <FormControl sx={{ ml: 1 }} variant="standard">
              <Button disabled={stripe == null} type="submit" variant="contained" size="large" sx={{ mt: 2 }}>
                Submit
              </Button>
            </FormControl>
          </FormGroup>
        </Grid>
      </Grid>
      {errorMessage != null && (
        <Typography sx={{ m: 1, color: '#d32f2f' }} component="div" align="center">
          {errorMessage}
        </Typography>
      )}
    </form>
  );
}

export default CheckoutForm;
