import { Avatar, Button, Chip, Grid, Paper, Stack, Typography } from '@mui/material';
import { IFrontUserBase } from 'global/interfaces/user';
import PlaceIcon from '@mui/icons-material/Place';
import { Box } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { UserAvatar } from 'components/common/UserAvatar';

interface IHorizontalUserCardProps {
  user: IFrontUserBase;
}

export const HorizontalUserCard = ({ user }: IHorizontalUserCardProps) => {
  const navigate = useNavigate();

  const onUserClick = () => {
    navigate(`/users/${user.id}`);
  };

  const featuredFile = user.portfolioFiles.find(f => f.isFeatured);
  const featuredPictureURL = featuredFile
    ? `${featuredFile.directory}/${featuredFile.id}_featured${featuredFile.extension}`
    : '';

  return (
    <Paper>
      <Grid container direction="row" alignItems="flex-start" padding={{ xs: 0.5, sm: 1, md: 2 }}>
        <Grid item xs={12} md={9} container rowSpacing={1}>
          <Grid item container direction="row" xs={12} alignItems="flex-start">
            <Grid
              item
              xs={4}
              sm={3}
              md={2}
              paddingX={{ xs: 0.5, sm: 1, md: 2 }}
              container
              alignItems="center"
              justifyContent="center"
            >
              <UserAvatar
                userId={user.id}
                displayName={`${user.firstName} ${user.lastName}`}
                sx={{ width: '72px', height: '72px' }}
              />
            </Grid>
            <Grid item xs={8} sm={9} md={10} container alignItems="flex-start">
              <Grid item xs={12}>
                <Typography color="primary">{user.title}</Typography>
              </Grid>
              <Grid item xs={12} container direction="row" alignItems="center">
                <Grid item container xs={12} sm={9} md={10}>
                  <Grid item xs={12} sx={{ my: 1 }}>
                    <Typography sx={{ fontSize: 20, lineHeight: 1, fontWeight: 600 }}>
                      {user.firstName} {user.lastName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <PlaceIcon sx={{ fontSize: 12 }} /> {user.country}
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={3} md={2}>
                  <Button variant="outlined" onClick={onUserClick}>
                    Visit profile
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item container direction="row" alignItems="flex-start">
            <Grid item xs={4} sm={3} md={2} container rowSpacing={1} paddingX={{ xs: 0.5, sm: 1, md: 2 }}>
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: '#F3F4F6',
                    fontSize: 12,
                    borderRadius: 1,
                    p: 1,
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontSize: 12, color: '#4B5563' }}>
                    Packages from:
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: 14, color: '#111827' }}>
                    ${user.packagesFrom}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: '#F3F4F6',
                    fontSize: 12,
                    borderRadius: 1,
                    p: 1,
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontSize: 12, color: '#4B5563' }}>
                    Hourly rate
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: 14, color: '#111827' }}>
                    ${user.hourlyRate} / h
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            <Grid item xs={8} sm={9} md={10} container>
              <Grid item xs={12}>
                <Typography variant="body1" sx={{ fontSize: 14, color: '#111827' }}>
                  {user.bio}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" flexWrap="wrap" sx={{ mt: 1 }}>
                  {user.skills.map((skill, i) => (
                    <Chip
                      key={`${user.id}_skills_${i}`}
                      size="small"
                      sx={{ fontWeight: 600, fontSize: 12, mt: 1, mr: 1 }}
                      label={skill.value}
                    />
                  ))}
                </Stack>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={3} display={{ xs: 'none', sm: 'none', md: 'block' }}>
          <Avatar
            src={`${process.env.REACT_APP_CDN_URL}/profile/${featuredPictureURL}`}
            variant="square"
            sx={{ width: '100%', height: 'auto' }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};
