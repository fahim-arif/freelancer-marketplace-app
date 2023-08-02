import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Container from '@mui/material/Container';
import FormGroup from '@mui/material/FormGroup';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { useFormik } from 'formik';
import { showUIError } from 'utils/errorHandler';
import IApiError from 'global/interfaces/api';
import useProgressBar from 'global/hooks/useProgressBar';
import { useNavigate } from 'react-router-dom';
import { IChangePasswordForm } from 'global/interfaces/changePassword';
import { changePasswordValidation } from 'global/validations/changePassword';
import * as React from 'react';
import { changePassword } from 'services/authService';

function ChangePassword(): JSX.Element {
  React.useEffect(() => {
    document.title = 'Change Password';
  }, []);

  const [progress, showProgress, successRedirect] = useProgressBar();
  const navigate = useNavigate();

  const form = useFormik<IChangePasswordForm>({
    initialValues: {
      newPassword: '',
      confirmNewPassword: '',
    },
    validationSchema: changePasswordValidation,
    onSubmit: (values: IChangePasswordForm) => {
      showProgress();
      changePassword(values)
        .then((res: boolean) => {
          if (res) {
            successRedirect('/');
          }
        })
        .catch((err: IApiError) => {
          showProgress(false);
          showUIError(err.message);
        });
    },
  });

  const handelCancelClick = (): void => {
    navigate('/');
  };

  return (
    <section>
      <Container maxWidth="sm">
        <form className="form-paper" onSubmit={form.handleSubmit}>
          <Typography variant="h4" component="div" align="center" sx={{ flexGrow: 1, mb: 2 }}>
            Change Password
          </Typography>
          <Grid container spacing={0}>
            <Grid item xs={12}>
              <FormGroup>
                <FormControl sx={{ m: 1 }} variant="standard">
                  <TextField
                    name="newPassword"
                    label="New password"
                    variant="outlined"
                    type="password"
                    onChange={form.handleChange}
                    error={form.touched.newPassword !== undefined && Boolean(form.errors.newPassword)}
                    helperText={form.touched.newPassword !== undefined ? form.errors.newPassword : ''}
                  />
                </FormControl>
              </FormGroup>
            </Grid>
            <Grid item xs={12}>
              <FormGroup>
                <FormControl sx={{ m: 1 }} variant="standard">
                  <TextField
                    name="confirmNewPassword"
                    label="Confirm new password"
                    variant="outlined"
                    type="password"
                    onChange={form.handleChange}
                    error={form.touched.confirmNewPassword !== undefined && Boolean(form.errors.confirmNewPassword)}
                    helperText={form.touched.confirmNewPassword !== undefined ? form.errors.confirmNewPassword : ''}
                  />
                </FormControl>
              </FormGroup>
            </Grid>
          </Grid>
          <Box sx={{ m: 1 }}>
            <Grid container spacing={1} justifyContent="center">
              <Grid item xs={6} sm={3}>
                <FormGroup>
                  <Button variant="outlined" size="large" onClick={handelCancelClick} sx={{ mr: '4px' }}>
                    Cancel
                  </Button>
                </FormGroup>
              </Grid>
              <Grid item xs={6} sm={3}>
                <FormGroup>
                  <Button type="submit" variant="contained" size="large" sx={{ ml: '4px' }}>
                    Save
                  </Button>
                </FormGroup>
              </Grid>
            </Grid>
          </Box>
        </form>
      </Container>
      {progress}
    </section>
  );
}

export default ChangePassword;
