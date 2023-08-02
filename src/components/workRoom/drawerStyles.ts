import { Grid, SwipeableDrawer, styled } from '@mui/material';

export const StyledSwipeableDrawer = styled(SwipeableDrawer)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    '& .MuiPaper-root': {
      borderTopLeftRadius: '20px',
      borderTopRightRadius: '20px',
    },
  },
}));

export const StyledDrawerGrid = styled(Grid)(({ theme }) => ({
  width: '100%',
  padding: '36px',

  [theme.breakpoints.up('sm')]: {
    width: '500px',
  },
  [theme.breakpoints.down('sm')]: {
    width: '100vw',
  },
}));

export const StyledGrid = styled(Grid)(() => ({
  marginTop: '16px',
}));
