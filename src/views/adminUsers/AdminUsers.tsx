import IApiError from 'global/interfaces/api';
import { IUser, IVettingViewMessage } from 'global/interfaces/user';
import { useEffect, useState } from 'react';
import { getUsers } from 'services/userService';
import { showUIError } from 'utils/errorHandler';
import { AdminUserList } from 'components/adminUsers/AdminUserList';
import { Grid, useTheme, useMediaQuery, Box, SelectChangeEvent, FormControlLabel, Switch, styled } from '@mui/material';
import { VettingStatus } from 'global/enums/vettingStatus';
import FormSelect from 'components/common/Select/FormSelect';
import CategorySelect from 'components/common/Select/CategorySelect';
import { OrderDirection } from 'global/enums/orderDirection';
import { useCustomEventListener } from 'react-custom-events';
import { MessagePublisherEventType } from 'global/enums/messagePublisherEventType';

const StyledBox = styled(Box)`
  margin: ${({ theme }) => theme.spacing(4)} 0;
  width: 100%;
`;

export const AdminUsers = () => {
  useEffect(() => {
    document.title = 'Admin - Users';
  }, []);

  const [users, setUsers] = useState<IUser[]>([]);
  const [vettingStatus, setVettingStatus] = useState<VettingStatus>(VettingStatus.InProgress);
  const [category, setCategory] = useState<string>('');
  const [isSellingServices, setIsSellingServices] = useState<boolean>(true);
  const [orderDirection, setOrderDirection] = useState<OrderDirection>(OrderDirection.Ascending);
  const [orderBy, setOrderBy] = useState<string>('vetting.submittedOn');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleUserView = (vettingView: IVettingViewMessage) => {
    setUsers(currentUsers =>
      currentUsers.map(user => {
        if (user.id === vettingView.userId) {
          return { ...user, vetting: { ...user.vetting, viewedOn: vettingView.viewedOn } };
        }
        return user;
      }),
    );
  };

  useCustomEventListener(MessagePublisherEventType[MessagePublisherEventType.UserVettingView], handleUserView);

  useEffect(() => {
    const ordering = `${orderBy} ${orderDirection}`;
    getUsers({ vettingStatus, category, ordering, isSellingServices })
      .then((users: IUser[]) => {
        setUsers(users);
      })
      .catch((err: IApiError) => {
        if (err.status !== 404) {
          showUIError(err.message);
        }
      });
  }, [vettingStatus, category, orderBy, orderDirection, isSellingServices]);

  const vettingStatusItems = Object.values(VettingStatus).map(vs => ({ id: vs.toString(), label: vs.toString() }));
  const items = [{ id: '', label: 'None' }, ...vettingStatusItems];

  const handleVettingStatusChange = (e: SelectChangeEvent<unknown>): void =>
    setVettingStatus(VettingStatus[e.target.value as keyof typeof VettingStatus]);

  const handleCategoryChange = (e: SelectChangeEvent<unknown>): void => setCategory(e.target.value as string);

  const handleIsSellingServicesChange = (): void => setIsSellingServices(!isSellingServices);

  const handleRequestSort = (property: string): void => {
    const isAsc = orderBy === property && orderDirection === OrderDirection.Ascending;
    setOrderDirection(isAsc ? OrderDirection.Descending : OrderDirection.Ascending);
    setOrderBy(property);
  };

  return (
    <StyledBox
      sx={{
        paddingRight: isMobile ? 3 : 10,
        paddingLeft: isMobile ? 3 : 10,
      }}
    >
      <Grid container mb={1} spacing={1}>
        <Grid item xs={4} md={3} lg={2}>
          <FormSelect
            value={vettingStatus ?? ''}
            items={items}
            label="VetttingStatus"
            onChange={handleVettingStatusChange}
          />
        </Grid>
        <Grid item xs={4} md={4} lg={2}>
          <CategorySelect value={category} label="Main Category" onChange={handleCategoryChange} />
        </Grid>
        <Grid item container xs={4} md={3} lg={2} alignItems="center">
          <FormControlLabel
            control={
              <Switch onChange={handleIsSellingServicesChange} name="isSellingServices" checked={isSellingServices} />
            }
            label="Selling services"
          />
        </Grid>
      </Grid>
      <AdminUserList
        orderDirection={orderDirection}
        orderBy={orderBy}
        onRequestSort={handleRequestSort}
        users={users}
      />
    </StyledBox>
  );
};
