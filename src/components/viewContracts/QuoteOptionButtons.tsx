import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  Stack,
  TableCell,
  TextField,
  Typography,
  styled,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { acceptConnectionRequest, rejectConnectionRequest } from 'services/connectionService';
import IApiError from 'global/interfaces/api';
import { showUIError } from 'utils/errorHandler';
import { Dispatch, useState } from 'react';
import { FormikProps, useFormik } from 'formik';
import { object, string } from 'yup';
import { nameof } from 'ts-simple-nameof';
import useProgressBar from 'global/hooks/useProgressBar';
import { useNavigate } from 'react-router-dom';
import CheckIcon from '@mui/icons-material/Check';

const StyledSuccessTypography = styled(Typography)(() => ({
  color: '#ffff',
}));

export const QuoteOptionButtons: React.FC<{
  connectionId: string | undefined;
  setRefresh: React.Dispatch<boolean>;
}> = ({ connectionId, setRefresh }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [progress, showProgress] = useProgressBar();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleCreatConnection = (id: string | undefined) => {
    if (id !== undefined) {
      showProgress(true);
      acceptConnectionRequest(id)
        .then(res => {
          showProgress(false);
          navigate(`/Workroom/${res.chatThreadId}`);
        })
        .catch((err: IApiError) => showUIError(err.message));
    }
  };

  const rejectInvitation = (id: string, reason: string) => {
    showProgress(true);
    rejectConnectionRequest(id, reason)
      .then(() => {
        setRefresh(true);
        showProgress(false);
        setOpen(false);
      })
      .catch((err: IApiError) => showUIError(err.message));
  };

  return (
    <>
      {!isMobileScreen ? (
        <>
          <TableCell>
            <Stack direction="row" spacing={1}>
              <Button color="success" variant="contained" fullWidth onClick={() => handleCreatConnection(connectionId)}>
                <StyledSuccessTypography variant="subtitle2">Accept & Respond</StyledSuccessTypography>
              </Button>
              <Button color="primary" variant="outlined" fullWidth onClick={() => setOpen(true)}>
                <Typography variant="subtitle2">Decline</Typography>
              </Button>
            </Stack>
          </TableCell>
        </>
      ) : (
        <Grid container spacing={1} justifyContent="space-between">
          <Grid item xs={6}>
            <Button
              color="success"
              variant="contained"
              fullWidth
              onClick={() => handleCreatConnection(connectionId)}
              endIcon={<CheckIcon sx={{ color: '#ffff' }} />}
            >
              <StyledSuccessTypography variant="subtitle2">Accept & Respond</StyledSuccessTypography>
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button color="info" variant="contained" fullWidth onClick={() => setOpen(true)}>
              Decline
            </Button>
          </Grid>
        </Grid>
      )}

      <RejectDialog
        open={open}
        setOpen={setOpen}
        confirmReject={rejectInvitation}
        id={connectionId}
        progress={progress}
      />

      {progress}
    </>
  );
};

interface ReasonFormProps {
  reason: string;
}

const RejectDialog: React.FC<{
  id: string | undefined;
  open: boolean;
  setOpen: Dispatch<boolean>;
  confirmReject: (id: string, reason: string) => void;
  progress: JSX.Element | undefined;
}> = ({ id, open, setOpen, confirmReject, progress }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleReject = (values: ReasonFormProps) => {
    if (id !== undefined) {
      confirmReject(id, values.reason);
    }
  };

  const reasonForm: FormikProps<ReasonFormProps> = useFormik<ReasonFormProps>({
    initialValues: {
      reason: '',
    },
    onSubmit: handleReject,
    validationSchema: object({
      reason: string().required('You must enter a reason for rejecting this invitation'),
    }),
  });

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullScreen={fullScreen} fullWidth>
      <DialogTitle>Reject this invitation</DialogTitle>
      <form onSubmit={reasonForm.handleSubmit}>
        <DialogContent>
          <DialogContentText>Are you sure you want to reject this invitation?</DialogContentText>
          <FormControl fullWidth>
            <TextField
              name={nameof<ReasonFormProps>(x => x.reason)}
              multiline
              rows={4}
              placeholder="Enter a reason for rejecting this invitation"
              value={reasonForm.values.reason}
              onChange={reasonForm.handleChange}
              error={reasonForm.touched.reason === true && Boolean(reasonForm.errors.reason)}
              helperText={reasonForm.touched.reason === true && reasonForm.errors.reason}
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="error">
            Confirm
          </Button>
        </DialogActions>
      </form>
      {progress}
    </Dialog>
  );
};
