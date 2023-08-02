import {
  Button,
  FormControl,
  FormGroup,
  Grid,
  TextField,
  Typography,
  styled,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CountrySelect from 'components/common/Select/CountrySelect';
import { FormikProps } from 'formik';
import { ISignUpForm } from 'global/interfaces/signup';
import { useNavigate } from 'react-router-dom';
import { WelcomeGraphicContainer } from 'components/common/WelcomeGraphicContainer';

const StyledForm = styled('form')`
  padding-left: 24px;
  padding-right: 24px;
  max-width: 600px;
`;

export const SignupForm: React.FC<FormikProps<ISignUpForm>> = form => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleCountryChange = (event: React.SyntheticEvent, value: { label: string; code: string } | null): void => {
    form.setFieldValue('country', value?.code, true);
  };

  return (
    <WelcomeGraphicContainer>
      <StyledForm onSubmit={form.handleSubmit}>
        <Typography variant={isMobile ? 'h5' : 'h4'} color={theme.palette.grey[900]}>
          Enter Account Details
        </Typography>
        <Grid container spacing={3} marginTop={3}>
          <Grid item xs={12}>
            <FormGroup>
              <FormControl variant="standard">
                <TextField
                  name="email"
                  label="Email"
                  variant="outlined"
                  type="email"
                  onChange={form.handleChange}
                  error={form.touched.email !== undefined && Boolean(form.errors.email)}
                  helperText={form.touched.email !== undefined ? form.errors.email : ''}
                />
              </FormControl>
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormGroup>
              <FormControl variant="standard">
                <TextField
                  name="firstName"
                  label="First Name"
                  variant="outlined"
                  onChange={form.handleChange}
                  error={form.touched.firstName !== undefined && Boolean(form.errors.firstName)}
                  helperText={form.touched.firstName !== undefined ? form.errors.firstName : ''}
                />
              </FormControl>
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormGroup>
              <FormControl variant="standard">
                <TextField
                  name="lastName"
                  label="Last Name"
                  variant="outlined"
                  onChange={form.handleChange}
                  error={form.touched.lastName !== undefined && Boolean(form.errors.lastName)}
                  helperText={form.touched.lastName !== undefined ? form.errors.lastName : ''}
                />
              </FormControl>
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormGroup>
              <FormControl variant="standard">
                <TextField
                  name="city"
                  label="Town/City"
                  variant="outlined"
                  onChange={form.handleChange}
                  error={form.touched.city !== undefined && Boolean(form.errors.city)}
                  helperText={form.touched.city !== undefined ? form.errors.city : ''}
                />
              </FormControl>
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormGroup>
              <FormControl variant="standard">
                <CountrySelect
                  label="Country"
                  onChange={handleCountryChange}
                  value={form.values.country}
                  error={form.touched.country !== undefined && Boolean(form.errors.country)}
                  helperText={form.touched.country !== undefined ? form.errors.country : ''}
                />
              </FormControl>
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormGroup>
              <FormControl variant="standard">
                <TextField
                  name="password"
                  label="Password"
                  variant="outlined"
                  type="password"
                  onChange={form.handleChange}
                  error={form.touched.password !== undefined && Boolean(form.errors.password)}
                  helperText={form.touched.password !== undefined ? form.errors.password : ''}
                />
              </FormControl>
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormGroup>
              <FormControl variant="standard">
                <TextField
                  name="confirmPassword"
                  label="Confirm Password"
                  variant="outlined"
                  type="password"
                  onChange={form.handleChange}
                  error={form.touched.confirmPassword !== undefined && Boolean(form.errors.confirmPassword)}
                  helperText={form.touched.confirmPassword !== undefined ? form.errors.confirmPassword : ''}
                />
              </FormControl>
            </FormGroup>
          </Grid>
        </Grid>
        <Grid container spacing={3} marginTop={3}>
          <Grid item xs={6}>
            <FormGroup>
              <FormControl variant="standard">
                <Button variant="outlined" size="large" onClick={() => navigate('/SignUp')}>
                  Back
                </Button>
              </FormControl>
            </FormGroup>
          </Grid>
          <Grid item xs={6}>
            <FormGroup>
              <FormControl variant="standard">
                <Button variant="contained" size="large" type="submit">
                  Next
                </Button>
              </FormControl>
            </FormGroup>
          </Grid>
        </Grid>
      </StyledForm>
    </WelcomeGraphicContainer>
  );
};
