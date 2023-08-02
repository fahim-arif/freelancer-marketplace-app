import { Divider, Grid, SwipeableDrawer, styled, useMediaQuery, useTheme } from '@mui/material';
import { FileType } from 'global/enums/fileTypes';
import { IFrontUser, IPortfolioFile } from 'global/interfaces/user';
import UserProfileHeadSection from './sections/UserProfileHeadSection/UserProfileHeadSection';
import UserFilesSection from './sections/UserFilesSection';
import UserHourlyRateSection from './sections/UserHourlyRateSection';
import UserPortfolioSection from './sections/UserPortfolioSection';
import { UserPackagesSectionWrapper } from './sections/UserPackagesSection/UserPackagesSectionWrapper';
import UserWorkHistorySection from './sections/UserWorkHistorySection';
import UserLanguagesSection from './sections/UserLanguagesSection';
import { useState } from 'react';
import { PackageType } from 'global/enums/packageType';
import { IFileMetadata } from 'global/interfaces/file';
import { UserRequestConnect } from './sections/UserConnectionSection/UserRequestConnect';
import { UserConnectionSection } from './sections/UserConnectionSection/UserConnectionSection';

interface IViewUserProfileProps {
  user: IFrontUser;
}

const StyledDivider = styled(Divider)(({ theme }) => ({
  marginTop: '32px',
  marginLeft: '24px',
  marginRight: '24px',
  backgroundColor: theme.palette.grey[200],
}));

export const ViewUserProfile = ({ user }: IViewUserProfileProps) => {
  const pdfFiles: IPortfolioFile[] | undefined = user?.portfolioFiles?.filter(x => x.type === FileType.Pdf);
  const imageVideoFiles: IFileMetadata[] | undefined = user?.portfolioFiles?.filter(
    x => x.type !== FileType.Pdf && x.isProcessed,
  );
  const [drawer, setDrawer] = useState<boolean>(false);
  const [requestSent, setRequestSent] = useState<boolean>(false);
  const [tabValue, setTabValue] = useState<PackageType>(PackageType.Loud);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Grid container columnSpacing={3} marginBottom={3}>
      <Grid item lg={8} md={7.5} sm={12}>
        <UserProfileHeadSection user={user} />
        <StyledDivider />
        {imageVideoFiles !== undefined && imageVideoFiles.length > 0 && (
          <UserPortfolioSection imageVideoFiles={imageVideoFiles} />
        )}
        {pdfFiles !== undefined && pdfFiles.length > 0 && <UserFilesSection pdfFiles={pdfFiles} />}
        {user.workHistories !== undefined && user.workHistories.length > 0 && (
          <UserWorkHistorySection workHistories={user.workHistories} />
        )}
      </Grid>

      <Grid item lg={4} md={4.5} sm={12}>
        {user.fixedPackages !== undefined && user.fixedPackages.length > 0 && (
          <UserPackagesSectionWrapper
            user={user}
            handleDrawer={() => {
              setDrawer(true);
            }}
            tabValue={tabValue}
            setTabValue={setTabValue}
          />
        )}
        <Grid container>
          {Boolean(user.hourlyRate) && (
            <Grid item xs={12}>
              <UserHourlyRateSection
                user={user}
                setDrawer={() => {
                  setDrawer(true);
                }}
              />
            </Grid>
          )}

          <Grid item xs={12}>
            <SwipeableDrawer
              anchor={isMobile ? 'bottom' : 'right'}
              open={drawer}
              onClose={() => setDrawer(false)}
              onOpen={() => setDrawer(true)}
              sx={{
                '& .MuiDrawer-paper': {
                  boxSizing: 'border-box',
                  width: '500px',
                  [theme.breakpoints.down('md')]: {
                    width: '100%',
                  },
                },
              }}
            >
              <UserRequestConnect
                user={user}
                closeCancel={() => setDrawer(false)}
                closeSuccess={() => setRequestSent(true)}
              />
            </SwipeableDrawer>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={12}>
            <UserLanguagesSection user={user} />
          </Grid>
        </Grid>
        <UserConnectionSection openConnectDrawer={() => setDrawer(true)} requestSent={requestSent} />
      </Grid>
    </Grid>
  );
};

export default ViewUserProfile;
