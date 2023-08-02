import { Box, Button, CircularProgress, Grid, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import { AuthContext, AuthType } from 'contexts/AuthContext';
import { FormikProps } from 'formik';
import { AccountSearchParam } from 'global/Constants/SearchParamConstants';
import { ISignUpForm } from 'global/interfaces/signup';
import { useState, useContext, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AccountTypeOptions } from 'global/enums/accountTypeOptions';
import { styled } from '@mui/material/styles';
import { WelcomeGraphicContainer } from 'components/common/WelcomeGraphicContainer';
import MailIcon from '@mui/icons-material/Mail';
import { createUser, validateEmailCode } from 'services/userService';

export interface AccountVerificationProps {
  form: FormikProps<ISignUpForm>;
  codeError: boolean;
  setCodeError: React.Dispatch<boolean>;
}

const StyledGrid = styled(Grid)(() => ({
  marginTop: '14px',
}));

interface MobileProps {
  isMobile: boolean;
}

const ContainerBox = styled(Box, {
  // Configure which props should be forwarded on DOM
  shouldForwardProp: prop => prop !== 'isMobile',
})<MobileProps>(({ isMobile }) => ({
  paddingLeft: isMobile ? '18px' : '24px',
  paddingRight: isMobile ? '18px' : '24px',
  maxWidth: '600px',
}));

const StyledTextField = styled(TextField, {
  // Configure which props should be forwarded on DOM
  shouldForwardProp: prop => prop !== 'isMobile',
})<MobileProps>(({ isMobile }) => ({
  width: isMobile ? '48px' : '50px',
}));

const StyledMailIcon = styled(MailIcon)(({ theme }) => ({
  width: '48px',
  height: '48px',
  color: theme.palette.primary[500],
}));

const StyledResetButton = styled(Button)(({ theme }) => ({
  color: theme.palette.primary[600],
  marginLeft: '-16px',
}));

export const AccountVerification = ({ form }: AccountVerificationProps) => {
  const [code, setCode] = useState<number[]>(new Array(6));
  const navigate = useNavigate();
  const authContext = useContext(AuthContext) as AuthType;
  const [error, setError] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState<boolean>(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const textfieldRefs: React.RefObject<HTMLInputElement>[] = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, index: number): void => {
    const oldValue = [...code];
    const isNotNum = isNaN(parseInt(e.target.value));

    if (oldValue.length === undefined || oldValue.length < index) {
      oldValue.push();
    }

    if (isNotNum || e.target.value === '') {
      oldValue[index] = -1;
      setCode(oldValue);
      return;
    }

    if (e.target.value.length === 6) {
      oldValue.forEach((x, i) => {
        oldValue[i] = parseInt(e.target.value[i]);
      });
    } else {
      oldValue[index] = +e.target.value;
      textfieldRefs[index + 1]?.current?.focus();
    }

    setCode(oldValue);

    checkCodeIsValid(oldValue);
  };

  const checkCodeIsValid = async (newCode: number[]): Promise<void> => {
    const validValues = newCode.filter(x => x !== -1 && x !== undefined);
    if (validValues.length >= 6) {
      const validCode = validValues.reduce((accum, digit) => accum * 10 + digit, 0);

      validateEmailCode(form.values.email, validCode)
        .then(isValid => setError(!isValid))
        .catch(() => setError(true));
    }
  };

  const handleSignUp = async (): Promise<void> => {
    const validValues = code.filter(x => x !== -1 && x !== undefined);
    if (validValues.length >= 6) {
      const validCode = validValues.reduce((accum, digit) => accum * 10 + digit, 0);

      const data = form.values;
      data.confirmationCode = validCode;

      setLoading(true);

      createUser(data)
        .then(() => {
          authContext.refresh();
          setLoading(false);
          if (searchParams.get(AccountSearchParam) !== AccountTypeOptions.Seller.toString()) {
            navigate('/confirmation');
            return;
          }
          navigate(`/users/${authContext.user?.id}/edit`);
        })
        .catch(() => {
          setError(true);
          setLoading(false);
        });
    }
  };

  //TODO - Need smaller padding on mobile screens, test iPhone SE
  return (
    <WelcomeGraphicContainer>
      <ContainerBox isMobile={isMobile}>
        <StyledMailIcon />
        <Typography variant={isMobile ? 'h5' : 'h4'} color={theme.palette.grey[900]} marginTop={1}>
          Verify your email address
        </Typography>
        <Typography variant="body1" color={theme.palette.grey[500]} marginTop={2}>
          We&apos;ve sent you a code to verify your email address. Check you spam folder if you cannot find it and add
          support@shoutt.co to your contacts.
        </Typography>

        <Grid container spacing={1} marginTop={2}>
          <Grid item>
            <StyledTextField
              inputProps={{ maxLength: 6 }}
              value={code[0] < 0 ? '' : code[0]}
              variant="outlined"
              onChange={e => handleChange(e, 0)}
              inputRef={textfieldRefs[0]}
              disabled={loading}
              isMobile={isMobile}
            />
          </Grid>
          <Grid item>
            <StyledTextField
              inputProps={{ maxLength: 6 }}
              value={code[1] < 0 ? '' : code[1]}
              variant="outlined"
              onChange={e => handleChange(e, 1)}
              inputRef={textfieldRefs[1]}
              disabled={loading}
              isMobile={isMobile}
            />
          </Grid>
          <Grid item>
            <StyledTextField
              inputProps={{ maxLength: 6 }}
              value={code[2] < 0 ? '' : code[2]}
              variant="outlined"
              onChange={e => handleChange(e, 2)}
              inputRef={textfieldRefs[2]}
              disabled={loading}
              isMobile={isMobile}
            />
          </Grid>
          <Grid item>
            <StyledTextField
              value={code[3] < 0 ? '' : code[3]}
              inputProps={{ maxLength: 6 }}
              variant="outlined"
              onChange={e => handleChange(e, 3)}
              inputRef={textfieldRefs[3]}
              disabled={loading}
              isMobile={isMobile}
            />
          </Grid>
          <Grid item>
            <StyledTextField
              value={code[4] < 0 ? '' : code[4]}
              variant="outlined"
              inputProps={{ maxLength: 6 }}
              onChange={e => handleChange(e, 4)}
              inputRef={textfieldRefs[4]}
              disabled={loading}
              isMobile={isMobile}
            />
          </Grid>
          <Grid item>
            <StyledTextField
              value={code[5] < 0 ? '' : code[5]}
              variant="outlined"
              inputProps={{ maxLength: 6 }}
              onChange={e => handleChange(e, 5)}
              inputRef={textfieldRefs[5]}
              disabled={loading}
              isMobile={isMobile}
            />
          </Grid>
        </Grid>
        {error && (
          <Grid container sx={{ marginTop: 2 }}>
            <Typography variant="subtitle2" color="error">
              Verification code does not match
            </Typography>
          </Grid>
        )}
        {loading && (
          <StyledGrid container justifyContent="center">
            <CircularProgress color="primary" />
          </StyledGrid>
        )}
        <Box marginTop={1}>
          <StyledResetButton size="medium" variant="text" onClick={() => form.handleSubmit()}>
            Resend code
          </StyledResetButton>
        </Box>
        <Box marginTop={2}>
          <Typography variant="caption" color={theme.palette.grey[500]}>
            By creating an account, you accept our Terms and Conditions and Privacy Policy.
          </Typography>
        </Box>
        <Box marginTop={3}>
          <Button variant="contained" size="large" type="submit" sx={{ width: '300px' }} onClick={handleSignUp}>
            Create Account
          </Button>
        </Box>
      </ContainerBox>
    </WelcomeGraphicContainer>
  );
};
