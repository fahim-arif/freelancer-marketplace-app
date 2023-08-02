import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import React, { useEffect } from 'react';
import { getPayout, createOnBoardingUrl } from 'services/payoutService';
import { IStripeConnect, StripePayoutType } from 'global/interfaces/payout';
import IApiError from 'global/interfaces/api';
import { Tooltip } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import WarningOutlinedIcon from '@mui/icons-material/WarningOutlined';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import { showUIError } from 'utils/errorHandler';
import LoadingButton from '@mui/lab/LoadingButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import ReportIcon from '@mui/icons-material/Report';
import { FormSubtitlePaper } from 'components/common/form/FormSubtitlePaper';

function PayoutDetails(): JSX.Element {
  React.useEffect(() => {
    document.title = 'Payout Details';
  }, []);

  const [loading, setLoading] = React.useState(false);

  const [stripeAccount, setStripeAccount] = React.useState<IStripeConnect>({
    ordersEnabled: false,
    payoutsEnabled: false,
    detailsSubmitted: false,
    moreInformationRequired: false,
    payoutMethods: [],
  });

  const retrivePayoutAndUpdateUI = (): void => {
    getPayout()
      .then((res: IStripeConnect) => {
        setStripeAccount(res);
      })
      .catch((err: IApiError) => {
        showUIError(err.message);
      });
  };

  useEffect(() => {
    retrivePayoutAndUpdateUI();
  }, []);

  const handleOnBoardClick = (): void => {
    setLoading(true);
    createOnBoardingUrl()
      .then((res: string) => {
        window.location.href = res;
        setLoading(false);
      })
      .catch((err: IApiError) => {
        setLoading(false);
        showUIError(err.message);
      });
  };

  return (
    <React.Fragment>
      <Container maxWidth="sm">
        <Box className="form-paper">
          <Typography variant="h4" component="div" align="center" sx={{ flexGrow: 1, mb: 2 }}>
            Payout Details
          </Typography>
          {stripeAccount.detailsSubmitted && (
            <Typography component="div" sx={{ mb: 2 }}>
              <Box component="span" sx={{ fontWeight: 'bold', pl: '10px' }}>
                Orders
              </Box>
              {stripeAccount.ordersEnabled && (
                <Tooltip
                  enterTouchDelay={0}
                  leaveTouchDelay={8000}
                  title="You are able to create orders for customers on your account."
                >
                  <IconButton>
                    <CheckCircleOutlinedIcon sx={{ color: 'green' }} />
                  </IconButton>
                </Tooltip>
              )}
              {!stripeAccount.ordersEnabled && (
                <Tooltip
                  enterTouchDelay={0}
                  leaveTouchDelay={8000}
                  title="You are not able to create orders. Please update your bank information."
                >
                  <IconButton>
                    <CancelOutlinedIcon sx={{ color: '#C70039' }} />
                  </IconButton>
                </Tooltip>
              )}
              <Box component="span" sx={{ fontWeight: 'bold', pl: '10px' }}>
                Payouts
              </Box>
              {stripeAccount.payoutsEnabled && (
                <Tooltip
                  enterTouchDelay={0}
                  leaveTouchDelay={8000}
                  title="You are able to receive payouts from Shoutt."
                >
                  <IconButton>
                    <CheckCircleOutlinedIcon sx={{ color: 'green' }} />
                  </IconButton>
                </Tooltip>
              )}
              {!stripeAccount.payoutsEnabled && (
                <Tooltip
                  enterTouchDelay={0}
                  leaveTouchDelay={8000}
                  title="You are not able to receive payouts. Please update your bank information."
                >
                  <IconButton>
                    <CancelOutlinedIcon sx={{ color: '#C70039' }} />
                  </IconButton>
                </Tooltip>
              )}
              {stripeAccount.ordersEnabled && stripeAccount.payoutsEnabled && stripeAccount.moreInformationRequired && (
                <Tooltip
                  enterTouchDelay={0}
                  leaveTouchDelay={8000}
                  title="Stripe Requires more information. Please update your account to avoid payouts being disabled in the future."
                >
                  <IconButton>
                    <WarningOutlinedIcon sx={{ color: '#FF9633' }} />
                  </IconButton>
                </Tooltip>
              )}
            </Typography>
          )}
          <Stack direction="column" spacing={{ xs: 1, sm: 1, md: 2 }} sx={{ pb: 3 }}>
            <Paper variant="outlined">
              <FormSubtitlePaper variant="outlined">
                <Typography component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                  Bank Information
                </Typography>
              </FormSubtitlePaper>
              <Grid container spacing={0} sx={{ p: 1 }}>
                {!stripeAccount.detailsSubmitted && (
                  <React.Fragment>
                    <Grid container spacing={0} sx={{ p: 1 }}>
                      <Grid item xs={12}>
                        <LoadingButton onClick={handleOnBoardClick} loading={loading} variant="outlined">
                          Complete Stripe OnBoarding
                        </LoadingButton>
                      </Grid>
                    </Grid>
                  </React.Fragment>
                )}
                {stripeAccount.detailsSubmitted && (
                  <React.Fragment>
                    <Grid container spacing={0} sx={{ p: 1 }}>
                      <Grid item xs={12}>
                        <LoadingButton onClick={handleOnBoardClick} loading={loading} variant="outlined">
                          Update Account
                        </LoadingButton>
                      </Grid>
                      <Grid item xs={12}>
                        {stripeAccount.payoutsEnabled && (
                          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                            {stripeAccount.payoutMethods.map((method, index) => (
                              <ListItem sx={{ pl: 0 }} key={index}>
                                <ListItemAvatar>
                                  <Avatar>
                                    {method.type === StripePayoutType.BankAccount && <AccountBalanceIcon />}
                                    {method.type === StripePayoutType.Card && <CreditCardIcon />}
                                  </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={method.name} secondary={'****' + method.last4} />
                              </ListItem>
                            ))}
                          </List>
                        )}
                        {!stripeAccount.payoutsEnabled && (
                          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                            <ListItem sx={{ pl: 0 }} key={0}>
                              <ListItemAvatar>
                                <Avatar>
                                  <ReportIcon />
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText primary="Payouts Not Enabled" secondary="Please update Stripe Account" />
                            </ListItem>
                          </List>
                        )}
                      </Grid>
                    </Grid>
                  </React.Fragment>
                )}
              </Grid>
            </Paper>
          </Stack>
        </Box>
      </Container>
    </React.Fragment>
  );
}

export default PayoutDetails;
