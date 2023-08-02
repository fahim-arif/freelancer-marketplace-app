import { Typography } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

interface IProgressDialog {
  showLoading: boolean;
  showSuccess: boolean;
  successMessage?: string;
}

export default function ProgressDialog(props: IProgressDialog): JSX.Element {
  return props.showLoading ? (
    <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={true}>
      <CircularProgress size={'8rem'} />
    </Backdrop>
  ) : (
    <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={true}>
      <Typography textAlign={'center'} variant="h3" component="div">
        {props.successMessage ?? 'Saved Successfully'}
      </Typography>
    </Backdrop>
  );
}
