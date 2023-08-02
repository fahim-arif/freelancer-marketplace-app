import { ShouttTabs } from 'components/common/shouttTabs';
import { NetworkTabValue } from 'global/enums/networkEnums';
import { Dispatch } from 'react';

export const ViewNetworkTabs: React.FC<{
  tabValue: NetworkTabValue;
  setTabValue: Dispatch<NetworkTabValue>;
}> = ({ tabValue, setTabValue }) => (
  <ShouttTabs enumValues={NetworkTabValue} currentValue={tabValue} setValue={setTabValue} />
);
