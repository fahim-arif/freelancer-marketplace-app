import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_edkuKN0NFiArW9PkF6BbEskv');

interface IPayoutProps {
  clientSecret: string;
  children: React.ReactElement | React.ReactElement[];
}

function PaymentForm(props: IPayoutProps): JSX.Element {
  const options = {
    // passing the client secret obtained in step 2
    clientSecret: props.clientSecret,
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      {props.children}
    </Elements>
  );
}

export default PaymentForm;
