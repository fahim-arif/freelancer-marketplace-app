import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { deleteThread, getThread, getThreads } from 'services/chatThreadService';
import { ChatType, IChatThreadUpdated, IChatUserThread } from 'global/interfaces/chatThread';
import IApiError from 'global/interfaces/api';
import { showUIError } from 'utils/errorHandler';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MessagesSection from 'components/workRoom/messagesSection';
import RightMenu from 'components/workRoom/rightMenu';
import { useCustomEventListener } from 'react-custom-events';
import { MessagePublisherEventType } from 'global/enums/messagePublisherEventType';
import { IChatMessage } from 'global/interfaces/chatMessage';
import { AuthContext, AuthType } from 'contexts/AuthContext';
import { useParams } from 'react-router-dom';
import { Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { AddTeamDrawer } from 'components/workRoom/addTeamDrawer';
import { StartChatDrawer } from 'components/workRoom/startChatDrawer';
import CloseIcon from '@mui/icons-material/Close';
import { ConfirmDialog } from 'components/workRoom/confirmDialog';
import { getOpenContracts, updateContract } from 'services/contractService';
import { IContractDisplay } from 'global/interfaces/contract';
import {
  BadgeBox,
  EllipsisTypography,
  EllipsisWrapperDiv,
  JustifiedBox,
  LeftScrollableGridItem,
  LeftSectionTypography,
  RightScrollableGridItem,
  StyledAvatar,
  StyledBadge,
  StyledContainer,
  StyledGrid,
  StyledListItemAvatar,
} from 'components/common/StyledWorkroom/WorkroomStyles';
import { WorkRoomView } from 'global/enums/workroomLeftMenuOptions';

export const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  paddingLeft: '6px',
  paddingRight: '0px',
  paddingTop: '4px',
  paddingBottom: '4px',
  borderRadius: '8px',
  '&.Mui-selected': {
    backgroundColor: theme.palette.grey[100],
  },
  '&.Mui-selected:hover': {
    backgroundColor: theme.palette.grey[50],
  },
}));

EllipsisTypography.defaultProps = {
  noWrap: true,
};

const StyledAddMemberButton = styled(Button)(() => ({
  marginBottom: '16px',
}));

