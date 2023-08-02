import { IChatMessageDisplay } from 'global/interfaces/chatMessage';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import * as React from 'react';
import Typography from '@mui/material/Typography';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Box, styled, useTheme } from '@mui/material';
import { UserAvatar } from 'components/common/UserAvatar';

interface IChatMessageProps extends IChatMessageDisplay {
  children: React.ReactNode;
}

export const FlexBox = styled(Box)`
  display: flex;
  align-items: center;
`;

const StyledVisibilityIcon = styled(VisibilityOutlinedIcon)(({ theme }) => ({
  marginRight: theme.spacing(0.5),
  width: '16px',
  height: '16px',
  color: theme.palette.grey[700],
}));

interface SystemProps {
  isSystemMessage?: boolean;
}

export const MessageTiteTypography = styled(Typography, {
  // Configure which props should be forwarded on DOM
  shouldForwardProp: prop => prop !== 'isSystemMessage',
})<SystemProps>(({ theme, isSystemMessage }) => ({
  display: 'inline-flex',
  height: '24px',
  marginRight: theme.spacing(1),
  color: isSystemMessage ? theme.palette.grey[900] : theme.palette.grey[700],
  fontWeight: 600,
}));

export const TimeTypography = styled(Typography)(({ theme }) => ({
  display: 'inline-flex',
  height: '16px',
  marginTop: '2px',
  color: theme.palette.grey[400],
}));

export const StyledListItemAvatar = styled(ListItemAvatar)(() => ({
  minWidth: '52px',
}));

export const StyledListItem = styled(ListItem, {
  // Configure which props should be forwarded on DOM
  shouldForwardProp: prop => prop !== 'isSystemMessage',
})<SystemProps>(({ isSystemMessage }) => ({
  paddingTop: '0px',
  paddingBottom: isSystemMessage ? '6px' : '0px',
  backgroundColor: 'transparent',
}));

export const StyledAvatar = styled(UserAvatar)(() => ({
  width: '40px',
  height: '40px',
}));

export const StyledSystemAvatar = styled(StyledAvatar)(({ theme }) => ({
  backgroundColor: theme.palette.primary[500],
  stroke: theme.palette.common.white,
}));

export default function ChatMessage(props: IChatMessageProps): JSX.Element {
  const theme = useTheme();

  return (
    <>
      <StyledListItem alignItems="flex-start" isSystemMessage={props.isSystemMessage}>
        {props.isSystemMessage && (
          <StyledListItemAvatar>
            <StyledSystemAvatar>{props.systemIcon}</StyledSystemAvatar>
          </StyledListItemAvatar>
        )}
        {!props.isSystemMessage && (
          <StyledListItemAvatar>
            <StyledAvatar userId={props.userId} displayName={props.userDisplayName} />
          </StyledListItemAvatar>
        )}

        <ListItemText
          primary={
            <React.Fragment>
              {props.visibleMessage !== undefined && (
                <FlexBox>
                  <StyledVisibilityIcon />
                  <Typography component="span" variant="caption" color={theme.palette.grey[700]}>
                    {props.visibleMessage}
                  </Typography>
                </FlexBox>
              )}
              <FlexBox>
                <MessageTiteTypography variant="subtitle1" isSystemMessage={props.isSystemMessage}>
                  {props.messageTitle}
                </MessageTiteTypography>
                <TimeTypography variant="caption">{props.time}</TimeTypography>
              </FlexBox>
            </React.Fragment>
          }
          secondary={props.children}
          secondaryTypographyProps={{ component: 'div' }}
        />
      </StyledListItem>
    </>
  );
}
