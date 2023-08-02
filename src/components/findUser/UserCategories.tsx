import { Chip, Grid, Typography, styled, useMediaQuery, useTheme } from '@mui/material';
import CategoryLookups from 'json/CategoryLookups.json';

const StyledChip = styled(Chip)(({ theme }) => ({
  height: '28px',

  backgroundColor: theme.palette.primary[500],
  borderRadius: '16px',
  color: theme.palette.common.white,
  cursor: 'pointer',
  padding: '4px 12px',
}));

interface CategoryGridProps {
  isMobile: boolean;
}

const CategoryGrid = styled(Grid, {
  // Configure which props should be forwarded on DOM
  shouldForwardProp: prop => prop !== 'isMobile',
})<CategoryGridProps>(({ isMobile }) => ({
  paddingTop: isMobile ? '36px' : '56px',
  paddingBottom: isMobile ? '36px' : '56px',
  paddingLeft: isMobile ? '0px' : '12px',
  alignItems: 'center',
  display: 'flex',
  width: '100%',
}));

export default function UserCategories() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <CategoryGrid isMobile={isMobile} container direction="row" justifyContent="flex-start" spacing={1}>
        {CategoryLookups.map((p, index: number) => [
          <Grid item key={index}>
            <StyledChip
              label={<Typography variant={isMobile ? 'caption' : 'subtitle2'}>{p.label}</Typography>}
              size="small"
            />
          </Grid>,
        ])}
      </CategoryGrid>
    </>
  );
}