function WorkRoom(): JSX.Element {
  const authContext = React.useContext(AuthContext) as AuthType;
  const [view, setView] = React.useState<WorkRoomView>(WorkRoomView.Left);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isRightSectionCollapsed, setIsRightSectionCollapsed] = React.useState<boolean>(false);
  const needsPadding = useMediaQuery(theme.breakpoints.down('lg'));

  const [teamThreads, setTeamThreads] = React.useState<IChatUserThread[]>([]);
  const [dmThreads, setDmThreads] = React.useState<IChatUserThread[]>([]);
  const [selectedThread, setSelectedThread] = React.useState<IChatUserThread>();
  const [addTeamDialog, setAddTeamDialog] = React.useState<boolean>(false);
  const [startChatDialog, setStartChatDialog] = React.useState<boolean>(false);
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = React.useState<boolean>(false);
  const [contracts, setContracts] = React.useState<IContractDisplay[]>([]);

  const [isTyping, setIsTyping] = React.useState<boolean>(false);

  const [confirmOneOneDialog, setConfirmOneOneDialog] = React.useState<boolean>(false);
  const [confirmTeamDialog, setConfirmTeamDialog] = React.useState<boolean>(false);

  const urlParams = useParams();
  const { id, recipientUserId } = urlParams;

  React.useEffect(() => {
    document.title = 'Work Room';
    setView(WorkRoomView.Left);
    getThreads(id, recipientUserId)
      .then((res: IChatUserThread[]) => {
        if (res.length > 0) {
          if (id !== undefined) {
            setSelectedThread(res.find(x => x.chatThreadId === id));
          } else {
            setSelectedThread(res[0]);
          }
        }
        setDmThreads(res.filter(p => p.type === ChatType.OneToOne));
        setTeamThreads(res.filter(p => p.type === ChatType.Group));
      })
      .catch((err: IApiError) => {
        showUIError(err.message);
      });
  }, []);

  React.useEffect(() => {
    setContracts([]);
    const chatThreadId: string = selectedThread?.chatThreadId ?? '';
    if (chatThreadId != '') {
      getOpenContracts(chatThreadId)
        .then((res: IContractDisplay[]) => {
          for (const m of res) {
            updateContract(m);
          }
          setContracts(res);
        })
        .catch((err: IApiError) => {
          showUIError(err.message);
        });
    }
  }, [selectedThread]);

  const handleMessageClick = (event: React.MouseEvent<HTMLElement>, item: IChatUserThread): void => {
    const target = event.target as HTMLElement;
    const incluedesDeleteTarget =
      target.tagName.includes('BUTTON') || target.tagName.includes('svg') || target.tagName.includes('path');

    if (incluedesDeleteTarget) {
      return;
    }

    setSelectedThread(item);
    setView(WorkRoomView.Middle);
  };

  const handleMiddleClick = (): void => {
    setView(WorkRoomView.Middle);
  };

  const handleLeftClick = (): void => {
    setView(WorkRoomView.Left);
  };

  const handleRightClick = (): void => {
    setView(WorkRoomView.Right);
  };

  const handleRightCollapseClick = (): void => {
    setIsRightSectionCollapsed(current => !current);
  };

  useCustomEventListener(
    MessagePublisherEventType[MessagePublisherEventType.NewMessage],
    (res: IChatMessage) => {
      if (res.userId !== authContext.user?.id) {
        setIsTyping(false);
        setDmThreads(current =>
          current.map(item =>
            item.chatThreadId === res.chatThreadId
              ? { ...item, numberOfItemsUnread: item.numberOfItemsUnread + 1 }
              : item,
          ),
        );
        setTeamThreads(current =>
          current.map(item =>
            item.chatThreadId === res.chatThreadId
              ? { ...item, numberOfItemsUnread: item.numberOfItemsUnread + 1 }
              : item,
          ),
        );
      }
    },
    [dmThreads, teamThreads],
  );

  useCustomEventListener(
    MessagePublisherEventType[MessagePublisherEventType.ReadMessages],
    (res: IChatMessage) => {
      setDmThreads(current =>
        current.map(item => (item.chatThreadId === res.chatThreadId ? { ...item, numberOfItemsUnread: 0 } : item)),
      );
      setTeamThreads(current =>
        current.map(item => (item.chatThreadId === res.chatThreadId ? { ...item, numberOfItemsUnread: 0 } : item)),
      );
    },
    [dmThreads, teamThreads],
  );

  useCustomEventListener(
    MessagePublisherEventType[MessagePublisherEventType.UpdateThread],
    (res: IChatThreadUpdated) => {
      getThread(res.id)
        .then((res: IChatUserThread) => {
          if (res.type === ChatType.OneToOne) {
            setDmThreads(current => {
              if (current.findIndex(p => p.chatThreadId === res.chatThreadId) === -1) return [...current, res];
              else return current.map(item => (item.chatThreadId === res.chatThreadId ? res : item));
            });
          } else if (res.type === ChatType.Group) {
            setTeamThreads(current => {
              if (current.findIndex(p => p.chatThreadId === res.chatThreadId) === -1) return [...current, res];
              else return current.map(item => (item.chatThreadId === res.chatThreadId ? res : item));
            });
          }
          if (selectedThread === undefined || selectedThread?.chatThreadId === res.chatThreadId) {
            setSelectedThread(res);
          }
        })
        .catch((err: IApiError) => {
          showUIError(err.message);
        });
    },
    [dmThreads, teamThreads],
  );

  const removeSingleChat = (chatThreadId: string) => {
    setDmThreads(current => current.filter(x => x.chatThreadId !== chatThreadId));
    if (selectedThread?.chatThreadId === chatThreadId) {
      setSelectedThread(undefined);
    }

    deleteThread(chatThreadId).catch((err: IApiError) => {
      showUIError(err.message);
    });
  };

  const leaveChat = (chatThreadId: string) => {
    setTeamThreads((prev: IChatUserThread[]) => [...prev.filter(thread => thread.chatThreadId !== chatThreadId)]);
    setSelectedThread(undefined);
    deleteThread(chatThreadId).catch((err: IApiError) => {
      showUIError(err.message);
    });
  };

  const hasActiveSellingContract = contracts.filter(x => x.sellerAdditionalDetails).length > 0;

  return (
    <section>
      <StyledContainer>
        <StyledGrid container spacing={0}>
          {(!isMobile || view === WorkRoomView.Left) && (
            <LeftScrollableGridItem item xs={12} md={3.0} lg={2.0} isMobile={isMobile} needsPadding={needsPadding}>
              <LeftSectionTypography variant="h6">Teams</LeftSectionTypography>
              <List>
                {teamThreads.map((item: IChatUserThread, i: number) => {
                  const isChatOwner = item.createdByUserId == authContext.user?.id;
                  return (
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
                        onClick={e => handleMessageClick(e, item)}
                        selected={item.chatThreadId === selectedThread?.chatThreadId && !isMobile}
                        disableRipple
                      >
                        <ListItemText
                          primary={
                            <JustifiedBox>
                              <EllipsisWrapperDiv>
                                <EllipsisTypography
                                  variant="subtitle1"
                                  sx={{
                                    fontWeight: item.numberOfItemsUnread > 0 ? 600 : 500,
                                    color:
                                      item.numberOfItemsUnread > 0 ? theme.palette.grey[900] : theme.palette.grey[600],
                                  }}
                                  title={item.displayName}
                                >
                                  # {item.displayName}
                                </EllipsisTypography>
                              </EllipsisWrapperDiv>
                              <StyledBadge color="primary" badgeContent={item.numberOfItemsUnread}>
                                <BadgeBox></BadgeBox>
                              </StyledBadge>
                            </JustifiedBox>
                          }
                          sx={{ margin: '0px' }}
                        />
                        <IconButton
                          className="hidden-close"
                          sx={{ display: isMobile ? undefined : 'none' }}
                          onClick={() => setConfirmTeamDialog(true)}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </StyledListItemButton>
                      <ConfirmDialog
                        open={confirmTeamDialog}
                        setOpen={setConfirmTeamDialog}
                        onConfirm={() => {
                          leaveChat(item.chatThreadId);
                          setConfirmTeamDialog(false);
                        }}
                        title={isChatOwner ? 'Delete chat' : 'Leave chat'}
                        content={
                          isChatOwner
                            ? 'Are you sure you want to delete this entire thread?'
                            : 'Are you sure you want to leave this chat?'
                        }
                        onCancel={() => setConfirmTeamDialog(false)}
                      />
                    </ListItem>
                  );
                })}
              </List>
              <StyledAddMemberButton
                startIcon={<AddIcon style={{ color: theme.palette.grey[600] }} />}
                onClick={() => setAddTeamDialog(true)}
                style={{ backgroundColor: 'transparent' }}
              >
                <Typography variant="subtitle2" style={{ color: theme.palette.grey[900] }}>
                  Add a team
                </Typography>
              </StyledAddMemberButton>
              <LeftSectionTypography variant="h6">Direct Messages</LeftSectionTypography>
              <List>
                {dmThreads.map((item: IChatUserThread, i: number) => (
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
                      onClick={e => handleMessageClick(e, item)}
                      selected={item.chatThreadId === selectedThread?.chatThreadId && !isMobile}
                      disableRipple
                    >
                      <StyledListItemAvatar>
                        <StyledAvatar userId={item.otherUserId} displayName={item?.displayName} />
                      </StyledListItemAvatar>
                      <ListItemText
                        primary={
                          <JustifiedBox>
                            <EllipsisWrapperDiv>
                              <EllipsisTypography
                                variant="subtitle1"
                                sx={{
                                  fontWeight: item.numberOfItemsUnread > 0 ? 600 : 500,
                                  color:
                                    item.numberOfItemsUnread > 0 ? theme.palette.grey[900] : theme.palette.grey[600],
                                }}
                                title={item.displayName}
                              >
                                {item.displayName}
                              </EllipsisTypography>
                            </EllipsisWrapperDiv>
                            <StyledBadge color="primary" badgeContent={item.numberOfItemsUnread}>
                              <BadgeBox></BadgeBox>
                            </StyledBadge>
                          </JustifiedBox>
                        }
                      />
                      <IconButton
                        className="hidden-close"
                        sx={{ display: isMobile ? undefined : 'none' }}
                        onClick={() => setConfirmOneOneDialog(true)}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </StyledListItemButton>
                    <ConfirmDialog
                      open={confirmOneOneDialog}
                      setOpen={setConfirmOneOneDialog}
                      onConfirm={() => {
                        removeSingleChat(item.chatThreadId);
                        setConfirmOneOneDialog(false);
                      }}
                      title="Remove chat"
                      content="Are you sure you want to remove this chat?"
                      onCancel={() => setConfirmOneOneDialog(false)}
                    />
                  </ListItem>
                ))}
              </List>
              <StyledAddMemberButton
                startIcon={<AddIcon style={{ color: theme.palette.grey[600] }} />}
                onClick={() => setStartChatDialog(true)}
                style={{ backgroundColor: 'transparent' }}
              >
                <Typography variant="subtitle2" style={{ color: theme.palette.grey[900] }}>
                  Start message
                </Typography>
              </StyledAddMemberButton>
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
                handleLeftClick={handleLeftClick}
                handleRightClick={handleRightClick}
                handleRightCollapseClick={handleRightCollapseClick}
                isRightSectionCollapsed={isRightSectionCollapsed}
                teams={teamThreads}
                isTyping={isTyping}
                setIsTyping={setIsTyping}
                hasActiveSellingContract={hasActiveSellingContract}
              />
            </Grid>
          )}
          {((!isMobile && !isRightSectionCollapsed) || view === WorkRoomView.Right) && (
            <RightScrollableGridItem item xs={12} md={4} lg={3.5} isMobile={isMobile} needsPadding={needsPadding}>
              <RightMenu
                selectedThread={selectedThread}
                user={authContext.user}
                handleMiddleClick={handleMiddleClick}
                addMemberDrawerOpen={isAddMemberDialogOpen}
                setAddMemberDrawerOpen={setIsAddMemberDialogOpen}
                setTeamThreads={setTeamThreads}
                setSelectedThread={setSelectedThread}
                contracts={contracts}
              />
            </RightScrollableGridItem>
          )}
        </StyledGrid>
      </StyledContainer>
      <AddTeamDrawer
        open={addTeamDialog}
        setOpen={setAddTeamDialog}
        setAddMemberDrawerOpen={setIsAddMemberDialogOpen}
        setTeamThread={setTeamThreads}
        setSelectedThread={setSelectedThread}
      />
      <StartChatDrawer open={startChatDialog} setOpen={setStartChatDialog} setSelectedThread={setSelectedThread} />
    </section>
  );
}

export default WorkRoom;
