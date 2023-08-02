import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { useFormik } from 'formik';
import { showUIError } from 'utils/errorHandler';
import IApiError from 'global/interfaces/api';
import { object, string } from 'yup';
import * as React from 'react';
import { resetPassword } from 'services/authService';
import { Box, Button, IconButton, styled, useMediaQuery, useTheme } from '@mui/material';
import { WelcomeGraphicContainer } from 'components/common/WelcomeGraphicContainer';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const StyledForm = styled('form')`
  padding-left: 24px;
  padding-right: 24px;
  max-width: 500px;
  min-width: 350px;
  width: 100%;
`;

const StyledMailOutlineIcon = styled(MailOutlineIcon)(({ theme }) => ({
  width: '48px',
  height: '48px',
  marginLeft: '-5px',
  color: theme.palette.primary[500],
}));

const StyledArrowIcon = styled(ArrowBackIcon)(({ theme }) => ({
  width: '24px',
  height: '24px',
  color: theme.palette.grey[900],
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: theme.palette.grey[300],
  borderRadius: '4px',
}));

const StyledHomeButton = styled(Button)(({ theme }) => ({
  color: theme.palette.primary[600],
  marginLeft: '-16px',
}));

function ForgotPassword(): JSX.Element {
  React.useEffect(() => {
    document.title = 'Forgot Password';
  }, []);

  const theme = useTheme();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [submitted, setSubmitted] = React.useState<boolean>(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const form = useFormik<{ email: string }>({
    initialValues: {
      email: '',
    },
    validationSchema: object({
      email: string()
        .required('Email is required')
        .max(150, 'Maximum of 150 characters allowed')
        .email('Invalid email address'),
    }),
    onSubmit: (values: { email: string }) => {
      setLoading(true);
      resetPassword(values)
        .then(() => {
          //successRedirect('/');
          setLoading(false);
          setSubmitted(true);
        })
        .catch((err: IApiError) => {
          //showProgress(false);
          setLoading(false);
          showUIError(err.message);
        });
    },
  });

  return (
    <section>
      <WelcomeGraphicContainer>
        <StyledForm onSubmit={form.handleSubmit}>
          {!submitted && (
            <>
              <StyledIconButton onClick={() => navigate('/Login')}>
                <StyledArrowIcon />
              </StyledIconButton>

              <Typography variant={isMobile ? 'h5' : 'h4'} color={theme.palette.grey[900]} marginTop={2}>
                Forgot Password
              </Typography>
              <Typography variant="body1" color={theme.palette.grey[500]} marginTop={2}>
                Please enter your registered email address.
              </Typography>
              <Grid container spacing={3} marginTop={1}>
                <Grid item xs={12}>
                  <FormGroup>
                    <FormControl variant="standard">
                      <TextField
                        name="email"
                        label="Email"
                        variant="outlined"
                        onChange={form.handleChange}
                        error={form.touched.email !== undefined && Boolean(form.errors.email)}
                        helperText={form.touched.email !== undefined ? form.errors.email : ''}
                      />
                    </FormControl>
                  </FormGroup>
                </Grid>
              </Grid>
              <Grid container marginTop={4} justifyContent="center">
                <Grid item xs={12}>
                  <LoadingButton type="submit" variant="contained" size="large" fullWidth loading={loading}>
                    Reset Password
                  </LoadingButton>
                </Grid>
              </Grid>
            </>
          )}
          {submitted && (
            <>
              <StyledMailOutlineIcon />
              <Typography variant={isMobile ? 'h5' : 'h4'} color={theme.palette.grey[900]} marginTop={1}>
                Check email
              </Typography>
              <Typography variant="body1" color={theme.palette.grey[500]} marginTop={2}>
                You will receive a password reset link shortly if your account exits. Please note that the link expires
                in 30 minutes.
              </Typography>
              <Box marginTop={2}>
                <StyledHomeButton size="medium" variant="text" onClick={() => navigate('/')}>
                  Return to home page
                </StyledHomeButton>
              </Box>
            </>
          )}
        </StyledForm>
      </WelcomeGraphicContainer>
    </section>
  );
}

export default ForgotPassword;
