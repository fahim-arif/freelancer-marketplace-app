import { Button, Grid, Typography, styled, useTheme } from '@mui/material';
import React from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import HowItWorks1Image from 'assets/images/howitworks1.png';
import HowItWorks2Image from 'assets/images/howitworks2.png';
import HowItWorks3Image from 'assets/images/howitworks3.png';
import { AuthContext, AuthType } from 'contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface StyledGridProps {
  isMobile: boolean;
}
const StyledGrid = styled(Grid, {
  // Configure which props should be forwarded on DOM
  shouldForwardProp: prop => prop !== 'isMobile',
})<StyledGridProps>(({ isMobile }) => ({
  paddingLeft: isMobile ? '0px' : '12px',
  paddingRight: '0px',
}));

const StyledImagesGrid = styled(StyledGrid, {
  // Configure which props should be forwarded on DOM
})<StyledGridProps>(({ isMobile }) => ({
  marginTop: '4px',
  marginBottom: isMobile ? '64px' : '96px',
}));

const HowItWorksImg = styled('img')`
  width: 100%;
  object-fit: cover;
`;

export default function HowItWorks(): JSX.Element {
  const authContext = React.useContext(AuthContext) as AuthType;
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const handleSignUpClick = () => {
    navigate('/SignUp');
  };

  return (
    <React.Fragment>
      <StyledGrid container alignItems="center" justifyContent="space-between" isMobile={isMobile}>
        <Grid item xs={12} sm={9}>
          <Typography
            variant={isTablet ? (isMobile ? 'h5' : 'h4') : 'h3'}
            component="div"
            sx={{ color: theme.palette.grey[800] }}
          >
            How Shoutt works
          </Typography>
          <Typography
            variant="body1"
            component="div"
            sx={{ color: theme.palette.grey[600], marginTop: '16px', maxWidth: '578px' }}
          >
            Lorem ipsum dolor sit amet consectetur. Sodales blandit elementum eget viverra pulvinar faucibus dolor
            tortor. Neque ut.
          </Typography>
        </Grid>
        {!authContext.loggedIn && (
          <Grid
            container
            item
            xs={12}
            sm={3}
            justifyContent={isMobile ? 'flex-start' : 'flex-end'}
            sx={{ marginTop: isMobile ? '36px' : '0px' }}
          >
            <Button color="primary" size="medium" variant="contained" fullWidth={isMobile} onClick={handleSignUpClick}>
              Start with Shoutt
            </Button>
          </Grid>
        )}
      </StyledGrid>
      <StyledImagesGrid container alignItems="center" spacing={4} isMobile={isMobile}>
        <Grid item xs={12} sm={6} md={4}>
          <HowItWorksImg src={HowItWorks1Image} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <HowItWorksImg src={HowItWorks2Image} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <HowItWorksImg src={HowItWorks3Image} />
        </Grid>
      </StyledImagesGrid>
    </React.Fragment>
  );
}
