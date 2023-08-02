import { Grid, useMediaQuery, useTheme } from '@mui/material';
import { IFrontUser } from 'global/interfaces/user';
import { PackageType } from 'global/enums/packageType';
import { Dispatch } from 'react';
import { UserPackagesSection } from './UserPackagesSection';
import { BorderedBox } from '../../common/BorderedBox';

export interface IUserPackagesSectionWrapperProps {
  user: IFrontUser;
  handleDrawer?: () => void;
  tabValue: PackageType;
  setTabValue: Dispatch<PackageType>;
  hideTitle?: boolean;
  showBorder?: boolean;
}

export const UserPackagesSectionWrapper = ({
  user,
  tabValue,
  setTabValue,
  hideTitle,
  showBorder,
}: IUserPackagesSectionWrapperProps) => {
  const tabIndexLength = user.fixedPackages.length - 1;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <>
      <BorderedBox showBorder={!isMobile || (showBorder !== undefined && showBorder)}>
        <Grid container justifyContent="space-between" alignItems="center">
          <UserPackagesSection
            tabValue={tabValue}
            setTabValue={setTabValue}
            tabIndexLength={tabIndexLength}
            user={user}
            hideTitle={hideTitle}
          />
        </Grid>
      </BorderedBox>
    </>
  );
};
