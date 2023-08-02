import { Grid, styled, useMediaQuery, useTheme } from '@mui/material';
import WelcomeImage from 'assets/images/welcomegraphic.jpg';

const WelcomeImageImg = styled('img')`
  width: 100%;
  object-fit: cover;
`;

interface ISignUpContainerProps {
  children: React.ReactNode;
}

export const WelcomeGraphicContainer: React.FC<ISignUpContainerProps> = props => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Grid container justifyContent="center" margin={'auto'} maxWidth={'lg'} marginTop={3} marginBottom={5}>
      {!isMobile && (
        <Grid item md={5}>
          <WelcomeImageImg src={WelcomeImage} />
        </Grid>
      )}
      <Grid item xs={12} md={7} container alignItems="center" justifyContent="center">
        {props.children}
      </Grid>
    </Grid>
  );
};
