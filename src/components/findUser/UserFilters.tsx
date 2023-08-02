import { debounce, FormControlLabel, Grid, Switch, TextField, Typography } from '@mui/material';
import CategorySelect from 'components/common/Select/CategorySelect';
import { IFrontUserFilters } from 'global/interfaces/user';
import { useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import DeliveryLookups from 'json/DeliveryLookups.json';
import FormSelect from 'components/common/Select/FormSelect';
import { useFormik } from 'formik';
import { nameof } from 'ts-simple-nameof';

interface IFilterFormProps {
  search?: string;
  category?: string;
  maxHourlyRate?: number;
  maxDeliveryMethod?: number;
  onlySellingServices?: boolean;
}

const mapToSearchParams = (formProps: IFilterFormProps): URLSearchParams => {
  const newSearchParams = new URLSearchParams();
  Object.entries(formProps).forEach(([key, value]) => {
    if (value !== undefined) {
      newSearchParams.append(key, value);
    }
  });
  return newSearchParams;
};

const mapToFormProps = (searchParams: URLSearchParams): IFilterFormProps => {
  const maxHourlyRate = searchParams.get(nameof<IFilterFormProps>(p => p.maxHourlyRate));
  const maxDeliveryMethod = searchParams.get(nameof<IFilterFormProps>(p => p.maxDeliveryMethod));
  const onlySellingServices = searchParams.get(nameof<IFilterFormProps>(p => p.onlySellingServices));

  return {
    search: searchParams.get(nameof<IFilterFormProps>(p => p.search)) ?? undefined,
    category: searchParams.get(nameof<IFilterFormProps>(p => p.category)) ?? undefined,
    maxHourlyRate: maxHourlyRate ? parseInt(maxHourlyRate) : undefined,
    maxDeliveryMethod: maxDeliveryMethod ? parseInt(maxDeliveryMethod) : undefined,
    onlySellingServices: onlySellingServices ? onlySellingServices === 'true' : undefined,
  };
};

interface IUserFiltersProps {
  onFilterChange: (filters: IFrontUserFilters) => void;
}

export const UserFilters = ({ onFilterChange }: IUserFiltersProps) => {
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

  useEffect(() => {
    if (form.initialValues != form.values) {
      form.submitForm();
    }
  }, [form.values.category, form.values.maxDeliveryMethod, form.values.onlySellingServices]);

  const debouncedSubmit = useCallback(
    debounce(() => form.submitForm(), 200),
    [form.submitForm],
  );

  useEffect(() => {
    if (form.initialValues != form.values) {
      debouncedSubmit();
    }
  }, [debouncedSubmit, form.values.search, form.values.maxHourlyRate]);

  const onlySellingServices = form.values.onlySellingServices ?? true;

  return (
    <Grid container spacing={1} alignItems="center">
      <Grid item xs={12} sm={12} md={2} lg={1}>
        <Typography variant="h6">Filter by</Typography>
      </Grid>
      <Grid item xs={6} sm={3} md={2}>
        <TextField
          id="search"
          value={form.values.search ?? ''}
          onChange={form.handleChange}
          label="Search"
          placeholder="Search"
          fullWidth
        />
      </Grid>
      <Grid item xs={6} sm={3} md={2}>
        <CategorySelect
          id="category"
          name="category"
          value={form.values.category ?? ''}
          onChange={form.handleChange}
          label="Category"
          fullWidth
        />
      </Grid>
      <Grid item xs={6} sm={3} md={2}>
        <TextField
          id="maxHourlyRate"
          value={form.values.maxHourlyRate ?? ''}
          onChange={form.handleChange}
          label="Max Hourly rate"
          placeholder="Max Hourly rate"
          type="number"
          InputProps={{ inputProps: { min: 0 } }}
          fullWidth
        />
      </Grid>
      <Grid item xs={6} sm={3} md={2}>
        <FormSelect
          id="maxDeliveryMethod"
          name="maxDeliveryMethod"
          value={form.values.maxDeliveryMethod ?? ''}
          onChange={form.handleChange}
          label="Max Delivery"
          items={[{ id: '', label: 'None' }, ...DeliveryLookups]}
          fullWidth
        />
      </Grid>
      <Grid item container xs={6} md={2} lg={2} alignItems="center">
        <FormControlLabel
          control={
            <Switch
              onChange={() => form.setFieldValue('onlySellingServices', !onlySellingServices)}
              name="onlySellingServices"
              checked={onlySellingServices}
            />
          }
          label="Sellers only"
        />
      </Grid>
    </Grid>
  );
};
