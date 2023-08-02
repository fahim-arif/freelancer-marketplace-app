import { Close } from '@mui/icons-material';
import {
  Autocomplete,
  Button,
  FormControl,
  Grid,
  IconButton,
  TextField,
  Typography,
  styled,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useFormik } from 'formik';
import IApiError from 'global/interfaces/api';
import { IChatUserThread } from 'global/interfaces/chatThread';
import { IConnection } from 'global/interfaces/connection';
import { ITeamMember } from 'global/interfaces/teamMember';
import { useEffect, useState } from 'react';
import { addRecipient } from 'services/chatThreadService';
import { getActiveConnections } from 'services/connectionService';
import { showUIError } from 'utils/errorHandler';
import { object, string } from 'yup';
import { StyledDrawerGrid, StyledSwipeableDrawer } from './drawerStyles';
import { mapConnectionsToSelectItems } from 'utils/connectionUtils';

interface AddMemberDrawerProps {
  open: boolean;
  setOpen: React.Dispatch<boolean>;
  selectedThread: IChatUserThread | undefined;
}

const StyledTypography = styled(Typography)(() => ({
  overflowWrap: 'break-word',
}));

const StyledGrid = styled(Grid)(() => ({
  marginTop: '16px',
}));

export const AddMemberDrawer: React.FC<AddMemberDrawerProps> = ({ setOpen, open, selectedThread }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const form = useFormik<ITeamMember>({
    initialValues: {
      recipientUserId: '',
      chatThreadId: selectedThread?.chatThreadId,
    },
    onSubmit: values => {
      addRecipient(values)
        .then(() => {
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

  useEffect(() => {
    form.setFieldValue('chatThreadId', selectedThread?.chatThreadId);
  }, [selectedThread]);

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
            <StyledTypography variant="h6" color={theme.palette.grey[900]}>
              Add people
            </StyledTypography>
            {isMobile && (
              <IconButton onClick={() => setOpen(false)}>
                <Close />
              </IconButton>
            )}
            <Grid item xs={12}>
              <Typography variant="caption" color="primary">
                #{selectedThread?.displayName}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <form onSubmit={form.handleSubmit}>
            <Grid container spacing={1}>
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
            </Grid>
            <StyledGrid item container justifyContent="flex-end">
              <Button variant="contained" type="submit">
                Add
              </Button>
            </StyledGrid>
          </form>
        </Grid>
      </StyledDrawerGrid>
    </StyledSwipeableDrawer>
  );
};
