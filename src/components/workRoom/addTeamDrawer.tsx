import { Close } from '@mui/icons-material';
import { StyledDrawerGrid, StyledGrid, StyledSwipeableDrawer } from './drawerStyles';
import { Button, FormControl, Grid, IconButton, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useFormik } from 'formik';
import { object, string } from 'yup';
import { createGroupThread } from 'services/chatThreadService';
import IApiError from 'global/interfaces/api';
import { showUIError } from 'utils/errorHandler';
import { IChatUserThread } from 'global/interfaces/chatThread';
import React from 'react';

interface AddTeamDrawerProps {
  open: boolean;
  setOpen: React.Dispatch<boolean>;
  setAddMemberDrawerOpen: React.Dispatch<boolean>;
  setTeamThread: React.Dispatch<React.SetStateAction<IChatUserThread[]>>;
  setSelectedThread: React.Dispatch<IChatUserThread>;
}

export const AddTeamDrawer: React.FC<AddTeamDrawerProps> = ({
  open,
  setOpen,
  setTeamThread,
  setSelectedThread,
  setAddMemberDrawerOpen,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const form = useFormik<{ name: string }>({
    initialValues: {
      name: '',
    },
    onSubmit: values => {
      createGroupThread(values.name)
        .then((res: IChatUserThread) => {
          setTeamThread(prevItems => [...prevItems, res]);
          setSelectedThread(res);
          setAddMemberDrawerOpen(true);
          setOpen(false);
          form.resetForm();
        })
        .catch((err: IApiError) => {
          showUIError(err.message);
        });
    },
    validationSchema: object({
      name: string().required('Enter the team name'),
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
        <Grid item xs={12} sx={{ marginBottom: '16px' }} container justifyContent="space-between">
          <Typography variant="h6" color={theme.palette.grey[900]}>
            Create team
          </Typography>
          {isMobile && (
            <IconButton onClick={() => setOpen(false)}>
              <Close />
            </IconButton>
          )}
        </Grid>
        <Grid item xs={12}>
          <form onSubmit={form.handleSubmit}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <TextField
                    name="name"
                    value={form.values.name}
                    onChange={form.handleChange}
                    error={form.touched.name && form.errors.name !== undefined}
                    helperText={form.touched.name && form.errors.name}
                    fullWidth
                    label="Enter a team name"
                  />
                </FormControl>
              </Grid>
            </Grid>
            <StyledGrid item container justifyContent="flex-end">
              <Button variant="contained" type="submit">
                Create
              </Button>
            </StyledGrid>
          </form>
        </Grid>
      </StyledDrawerGrid>
    </StyledSwipeableDrawer>
  );
};
