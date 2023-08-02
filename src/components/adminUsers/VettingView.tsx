import VisibilityIcon from '@mui/icons-material/Visibility';
import { Tooltip } from '@mui/material';
import { formatDistance } from 'date-fns';

interface VettingViewProps {
  viewedOn: string;
}
export const VettingView = ({ viewedOn }: VettingViewProps) => {
  const timeDiffInMs = new Date().getTime() - new Date(viewedOn).getTime();
  const timeDiffInMins = timeDiffInMs / 1000 / 60;
  if (timeDiffInMins > 5) {
    return <></>;
  }

  const timeDistance = formatDistance(new Date(viewedOn), new Date(), { addSuffix: true });
  return (
    <Tooltip title={`Last viewed ${timeDistance}`}>
      <VisibilityIcon sx={{ fontSize: 14, ml: 1 }} color="primary" />
    </Tooltip>
  );
};
