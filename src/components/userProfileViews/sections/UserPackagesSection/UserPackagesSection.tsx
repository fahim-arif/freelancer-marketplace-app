import { Box, Grid, Typography, styled, useTheme } from '@mui/material';
import { PackageType } from 'global/enums/packageType';
import { IFixedPackage, IFrontUser } from 'global/interfaces/user';
import { PackageTypesTabs } from './PackageTypesTabs';
import { AccessTime } from '@mui/icons-material';
import { LicenseType } from 'global/enums/licenseTypes';
import { CheckMarkCircleIcon } from 'components/icon/CheckMarkCircleIcon';
import { RevisionsIcon } from 'components/icon/RevisionsIcon';
import { LicenseIcon } from 'components/icon/LicenseIcon';

const StyledCheckMarkCircleIcon = styled(CheckMarkCircleIcon)(({ theme }) => ({
  stroke: theme.palette.primary[600],
  strokeWidth: '1.5px',
  width: '20px',
  height: '20px',
  fill: 'none',
}));

const StyledAccessTime = styled(AccessTime)(({ theme }) => ({
  color: theme.palette.grey[600],
  width: '20px',
  height: '20px',
}));

const StyledRevisionsIcon = styled(RevisionsIcon)(({ theme }) => ({
  stroke: theme.palette.grey[600],
  strokeWidth: '1.5px',
  width: '20px',
  height: '20px',
  fill: 'none',
}));

const StyledLicenseIcon = styled(LicenseIcon)(({ theme }) => ({
  stroke: theme.palette.grey[600],
  strokeWidth: '1.5px',
  width: '20px',
  height: '20px',
  fill: 'none',
}));

const FlexBox = styled(Box)`
  display: flex;
  align-items: center;
`;

const SpacedBox = styled(FlexBox)`
  margin-top: 16px;
`;

const StyledTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[700],
  marginLeft: '16px',
}));

interface IUserPackagesSectionProps {
  tabValue: number;
  setTabValue: React.Dispatch<PackageType>;
  tabIndexLength: number;
  user: IFrontUser;
  hideTitle?: boolean;
}

export const UserPackagesSection = ({
  tabIndexLength,
  user,
  setTabValue,
  tabValue,
  hideTitle,
}: IUserPackagesSectionProps) => {
  const currentFixedPackage: IFixedPackage = user.fixedPackages[tabValue];
  const delivery: number = currentFixedPackage.deliveryMethods ?? 0;
  const theme = useTheme();

  return (
    <>
      {!hideTitle && (
        <Grid item xs={12} sx={{ mb: 2 }}>
          <Typography variant="h6" color={theme.palette.grey[900]}>
            Packages
          </Typography>
        </Grid>
      )}
      <Grid item xs={12}>
        <PackageTypesTabs tabValue={tabValue} setTabValue={setTabValue} tabIndexLength={tabIndexLength} user={user} />
      </Grid>
      <Grid item xs={12} sx={{ mt: 2 }}>
        <Typography variant="subtitle1" color={theme.palette.grey[900]}>
          What&apos;s included?
        </Typography>
      </Grid>
      <Grid item xs={12}>
        {currentFixedPackage.deliverables.map((p: string, index: number) => [
          <SpacedBox key={`${index}-primary`}>
            <StyledCheckMarkCircleIcon />
            <StyledTypography variant="subtitle2">{p}</StyledTypography>
          </SpacedBox>,
        ])}
      </Grid>
      <Grid item xs={12} sx={{ mt: 2 }}>
        <Typography variant="subtitle1" color={theme.palette.grey[900]}>
          Terms
        </Typography>
        <SpacedBox>
          <StyledAccessTime />
          <StyledTypography variant="subtitle2">{`${delivery} ${
            delivery > 1 ? 'days' : 'day'
          } delivery`}</StyledTypography>
        </SpacedBox>
        <SpacedBox>
          <StyledRevisionsIcon />
          <StyledTypography variant="subtitle2">Revisions: {currentFixedPackage.revisions}</StyledTypography>
        </SpacedBox>
        <SpacedBox>
          <StyledLicenseIcon />
          <StyledTypography variant="subtitle2">
            {' '}
            License:{' '}
            {currentFixedPackage.license !== LicenseType.Custom
              ? currentFixedPackage.license
              : currentFixedPackage.custom}
          </StyledTypography>
        </SpacedBox>
      </Grid>
    </>
  );
};
