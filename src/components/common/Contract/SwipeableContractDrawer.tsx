import { Grid, Link, SwipeableDrawer, styled } from '@mui/material';
import { StyledDrawerGrid } from 'components/workRoom/drawerStyles';
import { ContractStatus, IContract } from 'global/interfaces/contract';
import { ContractDrawer } from './contractDrawer';
import { RaiseDisputeDrawer } from 'components/workRoom/raiseDisputeDrawer';
import React from 'react';

const StyledLink = styled(Link)(({ theme }) => ({
  fontSize: '13px',
  color: theme.palette.error['main'],
  textDecorationColor: theme.palette.error['main'],
}));

const StyledLinkGrid = styled(Grid)(() => ({
  marginTop: '15px',
}));

export const SwipeableContractDrawer: React.FC<{
  contract: IContract;
  drawer: boolean;
  setDrawer: React.Dispatch<boolean>;
  showMessageButton: boolean;
}> = ({ contract, drawer, setDrawer, showMessageButton }) => {
  const [disputeDrawer, setDisputeDrawer] = React.useState<boolean>(false);
  return (
    <SwipeableDrawer
      sx={{ width: '100%' }}
      anchor="right"
      open={drawer}
      onClose={() => setDrawer(false)}
      onOpen={() => setDrawer(true)}
    >
      <StyledDrawerGrid container justifyContent="space-between">
        <ContractDrawer contract={contract} setDrawer={setDrawer} showMessageButon={showMessageButton} />
        {contract.status === ContractStatus.InProgress && (
          <StyledLinkGrid container justifyContent="center">
            <StyledLink href="#" onClick={() => setDisputeDrawer(true)}>
              Raise dispute
            </StyledLink>
          </StyledLinkGrid>
        )}
        <RaiseDisputeDrawer
          contract={contract}
          open={disputeDrawer}
          handleClose={() => {
            setDisputeDrawer(false);
            setDrawer(false);
          }}
        />
      </StyledDrawerGrid>
    </SwipeableDrawer>
  );
};
