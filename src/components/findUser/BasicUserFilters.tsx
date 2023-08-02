import { Grid, SelectChangeEvent } from '@mui/material';
import CategorySelect from 'components/common/Select/CategorySelect';
import { IFrontUserFilters } from 'global/interfaces/user';
import { useState } from 'react';

interface IBasicUserFiltersProps {
  onChange: (filters: IFrontUserFilters) => void;
}

export default function BasicUserFilters(props: IBasicUserFiltersProps) {
  const [filters, setFilters] = useState<IFrontUserFilters>({ category: '' });

  const handleCategoryChange = (val: string): void => {
    setFilters({ ...filters, category: val });
    props.onChange({ ...filters, category: val });
  };

  return (
    <Grid container mt={2}>
      <Grid item xs={12} sm={4} md={3} lg={2}>
        <CategorySelect
          value={filters.category}
          label="Category"
          onChange={(e: SelectChangeEvent<any>) => handleCategoryChange(e.target.value)}
        />
      </Grid>
    </Grid>
  );
}
