import { Button, Chip, Divider, Grid, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material';
import { MessageIcon } from 'components/icon/MessageIcon';
import { ContractStatus, ContractViewType, IContract, StatusColourDictionary } from 'global/interfaces/contract';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dateStringFromDate } from 'utils/dateFormat';
import { styled } from '@mui/material/styles';
import { getContractStatusText, getPayoutStatusText } from 'utils/contractTextHelper';
import CloseIcon from '@mui/icons-material/Close';
import { UserRole } from 'global/enums/userRole';
import { cancelContract } from 'services/contractService';
import IApiError from 'global/interfaces/api';
import { showUIError } from 'utils/errorHandler';
import { AuthContext } from 'contexts/AuthContext';

const StyledGrid = styled(Grid)(() => ({
  marginTop: '14px',
}));

const StyledHeaderGrid = styled(Grid)(() => ({
  marginTop: '36px',
}));

const StyledIconButton = styled(IconButton)(() => ({
  padding: '3px',
}));

const StyledTypography = styled(Typography)(() => ({
  overflowWrap: 'break-word',
}));

const StyledTopGrid = styled(Grid)(() => ({
  marginTop: '8px',
}));

const StyledChip = styled(Chip)(() => ({
  padding: '0px, 7px, 0px, 7px',
}));

