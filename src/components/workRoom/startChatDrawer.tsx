import {
  Autocomplete,
  Button,
  FormControl,
  Grid,
  IconButton,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { IChatUserThread } from 'global/interfaces/chatThread';
import { StyledDrawerGrid, StyledGrid, StyledSwipeableDrawer } from './drawerStyles';
import { Close } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { getActiveConnections } from 'services/connectionService';
import { IConnection } from 'global/interfaces/connection';
import IApiError from 'global/interfaces/api';
import { showUIError } from 'utils/errorHandler';
import { mapConnectionsToSelectItems } from 'utils/connectionUtils';
import { useFormik } from 'formik';
import { object, string } from 'yup';
import { newOneToOneThread } from 'services/chatThreadService';

interface StartChatDialogProps {
  open: boolean;
  setOpen: React.Dispatch<boolean>;
  setSelectedThread: React.Dispatch<IChatUserThread>;
}

export const StartChatDrawer: React.FC<StartChatDialogProps> = ({ open, setOpen, setSelectedThread }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [connections, setConnections] = useState<IConnection[]>();

  useEffect(() => {
    getActiveConnections()
      .then(res => {
        setConnections(res);
      })
      .catch((err: IApiError) => {
        showUIError(err.message);
      });
  }, []);

  const form = useFormik<{ recipientUserId: string }>({
    initialValues: {
      recipientUserId: '',
    },
    onSubmit: values => {
      newOneToOneThread(values.recipientUserId)
        .then(res => {
          setSelectedThread(res);
          form.resetForm();
          setOpen(false);
        })
        .catch((err: IApiError) => {
          if (err.status === 409) {
            form.setErrors({ recipientUserId: 'This user is already a member of this team' });
            return;
          }
          showUIError(err.message);
        });
    },
    validationSchema: object({
      recipientUserId: string().required('You must enter a member'),
    }),
  });

  return (
    <StyledSwipeableDrawer
      sx={{ width: '100%' }}
      anchor={isMobile ? 'bottom' : 'right'}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
    >
      <StyledDrawerGrid container>
        <Grid container item xs={12}>
          <Grid item xs={12} sx={{ marginBottom: '16px' }} container justifyContent="space-between">
            <Typography variant="h6" color={theme.palette.grey[900]}>
              Start chat
            </Typography>
            {isMobile && (
              <IconButton onClick={() => setOpen(false)}>
                <Close />
              </IconButton>
            )}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <form onSubmit={form.handleSubmit}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Autocomplete
                  disablePortal
                  onChange={(e, value) => form.setFieldValue('recipientUserId', value?.id)}
                  options={mapConnectionsToSelectItems(connections ?? [])}
                  renderInput={params => (
                    <TextField
                      {...params}
                      error={form.touched.recipientUserId && form.errors.recipientUserId !== undefined}
                      helperText={form.touched.recipientUserId && form.errors.recipientUserId}
                      fullWidth
                      label="Enter a connection"
                    />
                  )}
                  loading
                />
              </FormControl>
            </Grid>
            <StyledGrid item container justifyContent="flex-end">
              <Button variant="contained" type="submit">
                Create chat
              </Button>
            </StyledGrid>
          </form>
        </Grid>
      </StyledDrawerGrid>
    </StyledSwipeableDrawer>
  );
};
