import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import { showUIError } from 'utils/errorHandler';
import { getContract } from 'services/contractService';
import { IContract, ContractViewType } from 'global/interfaces/contract';
import IApiError from 'global/interfaces/api';
import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { useNavigate } from 'react-router-dom';
import { dateStringFromDate } from 'utils/dateFormat';
import { FormSubtitlePaper } from 'components/common/form/FormSubtitlePaper';
import { getContractStatusText, getPayoutStatusText } from 'utils/contractTextHelper';

function ContractDetails(): JSX.Element {
  React.useEffect(() => {
    document.title = 'Contract Details';
  }, []);

  const contractId = new URLSearchParams(window.location.search).get('id') as string;

  const successfulPayment = new URLSearchParams(window.location.search).get('successfulPayment') as string;

  const [contract, setContract] = React.useState<IContract | null>(null);
  const [paymentDateText, setPaymentDateText] = React.useState<string | null>(null);
  const navigate = useNavigate();

  const handleWorkRoomClick = (): void => {
    navigate('/WorkRoom');
  };

  // Get seller on page load
  useEffect(() => {
    getContract(contractId)
      .then((res: IContract) => {
        setContract(res);
        setPaymentDate(res);
      })
      .catch((err: IApiError) => {
        if (err.status !== 404) {
          showUIError(err.message);
        }
      });
  }, []);

  const setPaymentDate = (contract: IContract): void => {
    let date = '';
    if (successfulPayment === 'true') {
      date = dateStringFromDate(new Date().toString());
    } else {
      date = dateStringFromDate(contract?.paymentDate);
    }

    setPaymentDateText(date);
  };

  return (
    <React.Fragment>
      <Container maxWidth="md">
        <Box className="form-paper">
          {successfulPayment === 'true' && (
            <Typography variant="h4" component="div" align="center" sx={{ flexGrow: 1, mb: 2 }}>
              Your payment has been processed
            </Typography>
          )}
          {successfulPayment !== 'true' && (
            <Typography variant="h4" component="div" align="center" sx={{ flexGrow: 1, mb: 2 }}>
              Contract Details
            </Typography>
          )}
          <Typography variant="body1" component="div" align="center" sx={{ flexGrow: 1, mb: 2 }}>
            <Link sx={{ cursor: 'pointer' }} onClick={handleWorkRoomClick}>
              Go to Workroom
            </Link>
          </Typography>
          <Stack direction="column" spacing={{ xs: 1, sm: 1, md: 2 }} sx={{ pb: 3 }}>
            <Paper variant="outlined" sx={{ pb: 2 }}>
              <FormSubtitlePaper variant="outlined">
                <Typography component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                  Contract Information
                </Typography>
              </FormSubtitlePaper>
              <Grid container spacing={1} sx={{ p: 1 }}>
                <Grid container item xs={12} sm={6}>
                  <Grid item xs={3}>
                    <Typography component="div" align="left">
                      Contract Id
                    </Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <Typography component="div" align="right">
                      {contract?.contractId}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container item xs={12} sm={6}>
                  <Grid item xs={6}>
                    <Typography component="div" align="left">
                      Contract Date
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography component="div" align="right">
                      {dateStringFromDate(contract?.createdDate)}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container item xs={12} sm={6}>
                  <Grid item xs={6}>
                    {contract?.viewType === ContractViewType.Buy && (
                      <Typography component="div" align="left">
                        Seller Name
                      </Typography>
                    )}
                    {contract?.viewType === ContractViewType.Sell && (
                      <Typography component="div" align="left">
                        Buyer Name
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={6}>
                    {contract?.viewType === ContractViewType.Buy && (
                      <Typography component="div" align="right">
                        {contract?.buyerAdditionalDetails?.sellerDisplayName}
                      </Typography>
                    )}
                    {contract?.viewType === ContractViewType.Sell && (
                      <Typography component="div" align="right">
                        {contract?.sellerAdditionalDetails?.buyerDisplayName}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
                <Grid container item xs={12} sm={6}>
                  <Grid item xs={6}>
                    <Typography component="div" align="left">
                      Contract Status
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography component="div" align="right">
                      {contract !== null && getContractStatusText(contract)}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container item xs={12} sm={6}>
                  <Grid item xs={6}>
                    <Typography component="div" align="left">
                      Payment Date
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography component="div" align="right">
                      {paymentDateText}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container item xs={12} sm={6}>
                  <Grid item xs={6}>
                    <Typography component="div" align="left">
                      Completed Date
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography component="div" align="right">
                      {dateStringFromDate(contract?.completedDate)}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
            <Paper variant="outlined" sx={{ pb: 2 }}>
              <FormSubtitlePaper variant="outlined">
                <Typography component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                  Items
                </Typography>
              </FormSubtitlePaper>
              <Grid container spacing={1} sx={{ p: 1 }}>
                <Grid container item xs={12}>
                  <Grid item xs={9}>
                    <Typography component="div" align="left">
                      {contract?.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography component="div" align="right">
                      ${contract?.displayAmount}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container item xs={12}>
                  <Grid item xs={9}>
                    <Typography component="div" align="left">
                      Shoutt Service Fee
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    {contract?.viewType === ContractViewType.Buy && (
                      <Typography component="div" align="right">
                        ${contract?.buyerAdditionalDetails?.buyerFee}
                      </Typography>
                    )}
                    {contract?.viewType === ContractViewType.Sell && (
                      <Typography component="div" align="right">
                        ${contract?.sellerAdditionalDetails?.sellerFee}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
                {contract?.viewType === ContractViewType.Buy && (
                  <Grid container item xs={12}>
                    <Grid item xs={9}>
                      <Typography component="div" align="left">
                        Contract Total
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography component="div" align="right">
                        ${contract?.buyerAdditionalDetails?.totalBuyerAmount}
                      </Typography>
                    </Grid>
                  </Grid>
                )}
                {contract?.viewType === ContractViewType.Sell && (
                  <Grid container item xs={12}>
                    <Grid item xs={9}>
                      <Typography component="div" align="left">
                        Total Earnings
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography component="div" align="right">
                        ${contract?.sellerAdditionalDetails?.totalSellerEarnings}
                      </Typography>
                    </Grid>
                  </Grid>
                )}
              </Grid>
            </Paper>
            {contract?.viewType === ContractViewType.Buy && (
              <Paper variant="outlined" sx={{ pb: 2 }}>
                <FormSubtitlePaper variant="outlined">
                  <Typography component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                    Payment Information
                  </Typography>
                </FormSubtitlePaper>
                <Grid container spacing={1} sx={{ p: 1 }}>
                  <Grid container item xs={12} sm={6}>
                    <Grid item xs={6}>
                      <Typography component="div" align="left">
                        Payment Date
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography component="div" align="right">
                        {paymentDateText}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container item xs={12} sm={6}>
                    <Grid item xs={6}>
                      <Typography component="div" align="left">
                        Payment Method
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      {contract?.buyerAdditionalDetails?.paymentCardLast4 !== null && (
                        <Typography component="div" align="right">
                          {contract?.buyerAdditionalDetails?.paymentCardBrand} ending in{' '}
                          {contract?.buyerAdditionalDetails?.paymentCardLast4}
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            )}
            {contract?.viewType === ContractViewType.Sell && (
              <Paper variant="outlined" sx={{ pb: 2 }}>
                <FormSubtitlePaper variant="outlined">
                  <Typography component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                    Payout Information
                  </Typography>
                </FormSubtitlePaper>
                <Grid container spacing={1} sx={{ p: 1 }}>
                  <Grid container item xs={12} sm={6}>
                    <Grid item xs={6}>
                      <Typography component="div" align="left">
                        Payout Status
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography component="div" align="right">
                        {getPayoutStatusText(contract)}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container item xs={12} sm={6}>
                    <Grid item xs={6}>
                      <Typography component="div" align="left">
                        Payout Amount
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography component="div" align="right">
                        {contract?.sellerAdditionalDetails?.payoutCurrency}{' '}
                        {contract?.sellerAdditionalDetails?.payoutAmount}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container item xs={12} sm={6}>
                    <Grid item xs={6}>
                      <Typography component="div" align="left">
                        Paid Out Date
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography component="div" align="right">
                        {dateStringFromDate(contract?.sellerAdditionalDetails?.paidOutDate)}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container item xs={12} sm={6}>
                    <Grid item xs={6}>
                      <Typography component="div" align="left">
                        Estimated Arrival Date
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography component="div" align="right">
                        {dateStringFromDate(contract?.sellerAdditionalDetails?.payoutArrivalDate)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            )}
          </Stack>
        </Box>
      </Container>
    </React.Fragment>
  );
}

export default ContractDetails;
