// import { Link, useNavigate } from 'react-router-dom'
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { WelcomeGraphicContainer } from 'components/common/WelcomeGraphicContainer';
import { CheckCircle } from '@mui/icons-material';
import { Box, Button, styled, useMediaQuery, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const StyledCheckCircleIcon = styled(CheckCircle)(({ theme }) => ({
  width: '48px',
  height: '48px',
  color: theme.palette.primary[500],
}));

const ContainerBox = styled(Box)(() => ({
  paddingLeft: '24px',
  paddingRight: '24px',
  maxWidth: '400px',
}));

const StyledHomeButton = styled(Button)(({ theme }) => ({
  color: theme.palette.primary[600],
  marginLeft: '-16px',
}));

function AccountConfirmation() {
  React.useEffect(() => {
    document.title = 'Account Created';
  }, []);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  return (
    <WelcomeGraphicContainer>
      <ContainerBox>
        <StyledCheckCircleIcon />
        <Typography variant={isMobile ? 'h5' : 'h4'} color={theme.palette.grey[900]} marginTop={1}>
          Account Created
        </Typography>
        <Typography variant="body1" color={theme.palette.grey[500]} marginTop={2}>
          Your account has been successfully created. You can now hire freelancers on Shoutt.
        </Typography>
        <Box marginTop={2}>
          <StyledHomeButton size="medium" variant="text" onClick={() => navigate('/')}>
            Return to home page
          </StyledHomeButton>
        </Box>
      </ContainerBox>
    </WelcomeGraphicContainer>
  );
}

export default AccountConfirmation;
