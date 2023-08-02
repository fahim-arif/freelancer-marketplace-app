import { DoubleArrowIcon } from 'components/icon/DoubleArrowIcon';
import { ArrowBackIcon } from 'components/icon/ArrowBackIcon';
import Typography from '@mui/material/Typography';
import { IChatUserThread } from 'global/interfaces/chatThread';
import { Box, Grid, IconButton, Stack, styled, useMediaQuery, useTheme } from '@mui/material';
import { UserAvatar } from 'components/common/UserAvatar';

interface IMessagesSectionHeaderProps {
  selectedThread: IChatUserThread | undefined;
  isRightSectionCollapsed: boolean;
  handleLeftClick: () => void;
  handleRightClick: () => void;
  handleRightCollapseClick: () => void;
  teams: IChatUserThread[];
}

interface MobileProps {
  isMobile: boolean;
}

const MessageHeaderBox = styled(Box, {
  // Configure which props should be forwarded on DOM
  shouldForwardProp: prop => prop !== 'isMobile',
})<MobileProps>(({ isMobile, theme }) => ({
  minHeight: isMobile ? '68px' : '88px',
  borderLeft: !isMobile ? `1px solid ${theme.palette.grey[200]}` : 'none',
  borderRight: !isMobile ? `1px solid ${theme.palette.grey[200]}` : 'none',
  borderBottom: `1px solid ${theme.palette.grey[200]}`,
  paddingLeft: isMobile ? '24px' : '0px',
  paddingRight: isMobile ? '24px' : '0px',
  display: 'flex',
  alignItems: 'center',
  marginBottom: '1px',
}));

const FlexGridItem = styled(Grid)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const RightFlexGridItem = styled(Grid, {
  // Configure which props should be forwarded on DOM
  shouldForwardProp: prop => prop !== 'isMobile',
})<MobileProps>(() => ({
  display: 'flex',
  alignItems: 'center',
  alignContent: 'flex-end',
  flexWrap: 'wrap',
  flexDirection: 'column',
  marginTop: '0px',
}));

const FlexBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
}));

const ActionFlexBox = styled(FlexBox)(() => ({
  height: '100%',
  marginRight: '8px',
}));

const StyledAvatar = styled(UserAvatar, {
  // Configure which props should be forwarded on DOM
  shouldForwardProp: prop => prop !== 'isMobile',
})<MobileProps>(({ isMobile }) => ({
  width: isMobile ? '36px' : '56px',
  height: isMobile ? '36px' : '56px',
  marginLeft: isMobile ? '4px' : '24px',
}));

const StyledStack = styled(Stack)(() => ({
  height: '28px',
  marginLeft: '12px',
}));

const EllipsisWrapperDiv = styled('div')`
  display: table;
  table-layout: fixed;
  width: 100%;
  white-space: nowrap;
`;

const EllipsisTypography = styled(Typography)(() => ({
  display: 'table-cell',
}));

EllipsisTypography.defaultProps = {
  noWrap: true,
};

export default function MessagesSectionHeader(props: IMessagesSectionHeaderProps): JSX.Element {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <MessageHeaderBox isMobile={isMobile}>
      <Grid container>
        <FlexGridItem item xs={12} md={10}>
          <FlexBox>
            {isMobile && (
              <IconButton onClick={props.handleLeftClick} sx={{ marginLeft: '-12px' }}>
                <ArrowBackIcon />
              </IconButton>
            )}
            <StyledAvatar
              userId={props.selectedThread?.otherUserId}
              displayName={props.selectedThread?.displayName}
              isMobile={isMobile}
            />
            <StyledStack direction="column" spacing={0}>
              <EllipsisWrapperDiv>
                <EllipsisTypography variant={isMobile ? 'subtitle1' : 'h6'}>
                  {props.selectedThread?.displayName}
                </EllipsisTypography>
              </EllipsisWrapperDiv>
            </StyledStack>
          </FlexBox>
          {isMobile && (
            <FlexBox>
              <IconButton
                onClick={props.handleRightClick}
                sx={{ marginRight: '-18px', stroke: theme.palette.primary[600] }}
              >
                <Typography variant="caption" color={theme.palette.primary[600]}>
                  Details
                </Typography>
                <DoubleArrowIcon />
              </IconButton>
            </FlexBox>
          )}
        </FlexGridItem>
        <RightFlexGridItem item md={2} isMobile={isMobile}>
          <ActionFlexBox>
            {!isMobile && (
              <IconButton
                onClick={props.handleRightCollapseClick}
                sx={{
                  marginLeft: '8px',
                  transform: props.isRightSectionCollapsed ? 'rotate(-180deg)' : 'none',
                  stroke: theme.palette.grey[600],
                }}
              >
                <DoubleArrowIcon />
              </IconButton>
            )}
          </ActionFlexBox>
        </RightFlexGridItem>
      </Grid>
    </MessageHeaderBox>
  );
}
