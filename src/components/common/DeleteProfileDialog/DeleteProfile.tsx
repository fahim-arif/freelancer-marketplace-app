import { SelectProps } from '@mui/material/Select';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { showUIError } from 'utils/errorHandler';
import IApiError from 'global/interfaces/api';
import useProgressBar from 'global/hooks/useProgressBar';
import { deleteUser } from 'services/userService';

interface IDeleteProfileDialogProps extends SelectProps {
  onClose: () => void;
  onLogout: () => void;
  open: boolean;
}

export default function DeleteProfileDialog(props: IDeleteProfileDialogProps): JSX.Element {
  const [progress, showProgress] = useProgressBar();

  const handleClose = (): void => {
    props.onClose();
  };

  const handleConfirm = (): void => {
    showProgress();
    deleteUser()
      .then(() => {
        props.onClose();
        // Use same logout protocol as for the rest of application
        props.onLogout();
      })
      .catch((err: IApiError) => {
        props.onClose();
        showUIError(err.message);
      })
      .finally(() => {
        showProgress(false);
      });
  };

  return (
    <Dialog
      open={props.open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>Delete Profile</DialogTitle>
      <DialogContent>
        <Typography variant="h5">Are you sure you want to delete your profile? This can not be reversed</Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="outlined" color="warning" onClick={handleConfirm} type="submit">
          OK
        </Button>
      </DialogActions>
      {progress}
    </Dialog>
  );
}
