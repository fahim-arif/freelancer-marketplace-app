import { Chip, Grid, Typography, styled, useTheme } from '@mui/material';
import { IFrontUser } from 'global/interfaces/user';

interface IUserSkillsProps {
  user: IFrontUser;
}

const StyledChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.primary[600],
  paddingLeft: '2px',
  paddingRight: '2px',
}));

export default function UserSkills({ user }: IUserSkillsProps) {
  const theme = useTheme();
  return (
    <Grid container direction="row" justifyContent="flex-start" alignItems="center" rowSpacing={0.5} columnSpacing={1}>
      {user.skills.map((skill, i) => (
        <Grid item key={i}>
          <StyledChip
            label={
              <Typography variant="caption" color={theme.palette.common.white}>
                {skill.value}
              </Typography>
            }
            size="small"
          />
        </Grid>
      ))}
    </Grid>
  );
}
