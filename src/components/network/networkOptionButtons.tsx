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
import { Dispatch, useState } from 'react';
import { removeConnection } from 'services/connectionService';
import IApiError from 'global/interfaces/api';
import { showUIError } from 'utils/errorHandler';
import { IConnection } from 'global/interfaces/connection';
import { ContractStatus } from 'global/interfaces/contract';
import useProgressBar from 'global/hooks/useProgressBar';
import { useNavigate } from 'react-router-dom';
import { DeleteIcon } from 'components/icon/DeleteIcon';
import { MessageIcon } from 'components/icon/MessageIcon';

const StyledRemoveButton = styled(Button)(({ theme }) => ({
  borderColor: theme.palette.grey[300],
  color: theme.palette.grey[900],
  '&:hover': {
    borderColor: theme.palette.grey[300],
    backgroundColor: theme.palette.grey[100],
  },
}));

export const NetworkOptionButtons: React.FC<{ connection: IConnection | undefined; setRefresh: Dispatch<boolean> }> = ({
  connection,
  setRefresh,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  return (
    <>
      <Grid item xs={6} md={12} lg={6}>
        <StyledRemoveButton variant="outlined" fullWidth startIcon={<DeleteIcon />} onClick={() => setOpen(true)}>
          Remove
        </StyledRemoveButton>
      </Grid>
      <Grid item xs={6} md={12} lg={6}>
        <Button
          variant="outlined"
          fullWidth
          startIcon={<MessageIcon />}
          onClick={() => navigate(`/WorkRoom/${connection?.chatThreadId}/${connection?.otherUser?.userId}`)}
        >
          Message
        </Button>
      </Grid>
      {connection?.contract?.lastContractStatus === ContractStatus.InProgress ||
      connection?.contract?.lastContractStatus === ContractStatus.Disputed ? (
        <ExistingContractDialog open={open} setOpen={setOpen} />
      ) : (
        <RemoveConnectionDialog open={open} setOpen={setOpen} connection={connection} setRefresh={setRefresh} />
      )}
    </>
  );
};

interface DialogOpenProps {
  open: boolean;
  setOpen: Dispatch<boolean>;
}

const RemoveConnectionDialog: React.FC<
  {
    connection: IConnection | undefined;
    setRefresh: Dispatch<boolean>;
  } & DialogOpenProps
> = ({ open, setOpen, connection, setRefresh }) => {
  const [progress, showProgress] = useProgressBar();

  const handleRemoval = () => {
    if (connection !== undefined) {
      showProgress(true);
      removeConnection(connection.connectionId ?? '')
        .then(() => {
          setRefresh(true);
          showProgress(false);
        })
        .catch((err: IApiError) => showUIError(err.message));
    }
  };

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle>Remove this contact</DialogTitle>
      <DialogContent>
        <DialogContentText>
          By removing the connection you will no longer be able to work with this person. Are you sure you want to
          remove this connection?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)} variant="outlined">
          Cancel
        </Button>
        <Button type="submit" variant="contained" color="error" onClick={() => handleRemoval()}>
          Confirm
        </Button>
      </DialogActions>
      {progress}
    </Dialog>
  );
};

const ExistingContractDialog: React.FC<DialogOpenProps> = (props: DialogOpenProps) => (
  <Dialog open={props.open} fullWidth>
    <DialogTitle>Cannot remove this contact</DialogTitle>
    <DialogContent>
      <DialogContentText>
        This contact has an outstanding contract and deliverables in progress or in dispute and cannot be removed. If
        you need further assisstance, contact support
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={() => props.setOpen(false)} variant="outlined">
        Cancel
      </Button>
    </DialogActions>
  </Dialog>
);
