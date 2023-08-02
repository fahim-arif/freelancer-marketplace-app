import { Button, Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { AuthContext, AuthType } from 'contexts/AuthContext';
import { useContext } from 'react';

export const PayoutDecider: React.FC = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext) as AuthType;

  return (
    <Grid container justifyContent="center">
      <Grid item xs={6}>
        <Typography textAlign="center" variant="h4">
          Yay, all done!
        </Typography>
        <Typography textAlign="center" variant="body1">
          Your account will be reviewed by our moderators. We will be in touch within 1-2 business days. Please add{' '}
          <strong>support@shoutt.co</strong> toyou contact list to ensure you receive our emaills. In the meantime, you
          can add your bank payout details or you can do this later.
        </Typography>

        <Grid container sx={{ marginTop: 5 }} spacing={1} justifyContent="center">
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              size="large"
              fullWidth
              onClick={() => navigate(`/users/${authContext.user?.id}`)}
            >
              View profile
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button type="submit" variant="contained" size="large" fullWidth onClick={() => navigate('/PayoutDetails')}>
              Payout details
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
