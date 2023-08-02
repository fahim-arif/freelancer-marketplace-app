import { Box, Typography, styled, useMediaQuery, useTheme } from '@mui/material';
import { IFrontUser } from 'global/interfaces/user';
import { BorderedBox } from '../common/BorderedBox';

interface IUserHourlyRateSectionProps {
  user: IFrontUser;
  setDrawer: () => void;
}

const JustifiedFlexBox = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export default function UserHourlyRateSection(props: IUserHourlyRateSectionProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <BorderedBox showBorder={!isMobile}>
      <JustifiedFlexBox>
        <Typography variant="subtitle1" color={theme.palette.grey[900]}>
          Hourly Rate
        </Typography>
        <Typography variant="subtitle1" color={theme.palette.grey[600]}>
          $ {props.user.hourlyRate} / Hour
        </Typography>
      </JustifiedFlexBox>
    </BorderedBox>
  );
}
