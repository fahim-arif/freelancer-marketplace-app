import { Container, Grid, styled } from '@mui/material';
import ViewUserProfile from 'components/userProfileViews/UserProfile';
import IApiError from 'global/interfaces/api';
import { IFrontUser } from 'global/interfaces/user';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFrontUser } from 'services/userService';
import { showUIError } from 'utils/errorHandler';

export const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: '32px',
  [theme.breakpoints.down('md')]: {
    padding: `0 0`,
    marginTop: '0px',
  },
}));

export const ViewUser = () => {
  const urlParams = useParams();
  const [user, setUser] = useState<IFrontUser | null>(null);

  useEffect(() => {
    const { id } = urlParams;
    if (id !== undefined) {
      getFrontUser(id)
        .then((res: IFrontUser) => {
          setUser(res);
        })
        .catch((err: IApiError) => {
          showUIError(err.message);
        });
    }
  }, []);
  return (
    <StyledContainer maxWidth="lg">
      <Grid container>{user !== null && <ViewUserProfile user={user} />}</Grid>
    </StyledContainer>
  );
};
