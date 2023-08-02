import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { AuthContext, AuthType } from 'contexts/AuthContext';
import * as React from 'react';
import { login } from 'services/authService';
import { WelcomeGraphicContainer } from 'components/common/WelcomeGraphicContainer';
import { FormHelperText, styled, useMediaQuery, useTheme } from '@mui/material';

const StyledForm = styled('form')`
  padding-left: 24px;
  padding-right: 24px;
  max-width: 500px;
`;

const StyledForgotButton = styled(Button)(({ theme }) => ({
  color: theme.palette.primary[600],
  marginLeft: '-16px',
  marginTop: '16px',
}));

function Login(): JSX.Element {
  React.useEffect(() => {
    document.title = 'Login';
  }, []);

  const authContext = React.useContext(AuthContext) as AuthType;
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [showError, setShowError] = React.useState<boolean>(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleLoginFormSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    login(email, password)
      .then(() => {
        setShowError(false);
        authContext.refresh();
        navigate('/');
      })
      .catch(() => {
        setShowError(true);
      });
  };

  return (
    <section>
      <WelcomeGraphicContainer>
        <StyledForm onSubmit={handleLoginFormSubmit}>
          <Typography variant={isMobile ? 'h5' : 'h4'} color={theme.palette.grey[900]}>
            Login
          </Typography>
          <Grid container spacing={3} marginTop={3}>
            <Grid item xs={12}>
              <FormGroup>
                <FormControl variant="standard">
                  <TextField
                    label="Email"
                    variant="outlined"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </FormControl>
              </FormGroup>
            </Grid>
            <Grid item xs={12}>
              <FormGroup>
                <FormControl variant="standard">
                  <TextField
                    label="Password"
                    variant="outlined"
                    type="password"
                    onChange={e => setPassword(e.target.value)}
                  />
                </FormControl>
              </FormGroup>
              <StyledForgotButton size="medium" variant="text" onClick={() => navigate('/ForgotPassword')}>
                Forgot your password?
              </StyledForgotButton>
            </Grid>

            {showError && (
              <Grid item xs={12}>
                <FormHelperText error>Email address or password is incorrect</FormHelperText>{' '}
              </Grid>
            )}
          </Grid>
          <Grid container marginTop={4} justifyContent="center">
            <Grid item xs={12}>
              <Button variant="contained" type="submit" size="large" fullWidth>
                Login
              </Button>
            </Grid>
          </Grid>
          <Grid container marginTop={4} justifyContent="center">
            <Grid item xs={12}>
              <Button color="inherit" size="large" variant="text" fullWidth onClick={() => navigate('/SignUp')}>
                New customer? Sign up here
              </Button>
            </Grid>
          </Grid>
        </StyledForm>
      </WelcomeGraphicContainer>
    </section>
  );
}

export default Login;
