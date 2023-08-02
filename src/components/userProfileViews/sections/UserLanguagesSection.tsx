import { Box, Grid, Typography, styled, useMediaQuery, useTheme } from '@mui/material';
import { IFrontUser } from 'global/interfaces/user';
import { BorderedBox } from '../common/BorderedBox';
import LanguageIcon from '@mui/icons-material/Language';

const JustifiedFlexBox = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledLanguageIcon = styled(LanguageIcon)`
  margin-right: ${({ theme }) => theme.spacing(1)};
  color: ${({ theme }) => theme.palette.grey[600]};
`;

const TitleTypography = styled(Typography)`
  color: ${({ theme }) => theme.palette.grey[900]};
  font-weight: 600;
`;

const LanguageTypography = styled(Typography)`
  margin-right: ${({ theme }) => theme.spacing(1)};
  color: ${({ theme }) => theme.palette.grey[900]};
`;

const ProficiencyTypography = styled(Typography)`
  color: ${({ theme }) => theme.palette.grey[600]};
`;

interface IUserLanguagesSectionProps {
  user: IFrontUser;
}

export default function UserLanguagesSection({ user }: IUserLanguagesSectionProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <BorderedBox showBorder={!isMobile}>
      <JustifiedFlexBox>
        <Grid container spacing={1}>
          <Grid item xs={12} container alignItems="center">
            <StyledLanguageIcon />
            <TitleTypography variant="subtitle1">Languages</TitleTypography>
          </Grid>
          {user.languages.map((language, i) => (
            <Grid item xs={12} key={i} container alignItems="center">
              <LanguageTypography variant="subtitle2">{language.language}:</LanguageTypography>
              <ProficiencyTypography variant="body2">{language.proficiency}</ProficiencyTypography>
            </Grid>
          ))}
        </Grid>
      </JustifiedFlexBox>
    </BorderedBox>
  );
}
