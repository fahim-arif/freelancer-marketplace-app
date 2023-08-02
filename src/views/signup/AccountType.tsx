import {
  Avatar,
  Button,
  FormHelperText,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
  styled,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { AccountSearchParam } from 'global/Constants/SearchParamConstants';
import { AccountTypeOptions } from 'global/enums/accountTypeOptions';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import PeopleIcon from '@mui/icons-material/People';
import ShopIcon from '@mui/icons-material/Shop';
import { WelcomeGraphicContainer } from 'components/common/WelcomeGraphicContainer';

export const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  border: `1px solid ${theme.palette.grey[200]}`,
  backgroundColor: theme.palette.common.white,
  padding: '16px',
  borderRadius: '4px',
  '&.Mui-selected': {
    border: `1px solid ${theme.palette.primary[500]}`,
    backgroundColor: '#F7F8FD',
  },
  '&.Mui-selected:hover': {
    border: `1px solid ${theme.palette.primary[600]}`,
    backgroundColor: '#F7F8FD',
  },
  '&:hover': {
    border: `1px solid ${theme.palette.primary[500]}`,
    backgroundColor: '#F7F8FD',
  },
}));

export const StyledList = styled(List)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  marginTop: '64px',
}));

export const StyledAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.primary[100],
  color: theme.palette.primary[500],
}));

const Subtitle = styled(Typography)`
  margin-top: ${({ theme }) => theme.spacing(1)};
  color: ${({ theme }) => theme.palette.grey[600]};
`;

export const AccountType: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [accountType, setAccountType] = useState<AccountTypeOptions | undefined>();
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  useEffect(() => {
    document.title = 'Shoutt - Choose an account type';
  }, []);

  const handleLoginClick = () => {
    navigate('/Login');
  };

  const handleNextClick = () => {
    setIsSubmitted(true);
    if (accountType !== undefined) {
      navigate(`/signup/details?${AccountSearchParam}=${accountType}`);
    }
  };

  const handleCancelClick = () => {
    navigate('/');
  };

  return (
    <WelcomeGraphicContainer>
      <Stack paddingLeft={1} paddingRight={1} direction="column" minWidth={350}>
        <Typography variant={isMobile ? 'h5' : 'h4'} color={theme.palette.grey[900]}>
          How would you like to get started?
        </Typography>
        <Subtitle variant="caption">
          Your Shoutt account allows you to buy and sell from one place. You can always change later.
        </Subtitle>
        <StyledList disablePadding>
          <ListItem disablePadding>
            <StyledListItemButton
              selected={accountType === AccountTypeOptions.Buyer}
              onClick={() => setAccountType(AccountTypeOptions.Buyer)}
            >
              <ListItemAvatar>
                <StyledAvatar>
                  <ShopIcon />
                </StyledAvatar>
              </ListItemAvatar>
              <ListItemText primary={<Typography variant="subtitle1">Buy services</Typography>} />
            </StyledListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <StyledListItemButton
              selected={accountType === AccountTypeOptions.Seller}
              onClick={() => setAccountType(AccountTypeOptions.Seller)}
            >
              <ListItemAvatar>
                <StyledAvatar>
                  <UploadFileIcon />
                </StyledAvatar>
              </ListItemAvatar>
              <ListItemText primary={<Typography variant="subtitle1">Sell services</Typography>} />
            </StyledListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <StyledListItemButton
              selected={accountType === AccountTypeOptions.ConnectOnly}
              onClick={() => setAccountType(AccountTypeOptions.ConnectOnly)}
            >
              <ListItemAvatar>
                <StyledAvatar>
                  <PeopleIcon />
                </StyledAvatar>
              </ListItemAvatar>
              <ListItemText primary={<Typography variant="subtitle1">I just want to connect with others</Typography>} />
            </StyledListItemButton>
          </ListItem>
        </StyledList>
        {isSubmitted && accountType === undefined && (
          <FormHelperText error sx={{ marginTop: 2 }}>
            Select an account type
          </FormHelperText>
        )}
        <Grid container marginTop={8} spacing={2}>
          <Grid item xs={6}>
            <Button variant="outlined" type="button" size="large" fullWidth onClick={handleCancelClick}>
              Cancel
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button variant="contained" type="button" size="large" fullWidth onClick={handleNextClick}>
              Next
            </Button>
          </Grid>
        </Grid>
        <Grid container marginTop={6} spacing={2} justifyContent="center">
          <Grid item xs={12}>
            <Button color="inherit" size="large" variant="text" fullWidth onClick={handleLoginClick}>
              Already have an account? Login
            </Button>
          </Grid>
        </Grid>
      </Stack>
    </WelcomeGraphicContainer>
  );
};
