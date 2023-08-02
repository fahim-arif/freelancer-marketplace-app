import { LoadingButton } from '@mui/lab';
import { styled } from '@mui/material';

export const GreyButton = styled(LoadingButton)(({ theme }) => ({
  color: theme.palette.grey[900],
  borderColor: theme.palette.grey[300],
  '&:hover': {
    borderColor: theme.palette.grey[300],
    backgroundColor: '#FCFCFD',
  },
}));
