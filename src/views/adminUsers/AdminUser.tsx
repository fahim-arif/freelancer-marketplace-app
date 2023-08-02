import { Grid } from '@mui/material';
import { UserScreeningLinks } from 'components/adminUsers/UserScreeningLinks';
import { VettingManager } from 'components/adminUsers/VettingManager';
import ViewUserProfile from 'components/userProfileViews/UserProfile';
import { VettingStatus } from 'global/enums/vettingStatus';
import IApiError from 'global/interfaces/api';
import { IVettingChange, IVettingChangeView, IFrontUser, IUser } from 'global/interfaces/user';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { createUserVettingView, createVettingChange, getUser, getVettingChanges } from 'services/userService';
import { showUIError } from 'utils/errorHandler';

const mapUser = (user: IUser): IFrontUser => {
  const packagePrices: number[] = user.fixedPackages.flatMap(x => (x.price ? [x.price] : []));

  return {
    id: user.id ?? '',
    firstName: user.firstName,
    lastName: user.lastName,
    title: user.title ?? '',
    bio: user.bio ?? '',
    hourlyRate: user.hourlyRate ?? 0,
    country: user.country,
    isNew: false,
    skills: user.skills,
    languages: user.languages,
    mainCategory: user.mainCategory ?? '',
    secondCategory: user.secondCategory ?? '',
    portfolioFiles: user.portfolioFiles,
    workHistories: user.workHistories,
    fixedPackages: user.fixedPackages,
    packagesFrom: packagePrices.length > 0 ? Math.min.apply(null, packagePrices).toString() : '-',
    connectionCount: user.connectionCount ?? 0,
  };
};

export const AdminUser = () => {
  useEffect(() => {
    document.title = 'Admin - User';
  }, []);
  const { id } = useParams();
  const userId = id ?? '';

  const [user, setUser] = useState<IUser | null>(null);
  const [vettingChanges, setVettingChanges] = useState<IVettingChangeView[]>([]);

  useEffect(() => {
    getUser(id)
      .then((responseUser: IUser) => {
        setUser(responseUser);
      })
      .catch((err: IApiError) => {
        if (err.status !== 404) {
          showUIError(err.message);
        }
      });
    getVettingChanges(userId)
      .then((fetchedVettingChanges: IVettingChangeView[]) => {
        setVettingChanges(fetchedVettingChanges);
      })
      .catch((err: IApiError) => {
        if (err.status !== 404) {
          showUIError(err.message);
        }
      });
    createUserVettingView(userId);
  }, []);

  const addVettingChange = (vettingStatus: VettingStatus, comment?: string): void => {
    const vettingChange: IVettingChange = {
      status: vettingStatus,
      comment,
    };
    createVettingChange(userId, vettingChange)
      .then((newVettingChange: IVettingChangeView) => {
        setVettingChanges([...vettingChanges, newVettingChange]);
        setUser(currentUser =>
          currentUser == null
            ? null
            : { ...currentUser, vetting: { ...currentUser.vetting, status: newVettingChange.status } },
        );
      })
      .catch((err: IApiError) => {
        if (err.status !== 404) {
          showUIError(err.message);
        }
      });
  };

  const handleApprove = (): void => addVettingChange(VettingStatus.Approved);
  const handleFeedback = (comment: string): void => addVettingChange(VettingStatus.UpdatesRequired, comment);
  const handleReject = (): void => addVettingChange(VettingStatus.Rejected);

  if (user == null) {
    return <></>;
  }

  return (
    <Grid container margin={'auto'} maxWidth={'lg'} sx={{ py: 2 }}>
      <Grid item xs={12}>
        <VettingManager
          changes={vettingChanges}
          onApprove={handleApprove}
          onFeedback={handleFeedback}
          onReject={handleReject}
          vetting={user.vetting}
        />
      </Grid>
      <Grid item xs={12}>
        <UserScreeningLinks links={user.links} />
      </Grid>
      <Grid item xs={12}>
        <ViewUserProfile user={mapUser(user)} />
      </Grid>
    </Grid>
  );
};
