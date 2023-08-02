import { ChatType, IChatUserThread } from 'global/interfaces/chatThread';
import * as React from 'react';
import { Grid, styled } from '@mui/material';
import { UserAuth } from 'contexts/AuthContext';
import { ShouttTabs } from 'components/common/shouttTabs';
import { WorkroomLeftMenuOptions } from 'global/enums/workroomLeftMenuOptions';
import { ActiveContracts } from './activeContracts';
import { TeamMembers } from './teamMembers';
import { IContractDisplay } from 'global/interfaces/contract';

const StyledGrid = styled(Grid)(() => ({
  marginLeft: '24px',
  marginRight: '24px',
}));

export interface IActiveContractsProps {
  selectedThread: IChatUserThread | undefined;
  user: UserAuth | null;
  handleMiddleClick: () => void;
  addMemberDrawerOpen: boolean;
  setAddMemberDrawerOpen: React.Dispatch<boolean>;
  setTeamThreads: React.Dispatch<React.SetStateAction<IChatUserThread[]>>;
  setSelectedThread: React.Dispatch<React.SetStateAction<IChatUserThread | undefined>>;
  contracts: IContractDisplay[];
}

export default function RightMenu(props: IActiveContractsProps): JSX.Element {
  const [rightMenuValue, setRightMenuValue] = React.useState(WorkroomLeftMenuOptions['Active Contracts']);

  React.useEffect(() => {
    if (
      props.addMemberDrawerOpen ||
      (rightMenuValue === WorkroomLeftMenuOptions.Members && props.selectedThread?.type === ChatType.Group)
    ) {
      setRightMenuValue(WorkroomLeftMenuOptions.Members);
    } else {
      setRightMenuValue(WorkroomLeftMenuOptions['Active Contracts']);
    }
  }, [props, props.selectedThread, props.addMemberDrawerOpen, rightMenuValue]);

  return (
    <React.Fragment>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ marginBottom: '16px' }}
        spacing={1}
      >
        {props.selectedThread?.type === ChatType.Group && (
          <StyledGrid item xs={12}>
            <ShouttTabs
              enumValues={WorkroomLeftMenuOptions}
              currentValue={rightMenuValue}
              setValue={setRightMenuValue}
            />
          </StyledGrid>
        )}
      </Grid>

      {rightMenuValue === WorkroomLeftMenuOptions['Active Contracts'] && <ActiveContracts {...props} />}
      {rightMenuValue === WorkroomLeftMenuOptions.Members && <TeamMembers {...props} />}
    </React.Fragment>
  );
}
