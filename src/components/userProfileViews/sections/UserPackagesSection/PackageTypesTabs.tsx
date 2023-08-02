import { Typography } from '@mui/material';
import { StyledTab, StyledTabs } from 'components/common/StyledTabs/TabStyles';
import { PackageType } from 'global/enums/packageType';
import { IFrontUser } from 'global/interfaces/user';
import React from 'react';

export interface IPackageTypesTabsProps {
  tabValue: number;
  setTabValue: React.Dispatch<number>;
  tabIndexLength: number;
  user: IFrontUser;
}

export const PackageTypesTabs: React.FC<IPackageTypesTabsProps> = ({ tabValue, setTabValue, tabIndexLength, user }) => (
  <StyledTabs value={tabValue} onChange={(e, newValue: number) => setTabValue(newValue)}>
    <StyledTab
      value={PackageType.Loud}
      label={TabLabel('Loud', user.fixedPackages[PackageType.Loud].price?.toString() ?? '')}
    />
    {tabIndexLength > PackageType.Loud && (
      <StyledTab
        value={PackageType.Louder}
        label={TabLabel('Louder', user.fixedPackages[PackageType.Louder].price?.toString() ?? '')}
      />
    )}
    {tabIndexLength > PackageType.Louder && (
      <StyledTab
        value={PackageType.Loudest}
        label={TabLabel('Loudest', user.fixedPackages[PackageType.Loudest].price?.toString() ?? '')}
      />
    )}
  </StyledTabs>
);

const TabLabel = (firstLabel: string, secondLabel: string): JSX.Element => (
  <React.Fragment>
    <Typography variant="subtitle2">{firstLabel}</Typography>
    <Typography variant="subtitle2">${secondLabel}</Typography>
  </React.Fragment>
);
