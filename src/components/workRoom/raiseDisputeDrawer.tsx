import { LoadingButton } from '@mui/lab';
import { Button, Drawer, Grid, Typography, styled, useTheme } from '@mui/material';
import { StyledDrawerGrid } from 'components/common/StyledDrawerGrid';
import IApiError from 'global/interfaces/api';
import { IContractDisplay } from 'global/interfaces/contract';
import { useState } from 'react';
import { raiseDispute } from 'services/contractService';
import { showUIError } from 'utils/errorHandler';

const StyledGrid = styled(Grid)(() => ({
  marginTop: '14px',
}));

export const RaiseDisputeDrawer: React.FC<{ contract: IContractDisplay; handleClose: () => void; open: boolean }> = ({
  contract,
  handleClose,
  open,
}) => {
  const theme = useTheme();
  const [loading, setLoading] = useState<boolean>(false);

  const handleRaiseDispute = () => {
    raiseDispute(contract.contractId)
      .then(() => {
        setLoading(false);
        handleClose();
      })
      .catch((err: IApiError) => {
        setLoading(false);
        showUIError(err.message);
      });
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <StyledDrawerGrid container>
        <Grid item xs={12}>
          <Typography variant="h6" color={theme.palette.grey[900]}>
            Raise dispute
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1">
            Are you sure you want to raise a dispute for this contract? Please try and resolve any issues with the
            buyer/seller in the first instance. A dispute should only be raised as a last resort.
          </Typography>
        </Grid>
        <StyledGrid container>
          <LoadingButton loading={loading} variant="contained" color="error" onClick={() => handleRaiseDispute()}>
            Yes
          </LoadingButton>
          <Button onClick={handleClose}>No</Button>
        </StyledGrid>
      </StyledDrawerGrid>
    </Drawer>
  );
};
