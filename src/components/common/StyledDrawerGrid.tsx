import { Grid, styled } from '@mui/material';

export const StyledDrawerGrid = styled(Grid)(({ theme }) => ({
  width: '100%',
  padding: '24px',

  [theme.breakpoints.up('sm')]: {
    width: '500px',
  },
  [theme.breakpoints.down('sm')]: {
    width: '100vw',
  },
}));
