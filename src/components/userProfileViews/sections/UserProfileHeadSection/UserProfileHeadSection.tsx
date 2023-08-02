import { Box, Fab, Grid, Stack, styled, Typography, useMediaQuery, useTheme } from '@mui/material';
import { IFrontUser } from 'global/interfaces/user';
import { LocationIcon } from 'components/icon/LocationIcon';
import PeopleIcon from '@mui/icons-material/People';
import { BriefcaseIcon } from 'components/icon/BriefcaseIcon';
import { LikeIcon } from 'components/icon/LikeIcon';
import { NibIcon } from 'components/icon/NibIcon';
import UserSkills from './UserSkills';
import { UserAvatar } from 'components/common/UserAvatar';
import EditIcon from '@mui/icons-material/Edit';
import { AuthContext, AuthType } from 'contexts/AuthContext';
import { useContext } from 'react';
import { Link } from 'react-router-dom';

const StyledHeaderGrid = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.grey[50],
  padding: '24px',
  position: 'relative',
}));

interface MobileProps {
  isMobile: boolean;
}

const StyledAvatar = styled(UserAvatar, {
  // Configure which props should be forwarded on DOM
  shouldForwardProp: prop => prop !== 'isMobile',
})<MobileProps>(({ isMobile }) => ({
  width: isMobile ? '96px' : '148px',
  height: isMobile ? '96px' : '148px',
  border: '4px solid #FFFFFF',
  borderRadius: '8px',
}));

const StyledLocationIcon = styled(LocationIcon)(({ theme }) => ({
  height: '16px',
  width: '16px',
  fill: theme.palette.grey[600],
  marginRight: '4px',
}));

const FlexBox = styled(Box)`
  display: flex;
  align-items: center;
`;

const PaddedBox = styled(FlexBox)(() => ({
  marginTop: '32px',
  paddingLeft: '24px',
  paddingRight: '24px',
}));

const StyledNibIcon = styled(NibIcon)(({ theme }) => ({
  width: '32px',
  height: '32px',
  fill: 'none',
  stroke: theme.palette.grey[600],
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

const InfoItem = styled(Grid)(({ theme }) => ({
  height: '58px',
  width: '100px',
  padding: '8px 8px',
  backgroundColor: '#EFF1FB',
  borderColor: theme.palette.primary[400],
  borderWidth: '1px',
  borderStyle: 'solid',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
}));

const ConnectionsInfoItem = styled(InfoItem)(() => ({
  width: '130px',
}));

const JobsInfoItem = styled(InfoItem)(() => ({
  width: '85px',
}));

const SuccessInfoItem = styled(InfoItem)(() => ({
  width: '115px',
}));

const InfoTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary[700],
}));

const StyledPeopleIcon = styled(PeopleIcon)(({ theme }) => ({
  stroke: theme.palette.primary[700],
  width: '32px',
  height: '32px',
  fill: 'none',
}));

const StyledBriefcaseIcon = styled(BriefcaseIcon)(({ theme }) => ({
  stroke: theme.palette.primary[700],
  width: '32px',
  height: '32px',
  fill: 'none',
}));

const StyledLikeIcon = styled(LikeIcon)(({ theme }) => ({
  stroke: theme.palette.primary[700],
  width: '32px',
  height: '32px',
  fill: 'none',
}));

const StyledFab = styled(Fab)`
  position: absolute;
  bottom: 8px;
  right: 8px;
`;

interface IUserProfileHeadSectionProps {
  user: IFrontUser;
}

export default function UserProfileHeadSection({ user }: IUserProfileHeadSectionProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const authContext = useContext(AuthContext) as AuthType;

  return (
    <>
      <StyledHeaderGrid container rowGap={2}>
        <Grid item xs={12} lg={6.5}>
          <Stack direction="row" spacing={3}>
            <StyledAvatar
              userId={user.id}
              displayName={`${user.firstName} ${user.lastName}`}
              variant="square"
              isMobile={isMobile}
            />
            <Stack direction="column" spacing={1}>
              <EllipsisWrapperDiv>
                <EllipsisTypography variant={isMobile ? 'h5' : 'h4'}>
                  {user.firstName} {user?.lastName}
                </EllipsisTypography>
              </EllipsisWrapperDiv>
              <EllipsisWrapperDiv>
                <EllipsisTypography variant="body1" color={theme.palette.primary[500]}>
                  {user.title}
                </EllipsisTypography>
              </EllipsisWrapperDiv>
              <FlexBox>
                <StyledLocationIcon />
                <Typography variant="body2" component="span" color={theme.palette.grey[600]}>
                  {user.country}
                </Typography>
              </FlexBox>
              {!isMobile && (
                <FlexBox>
                  <UserSkills user={user} />
                </FlexBox>
              )}
            </Stack>
          </Stack>
        </Grid>
        {isMobile && (
          <Grid item xs={12}>
            <UserSkills user={user} />
          </Grid>
        )}
        <Grid item xs={12} lg={5.5}>
          <Grid
            container
            direction="row"
            gap={1}
            alignItems="center"
            justifyContent={{ xs: 'flex-start', lg: 'flex-end' }}
            width="100%"
          >
            <ConnectionsInfoItem item>
              <StyledPeopleIcon />
              <Stack direction="column" marginLeft={0.5}>
                <InfoTypography variant="caption">Connections</InfoTypography>
                <InfoTypography variant="subtitle1">{user.connectionCount}</InfoTypography>
              </Stack>
            </ConnectionsInfoItem>
            <JobsInfoItem item>
              <StyledBriefcaseIcon />
              <Stack direction="column" marginLeft={0.5}>
                <InfoTypography variant="caption">Jobs</InfoTypography>
                <InfoTypography variant="subtitle1">XX</InfoTypography>
              </Stack>
            </JobsInfoItem>
            <SuccessInfoItem item>
              <StyledLikeIcon />
              <Stack direction="column" marginLeft={0.5}>
                <InfoTypography variant="caption">Like rate</InfoTypography>
                <InfoTypography variant="subtitle1">XX%</InfoTypography>
              </Stack>
            </SuccessInfoItem>
          </Grid>
        </Grid>
        {user.id == authContext?.user?.id && (
          <Link to={`/users/${user.id}/edit`}>
            <StyledFab color="primary" aria-label="edit">
              <EditIcon />
            </StyledFab>
          </Link>
        )}
      </StyledHeaderGrid>
      <PaddedBox>
        <StyledNibIcon />
        <Typography marginLeft={2} variant="h5" color={theme.palette.grey[900]}>
          About Me
        </Typography>
      </PaddedBox>
      <PaddedBox>
        <Typography variant="body1" color={theme.palette.grey[600]}>
          {user.bio}
        </Typography>
      </PaddedBox>
    </>
  );
}
