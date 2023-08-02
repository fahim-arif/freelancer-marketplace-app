import { Box, Typography } from '@mui/material';
import FeaturedPlayListIcon from '@mui/icons-material/FeaturedPlayList';

export default function NoUsersIcon(): JSX.Element {
  return (
    <Box
      sx={{
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'center',
        width: {
          xs: '60%',
          md: '20%',
        },
        margin: 'auto',
      }}
    >
      <Box textAlign={'center'}>
        <Typography color={'grey'}>No users against search criteria</Typography>

        <FeaturedPlayListIcon
          sx={{
            width: '65%',
            height: 'auto',
          }}
          color="disabled"
        ></FeaturedPlayListIcon>
      </Box>
    </Box>
  );
}
