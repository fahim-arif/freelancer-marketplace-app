import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Container from '@mui/material/Container';
import FormGroup from '@mui/material/FormGroup';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { showUIError } from 'utils/errorHandler';
import IApiError from 'global/interfaces/api';
import useProgressBar from 'global/hooks/useProgressBar';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext, AuthType } from 'contexts/AuthContext';
import { loginWithResetToken } from 'services/authService';

function ResetPassword(): JSX.Element {
  React.useEffect(() => {
    document.title = 'Reset Password';
  }, []);

  const authContext = React.useContext(AuthContext) as AuthType;
  const [progress, showProgress, successRedirect] = useProgressBar();
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleClickHome = (): void => {
    navigate('/');
  };

  useEffect(() => {
    if (authContext.loggedIn) {
      navigate('/ChangePassword');
      return;
    }
    const token: string | null = searchParams.get('token');

    if (token === null || token === '') {
      setIsLoading(false);
      return;
    }

    showProgress();

    loginWithResetToken(token)
      .then(() => {
        successRedirect('/ChangePassword', false);
        authContext.refresh();
        setIsLoading(false);
      })
      .catch((err: IApiError) => {
        if (err.status !== 404) {
          showUIError(err.message);
        }
        setIsLoading(false);
      })
      .finally(() => {
        showProgress(false);
      });
  }, [authContext.loggedIn]);

  return (
    <section>
      <Container maxWidth="sm">
        <form className="form-paper">
          <Typography variant="h4" component="div" align="center" sx={{ flexGrow: 1, mb: 2 }}>
            Reset Password
          </Typography>
          {!isLoading && (
            <React.Fragment>
              <Grid container spacing={0}>
                <Grid item xs={12}>
                  <FormGroup>
                    <FormControl sx={{ m: 1 }} variant="standard">
                      <Typography component="div">
                        Reset password link is invalid or expired. Please request a new reset link
                      </Typography>
                    </FormControl>
                  </FormGroup>
                </Grid>
              </Grid>
              <Grid container spacing={1} justifyContent="center" sx={{ mt: 1, mb: 1 }}>
                <Grid item xs={6} sm={4}>
                  <FormGroup>
                    <Button type="button" onClick={handleClickHome} variant="contained" size="large">
                      Back to home
                    </Button>
                  </FormGroup>
                </Grid>
              </Grid>
            </React.Fragment>
          )}
        </form>
      </Container>
      {progress}
    </section>
  );
}

export default ResetPassword;
