import { Container, Grid, Skeleton } from '@mui/material';
import NoUsersIcon from 'components/common/StyledIcons/NoUsersIcon';
import UserSection from 'components/findUser/UserSection';
import { UserOrderingGroup } from 'global/enums/userOrderingGroup';
import IApiError from 'global/interfaces/api';
import { IFrontUserBase, IFrontUserFilters } from 'global/interfaces/user';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFrontUsers, updateUserViews } from 'services/userService';
import { showUIError } from 'utils/errorHandler';
import HowItWorks from 'components/findUser/HowItWorks';
import UserCategories from 'components/findUser/UserCategories';

const Home = () => {
  useEffect(() => {
    document.title = 'Shoutt';
  }, []);

  const [featuredUsers, setFeaturedUsers] = useState<IFrontUserBase[]>([]);
  const [topRatedUsers, setTopRatedUsers] = useState<IFrontUserBase[]>([]);
  const [newUsers, setNewUsers] = useState<IFrontUserBase[]>([]);
  const [isNewLoading, setIsNewLoading] = useState<boolean>(true);
  const [isFeaturedLoading, setIsFeaturedLoading] = useState<boolean>(true);
  const [isTopRatedLoading, setIsTopRatedLoading] = useState<boolean>(true);
  const viewedUsers = useRef<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => searchFreelancers(), []);

  // Get and set all freelancer sections with callbacks
  const searchFreelancers = (filters: IFrontUserFilters | null = null): void => {
    handleGetUserPromise(
      getFrontUsers,
      { ...filters, orderingGroup: UserOrderingGroup.Featured },
      setFeaturedUsers,
      setIsFeaturedLoading,
    );
    handleGetUserPromise(
      getFrontUsers,
      { ...filters, orderingGroup: UserOrderingGroup.TopRated },
      setTopRatedUsers,
      setIsTopRatedLoading,
    );
    handleGetUserPromise(
      getFrontUsers,
      { ...filters, orderingGroup: UserOrderingGroup.New },
      setNewUsers,
      setIsNewLoading,
    );
  };

  // Generic promise resolver for all sections
  const handleGetUserPromise = (
    fetch: (filters: IFrontUserFilters | null) => Promise<IFrontUserBase[]>,
    filters: IFrontUserFilters | null,
    callback: (value: React.SetStateAction<IFrontUserBase[]>) => void,
    stopLoading: (value: React.SetStateAction<boolean>) => void,
  ): void => {
    fetch(filters)
      .then((res: IFrontUserBase[]) => {
        callback(res);
      })
      .catch((err: IApiError) => {
        showUIError(err.message);
      })
      .finally(() => {
        stopLoading(false);
      });
  };

  const onListViewUsers = (userId: string): void => {
    const currentViewedUsers = viewedUsers.current;
    const isViewed = currentViewedUsers.includes(userId);
    if (!isViewed) {
      viewedUsers.current = [...new Set([...currentViewedUsers, userId])];
      updateUserViews([userId]);
    }
  };

  const onClickUserCard = (id: string): void => {
    navigate(`/users/${id}`);
  };

  return (
    <Container>
      <Grid container>
        <Grid item xs={12}>
          <UserCategories />
        </Grid>
        {isTopRatedLoading ? (
          <Grid item xs={12}>
            <Skeleton height={450} width={300}></Skeleton>
          </Grid>
        ) : (
          topRatedUsers.length > 0 && (
            <Grid item xs={12}>
              <UserSection
                title="Top Rated Freelancers"
                onClickUserCard={onClickUserCard}
                onListViewUsers={onListViewUsers}
                users={topRatedUsers}
              />
            </Grid>
          )
        )}
        <Grid item xs={12}>
          <HowItWorks />
        </Grid>
        {isFeaturedLoading ? (
          <Grid item xs={12}>
            <Skeleton height={450} width={300}></Skeleton>
          </Grid>
        ) : (
          featuredUsers.length > 0 && (
            <Grid item xs={12}>
              <UserSection
                title="Recommended Freelancers"
                onClickUserCard={onClickUserCard}
                onListViewUsers={onListViewUsers}
                users={featuredUsers}
              />
            </Grid>
          )
        )}

        {isNewLoading ? (
          <Grid item xs={12}>
            <Skeleton height={450} width={300}></Skeleton>
          </Grid>
        ) : (
          newUsers.length > 0 && (
            <Grid item xs={12}>
              <UserSection
                title="New Freelancers"
                onClickUserCard={onClickUserCard}
                onListViewUsers={onListViewUsers}
                users={newUsers}
              />
            </Grid>
          )
        )}

        {featuredUsers.length === 0 &&
          topRatedUsers.length === 0 &&
          newUsers.length === 0 &&
          !isNewLoading &&
          !isFeaturedLoading &&
          !isTopRatedLoading && <NoUsersIcon />}
      </Grid>
    </Container>
  );
};

export default Home;
