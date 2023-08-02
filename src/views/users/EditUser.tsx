import { Container, Grid, styled } from '@mui/material';
import { EditUserProfile } from 'components/userProfileEdits/EditUserProfile';
import IApiError from 'global/interfaces/api';
import { IUser } from 'global/interfaces/user';
import { useEffect, useState } from 'react';
import { getUser, upsertUser } from 'services/userService';
import { saveImage } from 'services/storageService';
import { showUIError } from 'utils/errorHandler';
import { getSkills } from 'services/skillService';

export const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: '32px',
  [theme.breakpoints.down('md')]: {
    padding: `0 0`,
    marginTop: '0px',
  },
}));

export const EditUser = () => {
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    getUser()
      .then((res: IUser) => {
        setUser(res);
      })
      .catch((err: IApiError) => {
        showUIError(err.message);
      });
  }, []);

  return (
    <StyledContainer maxWidth="lg">
      <Grid container>
        {user !== null && (
          <EditUserProfile user={user} saveImage={saveImage} getSkills={getSkills} upsertUser={upsertUser} />
        )}
      </Grid>
    </StyledContainer>
  );
};
