import { IFrontUserBase } from 'global/interfaces/user';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { profileContainer } from 'global/constants';
import { Box, Chip, Grid, Stack, styled, useMediaQuery, useTheme } from '@mui/material';
import { useCallback, useRef, useState } from 'react';
import { useIntersection } from 'global/hooks/useIntersection';
import { ISkill } from 'global/interfaces/skill';
import { LocationIcon } from 'components/icon/LocationIcon';
import { LikeIcon } from 'components/icon/LikeIcon';
import { UserAvatar } from 'components/common/UserAvatar';

interface IVerticalUserCardProps {
  users: IFrontUserBase;
  onClickUserCard: (id: string) => void;
  onListViewUsers: (id: string) => void;
}

interface StyledCardProps {
  isMobile: boolean;
}

const StyledCard = styled(Card, {
  // Configure which props should be forwarded on DOM
  shouldForwardProp: prop => prop !== 'isMobile',
})<StyledCardProps>(({ theme, isMobile }) => ({
  cursor: 'pointer',
  padding: '24px 20px 0px 20px',
  backgroundColor: theme.palette.common.white,
  borderRadius: '8px',
  boxShadow: 'none',
  marginLeft: isMobile ? '0px' : '12px',
  marginRight: isMobile ? '0px' : '12px',
}));

const StyledCardContent = styled(CardContent)(() => ({
  padding: '0px',
  marginTop: '32px',
}));

const StyledAvatar = styled(UserAvatar)(() => ({
  width: '72px',
  height: '72px',
  marginTop: '6px',
}));

const StyledStack = styled(Stack)(() => ({
  marginLeft: '24px',
  width: '100%',
  paddingRight: '20px',
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

const BioBox = styled(Box)(() => ({
  height: '96px',
}));

const BioTypography = styled(Typography)(({ theme }) => ({
  display: '-webkit-box',
  WebkitLineClamp: '4',
  WebkitBoxOrient: 'vertical',
  marginTop: '16px',
  color: theme.palette.grey[600],
}));

const StyledBox = styled(Box)`
  display: flex;
  align-items: center;
  margin-top: 2px;
`;

const StyledLikeIcon = styled(LikeIcon)(({ theme }) => ({
  width: '16px',
  height: '16px',
  stroke: theme.palette.grey[600],
  strokeWidth: 1.5,
  fill: 'none',
}));

const StyledLocationIcon = styled(LocationIcon)(({ theme }) => ({
  width: '16px',
  height: '16px',
  fill: theme.palette.grey[600],
  marginLeft: '10px',
}));

const ThumbPercentTypography = styled(Typography)(() => ({
  marginLeft: '4px',
  paddingTop: '2px',
}));

const CountryTypography = styled(EllipsisTypography)(({ theme }) => ({
  color: theme.palette.grey[600],
}));

const PricingBox = styled(Box)(({ theme }) => ({
  height: '58px',
  backgroundColor: theme.palette.grey[100],
  borderRadius: '8px',
}));

const PricingLabelTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[600],
  paddingTop: '8px',
  paddingLeft: '8px',
  display: 'block',
}));

const PricingValueTypography = styled(Typography)(() => ({
  paddingLeft: '8px',
  display: 'block',
}));

const SkillsBox = styled(Box)(() => ({
  marginTop: '21px',
  height: '19px',
  display: 'flex',
  width: '100%',
  overflowX: 'scroll',
  overflowY: 'hidden',
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  height: '19px',
  marginRight: '8px',
  backgroundColor: theme.palette.grey[100],
  borderRadius: '64px',
}));

export default function VerticalUserCard(props: IVerticalUserCardProps) {
  const theme = useTheme();
  const ref = useRef(null);
  const [cardMediaHeight, setCardMediaHeight] = useState(250);
  const inViewport = useIntersection(ref, `-${cardMediaHeight - 150}px`);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  if (inViewport) {
    props.onListViewUsers(props.users.id);
  }
  const mediaRef = useCallback((node: HTMLImageElement | null) => {
    if (node !== null) {
      setCardMediaHeight(node.height);
    }
  }, []);

  const featuredFile = props.users.portfolioFiles.find(f => f.isFeatured);
  const featuredPictureURL = featuredFile
    ? `${featuredFile.directory}/${featuredFile.id}_featured${featuredFile.extension}`
    : '';

  return (
    <StyledCard ref={ref} onClick={() => props.onClickUserCard(props.users.id)} isMobile={isMobile}>
      <CardMedia
        ref={mediaRef}
        component="img"
        alt=""
        src={`${process.env.REACT_APP_CDN_URL ?? ''}/${profileContainer}/${featuredPictureURL}`}
        sx={{ borderRadius: '8px' }}
      />
      <StyledCardContent>
        <Grid container>
          <Grid item>
            <StyledAvatar userId={props.users.id} displayName={`${props.users.firstName} ${props.users.lastName}`} />
          </Grid>
          <Grid item sx={{ flex: '1' }}>
            <StyledStack direction="column">
              <EllipsisWrapperDiv>
                <EllipsisTypography
                  variant="body2"
                  sx={{ color: theme.palette.primary[500] }}
                  title={props.users.title}
                >
                  {props.users.title}
                </EllipsisTypography>
              </EllipsisWrapperDiv>
              <EllipsisWrapperDiv>
                <EllipsisTypography variant="h6" title={props.users.firstName + ' ' + props.users.lastName}>
                  {props.users.firstName} {props.users.lastName}
                </EllipsisTypography>
              </EllipsisWrapperDiv>
              <StyledBox>
                <StyledLikeIcon />
                <ThumbPercentTypography variant="caption">100%</ThumbPercentTypography>
                <StyledLocationIcon />
                <EllipsisWrapperDiv sx={{ marginLeft: '4px', paddingTop: '2px' }}>
                  <CountryTypography variant="caption" title={props.users.country}>
                    {props.users.country}
                  </CountryTypography>
                </EllipsisWrapperDiv>
              </StyledBox>
            </StyledStack>
          </Grid>
        </Grid>

        <Grid container sx={{ marginTop: '16px' }} alignItems="center" spacing={1}>
          <Grid item xs={6}>
            <PricingBox>
              <PricingLabelTypography variant="caption">Packages from:</PricingLabelTypography>
              {props.users.packagesFrom !== undefined && props.users.packagesFrom !== '-' && (
                <PricingValueTypography variant="body2">${props.users.packagesFrom}</PricingValueTypography>
              )}
              {props.users.packagesFrom === undefined ||
                (props.users.packagesFrom === '-' && (
                  <PricingValueTypography variant="body2">N/A</PricingValueTypography>
                ))}
            </PricingBox>
          </Grid>
          <Grid item xs={6}>
            <PricingBox>
              <PricingLabelTypography variant="caption">Hourly Rate:</PricingLabelTypography>
              <PricingValueTypography variant="body2">${props.users.hourlyRate} / h</PricingValueTypography>
            </PricingBox>
          </Grid>
        </Grid>

        <BioBox>
          <BioTypography textOverflow="ellipsis" variant="body2" overflow="hidden">
            {props.users.bio}
          </BioTypography>
        </BioBox>
        <SkillsBox>
          {props.users.skills.map((p: ISkill, index: number) => [
            <StyledChip key={index} label={<Typography variant="caption">{p.value}</Typography>} size="small" />,
          ])}
        </SkillsBox>
      </StyledCardContent>
    </StyledCard>
  );
}
