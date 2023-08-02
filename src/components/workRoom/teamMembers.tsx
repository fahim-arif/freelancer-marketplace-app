import { IActiveContractsProps } from './rightMenu';
import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  styled,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { StyledListItemButton } from 'views/workroom/WorkRoom';
import { AddMemberDrawer } from './addMemberDrawer';
import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import { removeRecipient } from 'services/chatThreadService';
import IApiError from 'global/interfaces/api';
import { showUIError } from 'utils/errorHandler';
import { IChatUserThread } from 'global/interfaces/chatThread';
import CloseIcon from '@mui/icons-material/Close';
import { ConfirmDialog } from './confirmDialog';
import { UserAvatar } from 'components/common/UserAvatar';

const StyledTypography = styled(Typography)(() => ({
  marginLeft: '5px',
}));

const JustifiedBox = styled(Box)(() => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const StyledListItemAvatar = styled(ListItemAvatar)(() => ({
  minWidth: '40px',
  marginRight: '0px',
}));

const StyledAvatar = styled(UserAvatar)(() => ({
  minWidth: '40px',
  marginRight: '8px',
}));

const EllipsisWrapperDiv = styled('div')`
  display: table;
  table-layout: fixed;
  width: 100%;
  white-space: nowrap;
  padding-right: 4px;
`;

const StyledAddMemberButton = styled(Button)(() => ({
  marginTop: '16px',
  marginLeft: '5px',
}));

export const TeamMembers: React.FC<IActiveContractsProps> = ({
  selectedThread,
  user,
  addMemberDrawerOpen,
  setAddMemberDrawerOpen,
  setSelectedThread,
}) => {
  const theme = useTheme();
  const [confirmRemoveRecipient, setConfirmRemoveRecipient] = React.useState(false);
  const [selectedRecipientId, setSelectedRecipient] = React.useState('');
  const [selectedTeamThreadId, setSelectedTeamThreadId] = React.useState('');
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const removeRecipientClick = (chatThreadId: string, recipientUserId: string) => {
    setSelectedThread((prev: IChatUserThread | undefined) => {
      if (prev !== undefined) {
        return {
          ...prev,
          recipients: prev.recipients.filter(recipient => recipient.userId !== recipientUserId),
        };
      }

      return prev;
    });

    removeRecipient({ recipientUserId, chatThreadId }).catch((err: IApiError) => {
      showUIError(err.message);
    });
  };

  const activeRecipients = selectedThread?.recipients.filter(recipient => recipient.active) ?? [];

  return (
    <>
      <List disablePadding>
        {selectedThread?.recipients.map(recipient => (
          <section key={recipient.userId}>
            {recipient.active && (
              <ListItem
                key={recipient.userId}
                disablePadding
                sx={{
                  '&:hover .hidden-close': {
                    display: 'flex',
                  },
                }}
              >
                <StyledListItemButton disableRipple>
                  <StyledListItemAvatar>
                    <StyledAvatar userId={recipient.userId} displayName={recipient.displayName} />
                  </StyledListItemAvatar>

                  <ListItemText
                    primary={
                      <JustifiedBox>
                        <EllipsisWrapperDiv>
                          <StyledTypography variant="subtitle1" sx={{ color: theme.palette.grey[600] }}>
                            {user?.id === recipient.userId ? 'You' : recipient.displayName}
                          </StyledTypography>
                        </EllipsisWrapperDiv>
                      </JustifiedBox>
                    }
                  />
                  {user?.id !== recipient.userId && activeRecipients?.length > 2 && (
                    <IconButton
                      className="hidden-close"
                      sx={{ display: isMobile ? undefined : 'none' }}
                      onClick={() => {
                        setSelectedRecipient(recipient.userId);
                        setSelectedTeamThreadId(selectedThread.chatThreadId);
                        setConfirmRemoveRecipient(true);
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  )}
                </StyledListItemButton>
              </ListItem>
            )}
            <ConfirmDialog
              open={confirmRemoveRecipient}
              setOpen={setConfirmRemoveRecipient}
              onConfirm={() => {
                removeRecipientClick(selectedTeamThreadId, selectedRecipientId);
                setConfirmRemoveRecipient(false);
              }}
              title="Remove chat"
              content="Are you sure you want to remove this member?"
              onCancel={() => setConfirmRemoveRecipient(false)}
            />
          </section>
        ))}
      </List>
      <StyledAddMemberButton
        startIcon={<AddIcon style={{ color: theme.palette.grey[600] }} />}
        onClick={() => setAddMemberDrawerOpen(true)}
        style={{ backgroundColor: 'transparent' }}
      >
        <Typography variant="subtitle2" style={{ color: theme.palette.grey[900] }}>
          Add a member
        </Typography>
      </StyledAddMemberButton>
      <AddMemberDrawer open={addMemberDrawerOpen} setOpen={setAddMemberDrawerOpen} selectedThread={selectedThread} />
    </>
  );
};
