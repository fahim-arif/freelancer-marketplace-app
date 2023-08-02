import { CircularProgress, Grid } from '@mui/material';
import { IFrontUserBase } from 'global/interfaces/user';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { HorizontalUserCard } from './HorizontalUserCard';

interface IUserListProps {
  users: IFrontUserBase[];
  isLoading: boolean;
  onNextPage: () => void;
}

const triggerBeforeN = 5;

export const UserList = ({ users, isLoading, onNextPage }: IUserListProps) => {
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) {
      onNextPage();
    }
  }, [inView]);

  return (
    <Grid container margin={'auto'} maxWidth={'lg'} rowSpacing={3}>
      {users.map((user, i) => {
        const triggerInView = i === users.length - triggerBeforeN;
        return (
          <Grid item key={user.id} xs={12} ref={triggerInView ? ref : null}>
            <HorizontalUserCard user={user} />
          </Grid>
        );
      })}
      {isLoading && (
        <Grid item xs={12}>
          <CircularProgress />
        </Grid>
      )}
    </Grid>
  );
};