export const ContractDrawer: React.FC<{
  contract: IContract;
  setDrawer: React.Dispatch<boolean>;
  showMessageButon: boolean;
}> = ({ contract, setDrawer, showMessageButon }) => {
  const isBuyer = Boolean(contract.buyerAdditionalDetails);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.down('md'));
  const authContext = useContext(AuthContext);
  const hasAdminRole =
    authContext !== null && authContext.user && authContext.user.roles.indexOf(UserRole.Administrator) > -1;
  const [cancelOption, setCancelOption] = useState<boolean>(false);

  const handleCancelContract = () => {
    cancelContract(contract.contractId)
      .then(() => {
        setCancelOption(false);
        setDrawer(false);
      })
      .catch((err: IApiError) => {
        showUIError(err.message);
      });
  };

  return (
    <>
      {!cancelOption ? (
        <>
          <Grid container item xs={12}>
            <Grid item xs={10} md={6} sx={isMobileScreen ? { marginBottom: '16px' } : undefined}>
              <StyledTypography variant="h6" color={theme.palette.grey[900]}>
                {contract.name}
              </StyledTypography>
            </Grid>

            {isMobileScreen && (
              <Grid
                container
                item
                xs={2}
                justifyContent="flex-end"
                sx={isMobileScreen ? { marginBottom: '16px' } : undefined}
              >
                <StyledIconButton onClick={() => setDrawer(false)}>
                  <CloseIcon />
                </StyledIconButton>
              </Grid>
            )}

            {showMessageButon && (
              <Grid item xs={12} md={6}>
                <Button
                  variant="outlined"
                  color="info"
                  fullWidth
                  startIcon={<MessageIcon />}
                  onClick={() => navigate(`/WorkRoom/${contract.chatThreadId}`)}
                >
                  Message
                </Button>
              </Grid>
            )}

            <StyledGrid item xs={12}>
              <Divider />
            </StyledGrid>
          </Grid>

          <StyledGrid item xs={12}>
            <StyledTypography variant="h6" color={theme.palette.grey[900]}>
              Contract information
            </StyledTypography>
          </StyledGrid>

          <Grid container alignItems="center">
            <StyledTopGrid item xs={6}>
              <StyledTypography variant="body1" color={theme.palette.grey[900]}>
                Contract ID
              </StyledTypography>
            </StyledTopGrid>

            <StyledTopGrid item xs={6}>
              <StyledTypography variant="subtitle2" color={theme.palette.grey[900]}>
                {contract.contractId}
              </StyledTypography>
            </StyledTopGrid>
          </Grid>

          <Grid container alignItems="center">
            <Grid item xs={6}>
              <StyledTypography variant="body1" color={theme.palette.grey[900]}>
                Contract date
              </StyledTypography>
            </Grid>

            <Grid item xs={6}>
              <StyledTypography variant="subtitle2" color={theme.palette.grey[900]}>
                {dateStringFromDate(contract.createdDate)}
              </StyledTypography>
            </Grid>
          </Grid>

          <Grid container alignItems="center">
            <Grid item xs={6}>
              <StyledTypography variant="body1" color={theme.palette.grey[900]}>
                Contract status
              </StyledTypography>
            </Grid>

            <Grid item xs={6}>
              <StyledTypography variant="subtitle2" color={theme.palette.grey[900]}>
                <StyledChip
                  sx={contract.status === ContractStatus.Complete ? { color: '#ffff' } : undefined}
                  label={getContractStatusText(contract)}
                  color={StatusColourDictionary[contract.status]}
                />
              </StyledTypography>
            </Grid>
          </Grid>

          <Grid container alignItems="center">
            <Grid item xs={6}>
              <StyledTypography variant="body1" color={theme.palette.grey[900]}>
                {isBuyer ? 'Seller name' : 'Buyer name'}
              </StyledTypography>
            </Grid>

            <Grid item xs={6}>
              <StyledTypography variant="subtitle2">
                {isBuyer
                  ? contract.buyerAdditionalDetails?.sellerDisplayName
                  : contract.sellerAdditionalDetails?.buyerDisplayName}
              </StyledTypography>
            </Grid>
          </Grid>

          <Grid container alignItems="center">
            <Grid container alignItems="center">
              <Grid item xs={6}>
                <StyledTypography variant="body1" color={theme.palette.grey[900]}>
                  Completed date
                </StyledTypography>
              </Grid>

              <Grid item xs={6}>
                <StyledTypography variant="subtitle2" color={theme.palette.grey[900]}>
                  {contract.completedDate !== null ? dateStringFromDate(contract.completedDate) : 'N/A'}
                </StyledTypography>
              </Grid>
            </Grid>
          </Grid>

          <StyledHeaderGrid item xs={12}>
            <StyledTypography variant="h6" color={theme.palette.grey[900]}>
              Items
            </StyledTypography>
          </StyledHeaderGrid>

          <Grid container alignItems="center">
            <StyledTopGrid item xs={6}>
              <StyledTypography variant="body1" color={theme.palette.grey[900]}>
                {contract.name}
              </StyledTypography>
            </StyledTopGrid>

            <StyledTopGrid item xs={6}>
              <StyledTypography variant="subtitle2" color={theme.palette.grey[900]}>
                ${contract.displayAmount}
              </StyledTypography>
            </StyledTopGrid>
          </Grid>

          <Grid container alignItems="center">
            <Grid item xs={6}>
              <StyledTypography variant="body1" color={theme.palette.grey[900]}>
                Shoutt Service Fee
              </StyledTypography>
            </Grid>

            <Grid item xs={6}>
              {contract?.viewType === ContractViewType.Buy && (
                <StyledTypography variant="subtitle2" color={theme.palette.grey[900]}>
                  ${contract?.buyerAdditionalDetails?.buyerFee}
                </StyledTypography>
              )}
              {contract?.viewType === ContractViewType.Sell && (
                <StyledTypography variant="subtitle2" color={theme.palette.grey[900]}>
                  ${contract?.sellerAdditionalDetails?.sellerFee}
                </StyledTypography>
              )}
            </Grid>
          </Grid>

          {contract?.viewType === ContractViewType.Buy && (
            <Grid container alignItems="center">
              <Grid item xs={6}>
                <StyledTypography variant="body1" color={theme.palette.grey[900]}>
                  Contract total
                </StyledTypography>
              </Grid>
              <Grid item xs={6}>
                <StyledTypography variant="subtitle2" color={theme.palette.grey[900]}>
                  ${contract?.buyerAdditionalDetails?.totalBuyerAmount}
                </StyledTypography>
              </Grid>
            </Grid>
          )}

          {contract?.viewType === ContractViewType.Sell && (
            <Grid container alignItems="center">
              <Grid item xs={6}>
                <StyledTypography variant="body1" color={theme.palette.grey[900]}>
                  Total earnings
                </StyledTypography>
              </Grid>

              <Grid item xs={6}>
                <StyledTypography variant="subtitle2" color={theme.palette.grey[900]}>
                  ${contract?.sellerAdditionalDetails?.totalSellerEarnings}
                </StyledTypography>
              </Grid>
            </Grid>
          )}

          <StyledHeaderGrid item xs={12}>
            <StyledTypography variant="h6" color={theme.palette.grey[900]}>
              Payment Information
            </StyledTypography>
          </StyledHeaderGrid>

          <Grid container alignItems="center">
            <StyledTopGrid item xs={6}>
              <StyledTypography variant="body1" color={theme.palette.grey[900]}>
                Payment date:
              </StyledTypography>
            </StyledTopGrid>

            <StyledTopGrid item xs={6}>
              <StyledTypography variant="subtitle2" color={theme.palette.grey[900]}>
                {contract.paymentDate !== null ? dateStringFromDate(contract.paymentDate) : 'Not paid'}
              </StyledTypography>
            </StyledTopGrid>
          </Grid>

          {isBuyer && (
            <Grid container alignItems="center">
              <Grid item xs={6}>
                <StyledTypography variant="body1" color={theme.palette.grey[900]}>
                  Payment method:
                </StyledTypography>
              </Grid>
              <Grid item xs={6}>
                <StyledTypography variant="subtitle2" color={theme.palette.grey[900]}>
                  {contract?.buyerAdditionalDetails?.paymentCardBrand
                    ? `${contract?.buyerAdditionalDetails?.paymentCardBrand} ${contract?.buyerAdditionalDetails?.paymentCardLast4}`
                    : 'N/A'}
                </StyledTypography>
              </Grid>
            </Grid>
          )}

          {!isBuyer && (
            <>
              <StyledHeaderGrid item xs={12}>
                <StyledTypography variant="h6" color={theme.palette.grey[900]}>
                  Payout Information
                </StyledTypography>
              </StyledHeaderGrid>

              <Grid container alignItems="center">
                <StyledTopGrid item xs={6}>
                  <StyledTypography variant="body1" color={theme.palette.grey[900]}>
                    Payout Status
                  </StyledTypography>
                </StyledTopGrid>

                <StyledTopGrid item xs={6}>
                  <StyledTypography variant="subtitle2" color={theme.palette.grey[900]}>
                    {getPayoutStatusText(contract)}
                  </StyledTypography>
                </StyledTopGrid>
              </Grid>

              <Grid container alignItems="center">
                <Grid item xs={6}>
                  <StyledTypography variant="body1" color={theme.palette.grey[900]}>
                    Payout Amount
                  </StyledTypography>
                </Grid>

                <Grid item xs={6}>
                  <StyledTypography variant="subtitle2" color={theme.palette.grey[900]}>
                    {contract?.sellerAdditionalDetails?.payoutAmount !== null
                      ? `${contract?.sellerAdditionalDetails?.payoutCurrency} ${contract?.sellerAdditionalDetails?.payoutAmount}`
                      : 'N/A'}
                  </StyledTypography>
                </Grid>
              </Grid>

              <Grid container alignItems="center">
                <Grid item xs={6}>
                  <StyledTypography variant="body1" color={theme.palette.grey[900]}>
                    Paid out date
                  </StyledTypography>
                </Grid>

                <Grid item xs={6}>
                  <StyledTypography variant="subtitle2" color={theme.palette.grey[900]}>
                    {contract.sellerAdditionalDetails?.paidOutDate !== null
                      ? dateStringFromDate(contract.sellerAdditionalDetails?.paidOutDate)
                      : 'Not paid out'}
                  </StyledTypography>
                </Grid>
              </Grid>

              <Grid container alignItems="center">
                <Grid item xs={6}>
                  <StyledTypography variant="body1" color={theme.palette.grey[900]}>
                    Estimated Arrival Date
                  </StyledTypography>
                </Grid>

                <Grid item xs={6}>
                  <StyledTypography variant="subtitle2" color={theme.palette.grey[900]}>
                    {contract?.sellerAdditionalDetails?.payoutArrivalDate !== null
                      ? dateStringFromDate(contract?.sellerAdditionalDetails?.payoutArrivalDate)
                      : 'N/A'}
                  </StyledTypography>
                </Grid>
              </Grid>
            </>
          )}

          {(contract?.status === ContractStatus.Created || hasAdminRole) && (
            <StyledGrid item container xs={12}>
              <Button color="error" fullWidth variant="contained" onClick={() => setCancelOption(true)}>
                Cancel contract
              </Button>
            </StyledGrid>
          )}
        </>
      ) : (
        <StyledGrid item container>
          <Grid item xs={12}>
            <StyledTypography variant="h6" color={theme.palette.grey[900]}>
              Cancel contract
            </StyledTypography>
          </Grid>
          <Typography variant="subtitle1">Are you sure you want to cancel this contract?</Typography>
          <StyledGrid container>
            <Button variant="contained" color="error" onClick={() => handleCancelContract()}>
              Yes
            </Button>
            <Button onClick={() => setCancelOption(false)}>No</Button>
          </StyledGrid>
        </StyledGrid>
      )}
    </>
  );
};
