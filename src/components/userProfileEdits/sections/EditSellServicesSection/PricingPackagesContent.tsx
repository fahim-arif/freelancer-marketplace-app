import { Add, Close } from '@mui/icons-material';
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
import { FormTextFieldSelect } from 'components/common/Select/FormTextFieldSelect';
import { FastField, FieldProps, FormikProps } from 'formik';
import { LicenseType } from 'global/enums/licenseTypes';
import { IEditableUser } from 'global/interfaces/user';
import { nameof } from 'ts-simple-nameof';
import { handleNumberChange, strictNumericCheck } from 'utils/inputs';
import DeliveryLookups from 'json/DeliveryLookups.json';
import LicenseLookups from 'json/LicenseLookups.json';
import RevisionLookups from 'json/RevisionLookups.json';

interface IPricingPackagesContentProps {
  form: FormikProps<IEditableUser>;
  tabIndex: number;
}

export const PricingPackagesContent = ({ form, tabIndex }: IPricingPackagesContentProps) => {
  const removeRow = (index: number): void => {
    const current = form.values.fixedPackages[tabIndex].deliverables;
    current.splice(index, 1);
    form.setFieldValue(
      nameof<IEditableUser>(x => x.fixedPackages[tabIndex].deliverables),
      current,
    );
  };

  const addRow = (): void => {
    if (form.values.fixedPackages[0].deliverables[tabIndex] !== undefined) {
      if (form.values.fixedPackages[tabIndex].deliverables.length >= 3) {
        return;
      }

      form.setFieldValue(`${nameof<IEditableUser>(x => x.fixedPackages)}.[${tabIndex}].deliverables`, [
        ...form.values.fixedPackages[tabIndex].deliverables,
        '',
      ]);
      return;
    }
    form.setFieldValue(`${nameof<IEditableUser>(x => x.fixedPackages)}.[${tabIndex}].deliverables`, ['', '']);
  };

  const fp = form.values.fixedPackages[tabIndex];
  const touchedFp =
    form.touched.fixedPackages && form.touched.fixedPackages[tabIndex]
      ? form.touched.fixedPackages[tabIndex]
      : undefined;
  const errorFpNoType = form.errors.fixedPackages && form.errors.fixedPackages[tabIndex];
  const errorFp = typeof errorFpNoType === 'string' ? undefined : errorFpNoType;

  return (
    <>
      <Grid item xs={12} sx={{ mt: 2, mb: 1 }}>
        <Typography variant="subtitle1">Price</Typography>
      </Grid>
      <Grid item xs={12} sm={3} md={3}>
        <FormGroup>
          <FormControl>
            <FastField name={`${nameof<IEditableUser>(x => x.fixedPackages)}.[${tabIndex}].price`}>
              {({ field, form: { handleChange }, meta }: FieldProps) => (
                <TextField
                  value={field && field.value === 0 ? '' : field.value ?? ''}
                  type="number"
                  name={field.name}
                  onKeyDown={strictNumericCheck}
                  onChange={e => handleNumberChange(e, handleChange)}
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
      <Grid item xs={12} sm={12} sx={{ mt: 2, mb: 1 }}>
        <Typography variant="subtitle1">What&apos;s included?</Typography>
        <Typography variant="subtitle2" sx={{ fontStyle: 'italic' }}>
          Enter the main deliverables. Max 3, keep it short
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth>
          <Grid container>
            {fp.deliverables?.length > 0 &&
              fp.deliverables.map((item: string, index: number) => (
                <Grid item xs={12} container key={`${tabIndex}.deliverables.${index}`}>
                  <Grid item xs={12} sm={10}>
                    <FormGroup>
                      <FastField
                        name={`${nameof<IEditableUser>(x => x.fixedPackages)}.[${tabIndex}].deliverables.[${index}]`}
                      >
                        {({ field, form: { handleChange } }: FieldProps) => (
                          <TextField
                            name={field.name}
                            value={field.value}
                            onChange={handleChange}
                            variant={'outlined'}
                            sx={{ marginTop: '5px' }}
                          />
                        )}
                      </FastField>
                    </FormGroup>
                  </Grid>
                  {index == 0 && fp.deliverables?.length < 3 && (
                    <Grid item xs={2} sm={2}>
                      <FormGroup>
                        <FormControl>
                          <Button
                            size="large"
                            variant="outlined"
                            startIcon={<Add />}
                            onClick={() => addRow()}
                            sx={{ ml: 1 }}
                          >
                            Add
                          </Button>
                        </FormControl>
                      </FormGroup>
                    </Grid>
                  )}
                  {index > 0 && (
                    <Grid item sx={{ marginTop: { sm: '10px' } }}>
                      <IconButton
                        color="warning"
                        aria-label="remove option"
                        component="label"
                        onClick={() => removeRow(index)}
                      >
                        <Close />
                      </IconButton>
                    </Grid>
                  )}
                </Grid>
              ))}

            {touchedFp && touchedFp.deliverables && errorFp && errorFp.deliverables && (
              <FormHelperText error>{errorFp.deliverables}</FormHelperText>
            )}
          </Grid>
        </FormControl>
      </Grid>
      <Grid item xs={12} sx={{ mt: 2, mb: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          Terms
        </Typography>
      </Grid>
      <Grid item xs={12} container spacing={1}>
        <Grid item xs={12} sm={6} md={6}>
          <FormGroup>
            <FormControl>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Delivery
              </Typography>
              <FastField name={`${nameof<IEditableUser>(x => x.fixedPackages)}.[${tabIndex}].deliveryMethods`}>
                {({ field, form: { handleChange }, meta }: FieldProps) => (
                  <FormTextFieldSelect
                    value={field.value ?? ''}
                    name={field.name}
                    onChange={handleChange}
                    error={meta.touched && Boolean(meta.error)}
                    helperText={meta.touched ? meta.error : ''}
                    items={DeliveryLookups}
                    InputLabelProps={{ shrink: false }}
                    label="Select delivery"
                  />
                )}
              </FastField>
            </FormControl>
          </FormGroup>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <FormGroup>
            <FormControl>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Revisions
              </Typography>
              <FastField name={`${nameof<IEditableUser>(x => x.fixedPackages)}.[${tabIndex}].revisions`}>
                {({ field, form: { handleChange }, meta }: FieldProps) => (
                  <FormTextFieldSelect
                    value={field.value ?? ''}
                    name={field.name}
                    onChange={handleChange}
                    error={meta.touched && Boolean(meta.error)}
                    helperText={meta.touched ? meta.error : ''}
                    items={RevisionLookups}
                    InputLabelProps={{ shrink: false }}
                    label="Select revisions"
                  />
                )}
              </FastField>
            </FormControl>
          </FormGroup>
        </Grid>
        <Grid item xs={12}>
          <FormGroup>
            <FormControl>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                License
              </Typography>
              <FastField name={`${nameof<IEditableUser>(x => x.fixedPackages)}.[${tabIndex}].license`}>
                {({ field, form: { handleChange }, meta }: FieldProps) => (
                  <FormTextFieldSelect
                    value={field.value ?? ''}
                    name={field.name}
                    onChange={handleChange}
                    error={meta.touched && Boolean(meta.error)}
                    helperText={meta.touched ? meta.error : ''}
                    items={LicenseLookups}
                    InputLabelProps={{ shrink: false }}
                    label="Select license"
                  />
                )}
              </FastField>
            </FormControl>
          </FormGroup>
        </Grid>
        {form.values.fixedPackages[tabIndex] !== undefined &&
          form.values.fixedPackages[tabIndex].license === LicenseType.Custom && (
            <Grid item xs={12}>
              <FormGroup>
                <FormControl>
                  <FastField name={`${nameof<IEditableUser>(x => x.fixedPackages)}.[${tabIndex}].custom`}>
                    {({ field, form: { handleChange }, meta }: FieldProps) => (
                      <TextField
                        name={field.name}
                        value={field.value ?? ''}
                        onChange={handleChange}
                        label="Custom License"
                        error={meta.touched && Boolean(meta.error)}
                        helperText={meta.touched && errorFp ? meta.error : ''}
                        multiline
                        rows={8}
                      />
                    )}
                  </FastField>
                </FormControl>
              </FormGroup>
            </Grid>
          )}
      </Grid>
    </>
  );
};
