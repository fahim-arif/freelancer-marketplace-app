import { debounce, Grid, TextField } from '@mui/material';
import { IFrontUserFilters } from 'global/interfaces/user';
import { useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFormik } from 'formik';
import { nameof } from 'ts-simple-nameof';

interface IFilterFormProps {
  search?: string;
}

const mapToSearchParams = (formProps: IFilterFormProps): URLSearchParams => {
  const newSearchParams = new URLSearchParams();
  Object.entries(formProps).forEach(([key, value]) => {
    if (value) {
      newSearchParams.append(key, value);
    }
  });
  return newSearchParams;
};

const mapToFormProps = (searchParams: URLSearchParams): IFilterFormProps => ({
  search: searchParams.get(nameof<IFilterFormProps>(p => p.search)) ?? undefined,
});

interface ISkillFiltersProps {
  onFilterChange: (filters: IFrontUserFilters) => void;
}

export const SkillFilters = ({ onFilterChange }: ISkillFiltersProps) => {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const formProps = mapToFormProps(searchParams);
    onFilterChange({ ...formProps });
  }, [searchParams]);

  const form = useFormik<IFilterFormProps>({
    initialValues: mapToFormProps(searchParams),
    onSubmit: values => {
      const newSearchParams = mapToSearchParams(values);
      setSearchParams(newSearchParams);
    },
  });

  const debouncedSubmit = useCallback(
    debounce(() => form.submitForm(), 300),
    [form.submitForm],
  );

  useEffect(() => {
    if (form.initialValues != form.values) {
      debouncedSubmit();
    }
  }, [debouncedSubmit, form.values.search]);

  return (
    <Grid container spacing={1} alignItems="center">
      <Grid item xs={6} sm={4} md={3}>
        <TextField
          id="search"
          value={form.values.search ?? ''}
          onChange={form.handleChange}
          label="Search"
          placeholder="Search"
          fullWidth
        />
      </Grid>
    </Grid>
  );
};
