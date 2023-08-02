import {
  Button,
  FormControl,
  FormGroup,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { FastField, FieldProps, FormikProps } from 'formik';
import { IFixedPackage, IEditableUser } from 'global/interfaces/user';
import React, { useEffect, useState } from 'react';
import { nameof } from 'ts-simple-nameof';
import { handleNumberChange, strictNumericCheck } from 'utils/inputs';
import { PricingPackagesContent } from './PricingPackagesContent';
import { PackageType } from 'global/enums/packageType';
import { StyledTab, StyledTabs } from 'components/common/StyledTabs/TabStyles';
import { Add, DeleteRounded } from '@mui/icons-material';
import CategorySelect from 'components/common/Select/CategorySelect';

export const defaultFixedPackage: IFixedPackage = {
  price: 0,
  deliverables: [''],
  license: '',
  custom: '',
};

export interface IPricingEditorProps {
  form: FormikProps<IEditableUser>;
}

export const PricingEditor = ({ form }: IPricingEditorProps) => {
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    if (form.isSubmitting && form.touched.fixedPackages && form.errors.fixedPackages) {
      const tabsWithErrors = Object.entries(form.errors.fixedPackages)
        .filter(([_, value]) => value)
        .map(([key]) => key);
      const tabWithErrorIndex = +tabsWithErrors[0];

      if (tabIndex !== tabWithErrorIndex) {
        setTabIndex(tabWithErrorIndex);
      }
    }
  }, [form.isSubmitting, form.errors.fixedPackages, form.touched.fixedPackages, tabIndex]);

  const fixedPackages = form.values.fixedPackages;
  const isFixedPackageDefined = fixedPackages !== undefined;
  const fixedPackageLength: number = fixedPackages.length;
  const fixedPackageIndex = fixedPackageLength - 1;

  const handleChange = (_: React.SyntheticEvent, newValue: number): void => {
    setTabIndex(newValue);
  };

  const addTab = (): void => {
    if (fixedPackageLength < PackageType.Loudest + 1) {
      const updatedFixedPackages = fixedPackages;
      updatedFixedPackages.push(defaultFixedPackage);
      form.setFieldValue(
        nameof<IEditableUser>(x => x.fixedPackages),
        updatedFixedPackages,
      );
    }

    if (fixedPackageLength === PackageType.Loud) {
      setTabIndex(PackageType.Loud);
    }
  };

  const removeTab = (): void => {
    if (fixedPackageLength > PackageType.Loud) {
      const updatedFixedPackages = fixedPackages;
      updatedFixedPackages.pop();

      if (tabIndex === fixedPackageLength - 1) {
        setTabIndex(tabIndex - 1);
      }

      form.setFieldValue(
        nameof<IEditableUser>(x => x.fixedPackages),
        updatedFixedPackages,
      );
    }
  };

  return (
    <Grid container>
      <Grid item xs={12} sx={{ mt: 4, mb: 2 }}>
        <Typography variant="h6">Categories</Typography>
      </Grid>
      <Grid item xs={12} sm={6} sx={{ pr: 1 }}>
        <FormGroup>
          <FormControl sx={{ my: 1 }}>
            <FastField name={`${nameof<IEditableUser>(x => x.mainCategory)}`}>
              {({ field, form: { handleChange }, meta }: FieldProps) => (
                <CategorySelect
                  value={field.value ?? ''}
                  name={field.name}
                  onChange={handleChange}
                  label="Main Category"
                  variant={'outlined'}
                  error={meta.touched && Boolean(meta.error)}
                  helpertext={meta.touched ? meta.error : ''}
                />
              )}
            </FastField>
          </FormControl>
        </FormGroup>
      </Grid>
      <Grid item xs={12} sm={6} sx={{ pr: 1 }}>
        <FormGroup>
          <FormControl sx={{ my: 1 }}>
            <FastField name={`${nameof<IEditableUser>(x => x.secondCategory)}`}>
              {({ field, form: { handleChange } }: FieldProps) => (
                <CategorySelect
                  value={field.value ?? ''}
                  name={field.name}
                  onChange={handleChange}
                  label="Second Category"
                  variant={'outlined'}
                />
              )}
            </FastField>
          </FormControl>
        </FormGroup>
      </Grid>

      <Grid item xs={12} sx={{ mt: 4, mb: 1 }}>
        <Typography variant="h6">Hourly rate</Typography>
      </Grid>
      <Grid item xs={12} sm={3} md={3}>
        <FormGroup>
          <FormControl>
            <FastField name={nameof<IEditableUser>(x => x.hourlyRate)}>
              {({ field, meta }: FieldProps) => (
                <TextField
                  name={field.name}
                  value={field.value === 0 ? '' : field.value ?? ''}
                  onChange={e => handleNumberChange(e, form.handleChange)}
                  type="number"
                  onKeyDown={strictNumericCheck}
                  error={meta.touched && Boolean(meta.error)}
                  helperText={meta.touched ? meta.error : ''}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  inputProps={{ inputMode: 'numeric', min: 0 }}
                  variant={'outlined'}
                />
              )}
            </FastField>
          </FormControl>
        </FormGroup>
      </Grid>
      <Grid item xs={12} sx={{ mt: 4 }}>
        <Typography variant="h6">Fixed Price Package</Typography>
      </Grid>
      <Grid item xs={12} sx={{ mb: 1 }}>
        <Typography variant="subtitle2" sx={{ fontStyle: 'italic' }}>
          Optional. Gives you more visibility on Shoutt. Max 3.
        </Typography>
        {form.errors.fixedPackages !== undefined && typeof form.errors.fixedPackages === 'string' ? (
          <FormHelperText error>{form.errors.fixedPackages}</FormHelperText>
        ) : null}
      </Grid>
      <Grid item container xs={12} spacing={1}>
        <Grid
          item
          xs={fixedPackageLength === PackageType.Loud + 1 ? 12 : fixedPackageLength === 0 ? 12 : 11}
          sm={fixedPackageLength === PackageType.Loudest + 1 ? 11 : fixedPackageLength === 0 ? 12 : 8}
        >
          <StyledTabs value={tabIndex} onChange={handleChange}>
            {fixedPackageLength > PackageType.Loud && <StyledTab value={PackageType.Loud} label="Loud" />}
            {fixedPackageLength > PackageType.Louder && <StyledTab value={PackageType.Louder} label="Louder" />}
            {fixedPackageLength > PackageType.Loudest && <StyledTab value={PackageType.Loudest} label="Loudest" />}
          </StyledTabs>
        </Grid>
        {fixedPackageIndex >= PackageType.Loud && (
          <Grid item xs={1} container>
            <IconButton aria-label="delete" size="large" onClick={() => removeTab()}>
              <DeleteRounded fontSize="inherit" />
            </IconButton>
          </Grid>
        )}
        {fixedPackageIndex !== PackageType.Loudest && (
          <Grid item xs={12} sm={3} container>
            <Button aria-label="add" onClick={() => addTab()} variant="outlined" startIcon={<Add />} fullWidth>
              Add a fixed package
            </Button>
          </Grid>
        )}
      </Grid>

      {isFixedPackageDefined && fixedPackages.length !== 0 && (
        <PricingPackagesContent tabIndex={tabIndex} form={form} />
      )}
    </Grid>
  );
};
