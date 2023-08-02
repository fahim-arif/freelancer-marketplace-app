import { Grid } from '@mui/material';
import { UserList } from 'components/findUser/UserList';
import IApiError from 'global/interfaces/api';
import { IFrontUserBase, IFrontUserFilters } from 'global/interfaces/user';
import { useEffect, useState } from 'react';
import { getFrontUsers } from 'services/userService';
import { showUIError } from 'utils/errorHandler';
import { UserFilters } from 'components/findUser/UserFilters';

const pageSize = 30;

export const ViewUsers = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<IFrontUserBase[]>([]);
  const [filters, setFilters] = useState<IFrontUserFilters | null>(null);

  useEffect(() => {
    if (filters != null) {
      setLoading(true);
      getFrontUsers({ ...filters, pageSize })
        .then((retrievedUsers: IFrontUserBase[]) => {
          if (filters.pageNumber && filters.pageNumber > 1) {
            setUsers(currentUsers => [...currentUsers, ...retrievedUsers]);
          } else {
            setUsers([...retrievedUsers]);
          }
          setLoading(false);
        })
        .catch((err: IApiError) => {
          showUIError(err.message);
        });
    }
  }, [filters]);

  const handleFilterChange = (filters: IFrontUserFilters) => {
    setFilters({ ...filters, pageNumber: 1 });
  };

  const handleNextPage = () => {
    const pageNumber = filters?.pageNumber ?? 1;
    if (users.length === pageSize * pageNumber) {
      setFilters(currentFilters => ({ ...currentFilters, pageNumber: pageNumber + 1 }));
    }
  };

  return (
    <Grid container sx={{ p: 1 }} margin={'auto'} maxWidth={'lg'}>
      <Grid item xs={12}>
        <UserFilters onFilterChange={handleFilterChange} />
      </Grid>
      <Grid item xs={12} sx={{ mt: 1 }}>
        <UserList users={users} isLoading={loading} onNextPage={handleNextPage} />
      </Grid>
    </Grid>
  );
};
