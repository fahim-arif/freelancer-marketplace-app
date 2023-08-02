import { Grid, List, ListItem, ListItemText, useMediaQuery, useTheme } from '@mui/material';
import {
  EllipsisTypography,
  EllipsisWrapperDiv,
  JustifiedBox,
  LeftScrollableGridItem,
  LeftSectionTypography,
  RightScrollableGridItem,
  StyledAvatar,
  StyledContainer,
  StyledGrid,
  StyledListItemAvatar,
} from 'components/common/StyledWorkroom/WorkroomStyles';
import MessagesSection from 'components/workRoom/messagesSection';
import RightMenu from 'components/workRoom/rightMenu';
import { WorkRoomView } from 'global/enums/workroomLeftMenuOptions';
import React, { useContext, useEffect, useState } from 'react';
import { StyledListItemButton } from 'views/workroom/WorkRoom';
import { getDisputes } from 'services/contractService';
import { IContract } from 'global/interfaces/contract';
import IApiError from 'global/interfaces/api';
import { showUIError } from 'utils/errorHandler';
import { IChatUserThread } from 'global/interfaces/chatThread';
import { AuthContext, AuthType } from 'contexts/AuthContext';
import { UserRole } from 'global/enums/userRole';
import { getThread } from 'services/chatThreadService';

export const Dispute: React.FC = () => {
  const [view, setView] = React.useState<WorkRoomView>(WorkRoomView.Left);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const needsPadding = useMediaQuery(theme.breakpoints.down('lg'));
  const [isRightSectionCollapsed, setIsRightSectionCollapsed] = React.useState<boolean>(false);
  const [disputeThreads, setDisputeThread] = useState<IContract[]>([]);
  const [selectedThread, setSelectedThread] = useState<IChatUserThread>();
  const authContext = useContext(AuthContext) as AuthType;
  const hasAdminRole = authContext.user && authContext.user.roles.indexOf(UserRole.Administrator) > -1;

  useEffect(() => {
    if (hasAdminRole === null) {
      return;
    }
    if (!hasAdminRole) {
      showUIError('You are not authorized to view this page');
      return;
    }

    getDisputes()
      .then((res: IContract[]) => {
        setDisputeThread(res);
      })
      .catch((err: IApiError) => {
        showUIError(err.message);
      });
  }, [hasAdminRole]);

  const handleMessageClick = (chatThreadId: string, asUserId: string): void => {
    getThread(chatThreadId, asUserId)
      .then(res => {
        const threadWithDispute = {
          ...res,
          disputeRaisedById: asUserId,
        };
        setSelectedThread(threadWithDispute);
        setView(WorkRoomView.Middle);
      })
      .catch((err: IApiError) => {
        showUIError(err.message);
      });
  };

  const handleRightCollapseClick = (): void => {
    setIsRightSectionCollapsed(current => !current);
  };

  return (
    <section>
      <StyledContainer>
        <StyledGrid container spacing={0}>
          {(!isMobile || view === WorkRoomView.Left) && (
            <LeftScrollableGridItem item xs={12} md={3.0} lg={2.0} isMobile={isMobile} needsPadding={needsPadding}>
              <LeftSectionTypography variant="h6">Disputes</LeftSectionTypography>
              <List>
                {disputeThreads.map((item: IContract, i) => (
                  <ListItem
                    key={i}
                    disablePadding
                    sx={{
                      '&:hover .hidden-close': {
                        display: 'flex',
                      },
                    }}
                  >
                    <StyledListItemButton
                      onClick={() => handleMessageClick(item.chatThreadId, item.contractDispute!.raisedByUserId)}
                      selected={item.chatThreadId === selectedThread?.chatThreadId && !isMobile}
                      disableRipple
                    >
                      <StyledListItemAvatar>
                        <StyledAvatar
                          userId={item.contractDispute!.raisedByUserId}
                          displayName={generateRaisedByDisplayName(item)}
                        />
                      </StyledListItemAvatar>
                      <ListItemText
                        primary={
                          <JustifiedBox>
                            <EllipsisWrapperDiv>
                              <EllipsisTypography variant="subtitle1" title={generateRaisedByDisplayName(item)}>
                                {generateRaisedByDisplayName(item)}
                              </EllipsisTypography>
                            </EllipsisWrapperDiv>
                          </JustifiedBox>
                        }
                      />
                    </StyledListItemButton>
                  </ListItem>
                ))}
              </List>
            </LeftScrollableGridItem>
          )}
          {(!isMobile || view === WorkRoomView.Middle) && (
            <Grid
              item
              xs={12}
              md={isRightSectionCollapsed ? 9 : 5}
              lg={isRightSectionCollapsed ? 10 : 6.5}
              sx={{
                height: '100%',
                paddingRight: !isMobile && isRightSectionCollapsed && needsPadding ? '24px' : '0px',
              }}
            >
              <MessagesSection
                selectedThread={selectedThread}
                isRightSectionCollapsed={false}
                handleLeftClick={function (): void {
                  throw new Error('Function not implemented.');
                }}
                handleRightClick={function (): void {
                  throw new Error('Function not implemented.');
                }}
                handleRightCollapseClick={handleRightCollapseClick}
                teams={[]}
                isTyping={false}
                setIsTyping={function (): void {
                  throw new Error('Function not implemented.');
                }}
                hasActiveSellingContract={false}
              />
            </Grid>
          )}
          {((!isMobile && !isRightSectionCollapsed) || view === WorkRoomView.Right) && (
            <RightScrollableGridItem item xs={12} md={4} lg={3.5} isMobile={isMobile} needsPadding={needsPadding}>
              <RightMenu
                selectedThread={undefined}
                user={null}
                handleMiddleClick={function (): void {
                  throw new Error('Function not implemented.');
                }}
                addMemberDrawerOpen={false}
                setAddMemberDrawerOpen={function (): void {
                  throw new Error('Function not implemented.');
                }}
                setTeamThreads={function (): void {
                  throw new Error('Function not implemented.');
                }}
                setSelectedThread={function (): void {
                  throw new Error('Function not implemented.');
                }}
                contracts={[]}
              />
            </RightScrollableGridItem>
          )}
        </StyledGrid>
      </StyledContainer>
    </section>
  );
};

const generateRaisedByDisplayName = (contract: IContract): string => {
  const raisedByUserId = contract.contractDispute?.raisedByUserId;
  if (raisedByUserId === contract.buyerAdditionalDetails?.sellerId) {
    return contract.buyerAdditionalDetails?.sellerDisplayName ?? '';
  }
  if (raisedByUserId === contract.sellerAdditionalDetails?.buyerId) {
    return contract.sellerAdditionalDetails?.buyerDisplayName ?? '';
  }
  throw new Error('Failed to generate raised by user Id');
};
