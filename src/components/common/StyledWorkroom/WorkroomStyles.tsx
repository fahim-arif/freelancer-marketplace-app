import { Badge, Box, Container, Grid, ListItemAvatar, Typography, styled } from '@mui/material';
import { UserAvatar } from '../UserAvatar';

const ScrollableGridItem = styled(Grid)`
  height: 100%;
  overflow-y: scroll;
  padding-top: 16px;
`;

interface GridProps {
  isMobile: boolean;
  needsPadding: boolean;
}

export const StyledContainer = styled(Container)(({ theme }) => ({
  [theme.breakpoints.down('lg')]: {
    padding: `0 0`,
  },
}));

// 72px is the header bar. The 20px is the expected gap from the bottom of the screen
export const StyledGrid = styled(Grid)`
  height: calc(var(--app-height) - 72px - 1px);
`;

export const LeftScrollableGridItem = styled(ScrollableGridItem, {
  // Configure which props should be forwarded on DOM
  shouldForwardProp: prop => prop !== 'isMobile' && prop !== 'needsPadding',
})<GridProps>(({ isMobile, needsPadding }) => ({
  paddingLeft: needsPadding ? '24px' : '0px',
  paddingRight: isMobile ? '24px' : '0px',
}));

export const RightScrollableGridItem = styled(ScrollableGridItem, {
  // Configure which props should be forwarded on DOM
  shouldForwardProp: prop => prop !== 'isMobile' && prop !== 'needsPadding',
})<GridProps>(({ isMobile, needsPadding }) => ({
  paddingLeft: isMobile ? '24px' : '0px',
  paddingRight: needsPadding ? '24px' : '0px',
}));

export const LeftSectionTypography = styled(Typography)`
  padding-left: 4px;
`;

export const JustifiedBox = styled(Box)(() => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

export const EllipsisWrapperDiv = styled('div')`
  display: table;
  table-layout: fixed;
  width: 100%;
  white-space: nowrap;
  padding-right: 4px;
`;

export const EllipsisTypography = styled(Typography)(() => ({
  display: 'table-cell',
}));

export const StyledBadge = styled(Badge)`
  & .MuiBadge-badge {
    font-weight: 500;
    top: 9px;
    left: -18px;
  }
`;

export const BadgeBox = styled(Box)(() => ({
  height: '19px',
  width: '19px',
}));

export const StyledListItemAvatar = styled(ListItemAvatar)(() => ({
  minWidth: '40px',
  marginRight: '0px',
}));

export const StyledAvatar = styled(UserAvatar)(() => ({
  minWidth: '40px',
  marginRight: '8px',
}));
