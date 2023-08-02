import { Box, Typography } from '@mui/material';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';

export default function NoWorkHistoryIcon(): JSX.Element {
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
      <Box>
        <Typography
          color={'grey'}
          sx={{
            textAlign: 'center',
          }}
        >
          Work history is empty
        </Typography>
        <WorkHistoryIcon
          sx={{
            width: '100%',
            height: 'auto',
          }}
          color={'disabled'}
        ></WorkHistoryIcon>
      </Box>
    </Box>
  );
}
