import * as React from 'react';
import { showUIError } from 'utils/errorHandler';
import { createOnBoardingUrl } from 'services/payoutService';
import IApiError from 'global/interfaces/api';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

function StripeReAuth(): JSX.Element {
  React.useEffect(() => {
    createOnBoardingUrl()
      .then((res: string) => {
        window.location.replace(res);
      })
      .catch((err: IApiError) => {
        showUIError(err.message);
      });
  });

  return (
    <React.Fragment>
      <Container maxWidth="sm">
        <Typography variant="h5" component="div" align="center" sx={{ flexGrow: 1, fontWeight: 'bold', mt: 5 }}>
          Please wait while you are re-directed to Stripe.
        </Typography>
      </Container>
    </React.Fragment>
  );
}

export default StripeReAuth;
