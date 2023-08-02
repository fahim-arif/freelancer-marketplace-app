import { Box, Typography } from '@mui/material';
import PermMediaIcon from '@mui/icons-material/PermMedia';

export default function NoFilesIcon(): JSX.Element {
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
          Portfolio is empty
        </Typography>
        <PermMediaIcon
          sx={{
            width: '85%',
            height: 'auto',
          }}
          color={'disabled'}
        ></PermMediaIcon>
      </Box>
    </Box>
  );
}
