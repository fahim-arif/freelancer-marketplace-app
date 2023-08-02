import { IChatMessageDisplay } from 'global/interfaces/chatMessage';
import * as React from 'react';
import Typography from '@mui/material/Typography';
import { IContractPaymentSecret, ContractPaymentSecretType, IContract } from 'global/interfaces/contract';
import { getContract, getContractPaymentSecret } from 'services/contractService';
import IApiError from 'global/interfaces/api';
import { showUIError } from 'utils/errorHandler';
import Box from '@mui/material/Box';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  styled,
} from '@mui/material';
import DoneAllOutlinedIcon from '@mui/icons-material/DoneAllOutlined';
import { ViewContractIcon } from 'components/icon/ViewContractIcon';
import { GreyButton } from './buttons';
import { SwipeableContractDrawer } from 'components/common/Contract/SwipeableContractDrawer';

interface IChatMessagePaymentProps extends IChatMessageDisplay {
  currentUserId?: string;
}

const StyledTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[700],
}));

const StyledButtonBox = styled(Box)(() => ({
  marginTop: '8px',
}));

const PaymentButton = styled(Button)(() => ({
  width: '165px',
}));

const ViewContractButton = styled(GreyButton)(() => ({
  width: '165px',
}));

export default function ChatMessagePayment(props: IChatMessagePaymentProps): JSX.Element {
  const [open, setOpen] = React.useState<boolean>(false);
  const [secret, setSecret] = React.useState<IContractPaymentSecret | undefined>(undefined);
  const [drawer, setDrawer] = React.useState<boolean>(false);
  const [contract, setContract] = React.useState<IContract>();
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleMakePaymentClick = (event: React.MouseEvent<HTMLElement>, contractId: string | undefined): void => {
    event.stopPropagation();
    event.preventDefault();
    getContractPaymentSecret(contractId ?? '')
      .then((res: IContractPaymentSecret) => {
        if (res.type === ContractPaymentSecretType.Url) {
          window.location.href = res.value;
        } else {
          setSecret(res);
          setOpen(true);
        }
      })
      .catch((err: IApiError) => {
        showUIError(err.message);
      });
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const viewContract = (contractId: string) => {
    setLoading(true);
    getContract(contractId)
      .then((res: IContract) => {
        setLoading(false);
        setContract(res);
        setDrawer(true);
      })
      .catch((err: IApiError) => {
        showUIError(err.message);
        setLoading(false);
      });
  };

  return (
    <React.Fragment>
      {props.contract?.buyerUserId !== props.currentUserId && (
        <StyledTypography variant="body2">
          Payment has been requested for the contract &quot;{props.contract?.name}&quot; for the amount of $
          {props.contract?.amount}.
        </StyledTypography>
      )}
      {props.contract?.buyerUserId === props.currentUserId && (
        <StyledTypography variant="body2">
          Proceed to make payment for the contract &quot;{props.contract?.name}&quot; for the amount of $
          {props.contract?.amount}.
        </StyledTypography>
      )}

      {props.contract?.buyerUserId === props.currentUserId && props.contract !== undefined && !props.actioned && (
        <React.Fragment>
          <StyledButtonBox>
            <Grid container direction="row" justifyContent="flex-start" alignItems="center" spacing={1}>
              <Grid item>
                <PaymentButton
                  variant="contained"
                  type="button"
                  onClick={e => handleMakePaymentClick(e, props.contract?.contractId)}
                  startIcon={<DoneAllOutlinedIcon />}
                >
                  Make Payment
                </PaymentButton>
              </Grid>
              <Grid item>
                <ViewContractButton
                  loading={loading}
                  variant="outlined"
                  type="button"
                  startIcon={loading ? undefined : <ViewContractIcon />}
                  onClick={() => viewContract(props.contract!.contractId)}
                >
                  View Contract
                </ViewContractButton>
              </Grid>
            </Grid>
          </StyledButtonBox>
          <Dialog open={open} onClose={handleClose} maxWidth="xs">
            {secret?.type === ContractPaymentSecretType.AlreadyPaid && (
              <React.Fragment>
                <DialogTitle>Already Paid</DialogTitle>
                <DialogContent>
                  <DialogContentText>{`You have already paid contract ${props.contract.name}`}</DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} autoFocus>
                    OK
                  </Button>
                </DialogActions>
              </React.Fragment>
            )}
            {secret?.type === ContractPaymentSecretType.Cancelled && (
              <React.Fragment>
                <DialogTitle>Cancelled</DialogTitle>
                <DialogContent>
                  <DialogContentText>{`Contract ${props.contract.name} has been cancelled and no longer requires Payment.`}</DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} autoFocus>
                    OK
                  </Button>
                </DialogActions>
              </React.Fragment>
            )}
          </Dialog>
          {contract && (
            <SwipeableContractDrawer
              contract={contract}
              drawer={drawer}
              setDrawer={setDrawer}
              showMessageButton={true}
            />
          )}
        </React.Fragment>
      )}
      {props.contract?.buyerUserId === props.currentUserId && props.actioned && (
        <p>
          <i>You have already made payment.</i>
        </p>
      )}
    </React.Fragment>
  );
}
