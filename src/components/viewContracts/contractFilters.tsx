import { Button, debounce, Grid, styled, SwipeableDrawer, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useFormik } from 'formik';
import { ContractStatus, IContractFilters } from 'global/interfaces/contract';
import { IModel } from 'global/interfaces/model';
import { nameof } from 'ts-simple-nameof';
import { mapToSearchParams } from 'utils/search';
import { useSearchParams } from 'react-router-dom';
import { useCallback, useEffect } from 'react';
import { SelectItem } from 'global/interfaces/selects';
import FormSelect from 'components/common/Select/FormSelect';
import { IConnection } from 'global/interfaces/connection';

interface IContractFilterValue extends IModel<string> {
  userId?: string;
  status?: string;
}

interface IContractFilterProps {
  onFilterChange: (filters: IContractFilters) => void;
  connections: IConnection[];
  mobileDrawer: boolean;
  setMobileDrawer: (value: boolean) => void;
}

const mapToFormProps = (searchParams: URLSearchParams): IContractFilterValue => ({
  userId: searchParams.get(nameof<IContractFilterValue>(p => p.userId)) ?? undefined,
  status: searchParams.get(nameof<IContractFilterValue>(p => p.status)) ?? undefined,
});

const defaultSelectValue = -1;

const StyledMobileGridContent = styled(Grid)(() => ({
  marginTop: 0,
  padding: '24px',
}));
const StyledMobileDrawer = styled(SwipeableDrawer)(() => ({
  '& .MuiPaper-root': {
    borderTopLeftRadius: '20px',
    borderTopRightRadius: '20px',
  },
}));

export const ContractFilters: React.FC<IContractFilterProps> = ({ onFilterChange, connections, ...props }) => {
  const isMobileScreen = useMediaQuery(useTheme().breakpoints.down('sm'));
  const [searchParams, setSearchParams] = useSearchParams();

  const form = useFormik<IContractFilterValue>({
    initialValues: { userId: '', status: '' },
    onSubmit: values => {
      const newSearchParams = mapToSearchParams(values);
      setSearchParams(newSearchParams);
    },
  });

  useEffect(() => {
    const formProps = mapToFormProps(searchParams);
    onFilterChange({ ...formProps });
    form.setValues(formProps);
  }, [searchParams]);

  return (
    <>
      {isMobileScreen ? (
        <>
          <MobileContractFilters
            {...props}
            onFilterChange={onFilterChange}
            connections={connections}
            form={form}
            searchParams={searchParams}
            setSearchParams={setSearchParams}
          />
        </>
      ) : (
        <DesktopContractFilters
          {...props}
          onFilterChange={onFilterChange}
          connections={connections}
          form={form}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
        />
      )}
    </>
  );
};

export const DesktopContractFilters: React.FC<FilterWithFormProps> = ({
  connections,
  searchParams,
  setSearchParams,
}) => {
  const form = useFormik<IContractFilterValue>({
    initialValues: { userId: '', status: '' },
    onSubmit: values => {
      const newSearchParams = mapToSearchParams(values);
      setSearchParams(newSearchParams);
    },
  });

  useEffect(() => {
    mapContractStatusesToJson();
    if (form.initialValues != form.values) {
      form.submitForm();
    }
  }, [form.values.userId, form.values.status]);

  const debouncedSubmit = useCallback(
    debounce(() => {
      form.submitForm();
    }, 200),
    [form.submitForm, searchParams],
  );

  useEffect(() => {
    if (form.initialValues != form.values) {
      debouncedSubmit();
    }
  }, [debouncedSubmit, form.values.userId, form.values.status]);

  return (
    <Grid container spacing={1} alignItems="center">
      <Grid item xs={6} sm={4} md={4}>
        <FormSelect
          name="userId"
          defaultValue={defaultSelectValue}
          value={form.values.userId ?? ''}
          onChange={form.handleChange}
          label="Other party..."
          fullWidth
          items={mapConnectionsToSelect(connections)}
        />
      </Grid>
      <Grid item xs={6} sm={4} md={4}>
        <FormSelect
          name="status"
          defaultValue={defaultSelectValue}
          value={form.values.status ?? ''}
          onChange={form.handleChange}
          label="Status"
          fullWidth
          items={mapContractStatusesToJson()}
        />
      </Grid>
      <Grid item xs={6} sm={4} md={4}>
        <Button
          color="primary"
          onClick={() => {
            setSearchParams(undefined);
            form.resetForm(undefined);
          }}
        >
          <Typography variant="body2" color="primary">
            Reset
          </Typography>
        </Button>
      </Grid>
    </Grid>
  );
};

interface FilterWithFormProps extends IContractFilterProps {
  form: ReturnType<typeof useFormik>;
  searchParams: URLSearchParams;
  setSearchParams: (searchParams: URLSearchParams | undefined) => void;
}

const MobileContractFilters: React.FC<FilterWithFormProps> = ({ form, connections, mobileDrawer, setMobileDrawer }) => (
  <StyledMobileDrawer
    anchor="bottom"
    open={mobileDrawer}
    onClose={() => setMobileDrawer(false)}
    onOpen={() => console.log('open')}
  >
    <Grid xs={12}>
      <StyledMobileGridContent>
        <Grid container item xs={12} justifyContent="space-between" alignItems="center" spacing={2}>
          <Grid item xs={12} container justifyContent="space-between">
            <Typography variant="h6">Filters</Typography>
            <Button
              color="primary"
              onClick={() => {
                form.resetForm();
                form.submitForm();
              }}
            >
              <Typography variant="body2" color="primary">
                Clear filters
              </Typography>
            </Button>
          </Grid>
          <Grid item xs={12}>
            <FormSelect
              name="userId"
              defaultValue={defaultSelectValue}
              value={form.values.userId ?? ''}
              onChange={form.handleChange}
              label="Other party..."
              fullWidth
              items={mapConnectionsToSelect(connections)}
            />
          </Grid>
          <Grid item xs={12}>
            <FormSelect
              name="status"
              defaultValue={defaultSelectValue}
              value={form.values.status ?? ''}
              onChange={form.handleChange}
              label="Status"
              fullWidth
              items={mapContractStatusesToJson()}
            />
          </Grid>
          <Grid item xs={12} spacing={2} container justifyContent="space-between">
            <Grid item xs={6}>
              <Button variant="outlined" fullWidth onClick={() => setMobileDrawer(false)}>
                Cancel
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => {
                  form.submitForm();
                  setMobileDrawer(false);
                }}
              >
                Apply filters
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </StyledMobileGridContent>
    </Grid>
  </StyledMobileDrawer>
);

const mapContractStatusesToJson = (): SelectItem[] => {
  const models: SelectItem[] = [];

  Object.keys(ContractStatus).forEach(field => {
    models.push({ id: field, label: ContractStatus[field as keyof typeof ContractStatus] });
  });

  return models;
};

const mapConnectionsToSelect = (connections: IConnection[]): SelectItem[] => {
  if (connections.length <= 0) {
    return [{ id: defaultSelectValue, label: 'No connections available' }];
  }

  return connections.map(c => ({
    id: c?.otherUser?.userId ?? defaultSelectValue,
    label: c?.otherUser?.displayName ?? '',
  }));
};
