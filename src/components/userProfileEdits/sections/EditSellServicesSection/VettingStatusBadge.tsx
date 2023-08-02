import { GppGood, GppMaybe, GppBad, SafetyCheck, SvgIconComponent } from '@mui/icons-material';
import { Stack, Tooltip, Typography, styled } from '@mui/material';
import { VettingStatus } from 'global/enums/vettingStatus';

interface IVettingStatusBadgeProps {
  vettingStatus: VettingStatus;
}

interface IVettingStatusDescription {
  icon: SvgIconComponent;
  label: string;
  color: 'inherit' | 'disabled' | 'primary' | 'error' | 'warning';
  description: string;
}

const StyledStack = styled(Stack)`
  border-left: 3px solid ${({ theme }) => theme.palette.grey[500]};
`;

const iconsByVettingStatus: Record<VettingStatus, IVettingStatusDescription> = {
  [VettingStatus.NotSubmitted]: {
    icon: GppGood,
    label: 'Not submitted',
    color: 'disabled',
    description: 'You need to submit your profile for approval before actively selling services.',
  },
  [VettingStatus.Approved]: {
    icon: GppGood,
    label: 'Approved',
    color: 'primary',
    description: 'You are visible under seller listing and can actively sell services.',
  },
  [VettingStatus.UpdatesRequired]: {
    icon: GppMaybe,
    label: 'Updates Required',
    color: 'warning',
    description: 'Please update your profile according to the comments that you received.',
  },
  [VettingStatus.Rejected]: {
    icon: GppBad,
    label: 'Rejected',
    color: 'error',
    description: "Unfortunately you can't sell services.",
  },
  [VettingStatus.InProgress]: {
    icon: SafetyCheck,
    label: 'In-progress',
    color: 'inherit',
    description: 'Your profile is being reviewed. You will be contacted shortly.',
  },
};

export const VettingStatusBadge = ({ vettingStatus }: IVettingStatusBadgeProps): JSX.Element => {
  const iconDescription = iconsByVettingStatus[vettingStatus];
  const VettingIcon: SvgIconComponent = iconDescription.icon;
  return (
    <StyledStack direction="row" alignItems="center" sx={{ my: 2 }}>
      <Tooltip title={iconDescription.label}>
        <VettingIcon color={iconDescription.color} sx={{ fontSize: 32, m: 1 }} />
      </Tooltip>
      <Typography variant="h6">{iconDescription.description}</Typography>
    </StyledStack>
  );
};
