import { Close } from '@mui/icons-material';
import Add from '@mui/icons-material/Add';
import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  styled,
  useTheme,
} from '@mui/material';
import { ArrowBackIcon } from 'components/icon/ArrowBackIcon';
import { FieldArray, FormikProps } from 'formik';
import { ICreateContractForm } from 'global/interfaces/contract';
import { IUser } from 'global/interfaces/user';
import { Dispatch } from 'react';
import FormSelect from '../Select/FormSelect';
import { LicenseType } from 'global/enums/licenseTypes';
import DeliveryLookups from 'json/DeliveryLookups.json';
import RevisionLookups from 'json/RevisionLookups.json';
import LicenseLookups from 'json/LicenseLookups.json';
import { LoadingButton } from '@mui/lab';
import { CreateContractStep } from './CreateContract';

const StyledTypography = styled(Typography)(() => ({
  marginLeft: '20px',
  alignSelf: 'center',
}));

const StyledContainer = styled(Grid)(() => ({
  marginTop: '36px',
}));

const StyledFormControl = styled(FormControl)(() => ({
  marginBottom: '36px',
}));

const StyledContentContainer = styled(Grid)(() => ({
  marginTop: '26px',
}));

export interface IContractHoursProps extends FormikProps<ICreateContractForm> {
  user: IUser | null;
  setViewPackage: Dispatch<CreateContractStep>;
  handleCancel: () => void;
  loading: boolean;
}

export const CreateHourlyContract: React.FC<IContractHoursProps> = ({
  setViewPackage,
  handleCancel,
  loading,
  ...form
}) => {
  const theme = useTheme();

  return (
    <>
      <Grid container>
        <IconButton
          onClick={() =>
            setViewPackage(form.values.otherUserId ? CreateContractStep.SelectUser : CreateContractStep.SelectPackage)
          }
        >
          <ArrowBackIcon />
        </IconButton>
        <StyledTypography variant="h6" color={theme.palette.grey[900]}>
          Hourly package
        </StyledTypography>
      </Grid>
      <StyledContainer item xs={12} container justifyContent="right">
        <Grid xs={11.5} item>
          <Typography variant="h6" color={theme.palette.grey[900]}>
            What&apos;s included
          </Typography>
          <Typography variant="body1" color={theme.palette.grey[500]}>
            Enter the main deliverables. Max 3. Keep it short
          </Typography>
          <StyledFormControl
            error={form.touched.deliverables !== undefined && Boolean(form.errors.deliverables)}
            fullWidth
          >
            <FieldArray
              name="deliverables"
              render={arrayHelpers => (
                <div>
                  {form.values.deliverables?.map((deliverable, index) => (
                    <Grid container spacing={1} alignItems="center" key={index}>
                      <Grid item xs={10.5}>
                        <TextField
                          name={`deliverables.${index}`}
                          margin="dense"
                          value={form.values.deliverables !== undefined ? form.values.deliverables[index] : ''}
                          onChange={form.handleChange}
                          variant={'outlined'}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={1.5}>
                        {index === 0 &&
                          form.values.deliverables !== undefined &&
                          form.values.deliverables?.length < 3 && (
                            <IconButton aria-label="Add" color="primary" onClick={() => arrayHelpers.push('')}>
                              <Add />
                            </IconButton>
                          )}
                        {index > 0 && (
                          <IconButton aria-label="Delete" color="warning" onClick={() => arrayHelpers.remove(index)}>
                            <Close />
                          </IconButton>
                        )}
                      </Grid>
                    </Grid>
                  ))}
                </div>
              )}
            />
            <FormHelperText>{form.touched.deliverables !== undefined ? form.errors.deliverables : ''}</FormHelperText>
          </StyledFormControl>
          <Typography variant="h6" color={theme.palette.grey[900]}>
            Terms
          </Typography>
          <Grid container spacing={1} alignItems="top">
            <Grid item xs={6} sx={{ mt: 1 }}>
              <FormSelect
                items={DeliveryLookups}
                label="Delivery"
                name="delivery"
                value={form.values.delivery !== null ? form.values.delivery : ''}
                onChange={form.handleChange}
                margin="dense"
                error={form.touched.delivery !== undefined && Boolean(form.errors.delivery)}
                helpertext={form.touched.delivery !== undefined ? form.errors.delivery : ''}
              />
            </Grid>
            <Grid item xs={6} sx={{ mt: 1 }}>
              <FormSelect
                items={RevisionLookups}
                label="Revisions"
                name="revisions"
                value={form.values.revisions !== null ? form.values.revisions : ''}
                onChange={form.handleChange}
                margin="dense"
                error={form.touched.revisions !== undefined && Boolean(form.errors.revisions)}
                helpertext={form.touched.revisions !== undefined ? form.errors.revisions : ''}
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: 1 }}>
              <FormSelect
                items={LicenseLookups}
                label="License"
                name="license"
                value={form.values.license}
                onChange={form.handleChange}
                margin="dense"
                error={form.touched.license !== undefined && Boolean(form.errors.license)}
                helpertext={form.touched.license !== undefined ? form.errors.license : ''}
              />
            </Grid>
            {form.values.license === LicenseType.Custom && (
              <Grid item xs={12} sx={{ mt: 1 }}>
                <TextField
                  name="custom"
                  label="Custom License"
                  variant={'outlined'}
                  value={form.values.custom}
                  onChange={form.handleChange}
                  margin="dense"
                  error={form.touched.custom !== undefined && Boolean(form.errors.custom)}
                  helperText={form.touched.custom !== undefined ? form.errors.custom : ''}
                  fullWidth
                  multiline
                  rows={3}
                />
              </Grid>
            )}
          </Grid>
          <StyledContentContainer container spacing={1} alignItems="top">
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Contract Name"
                variant={'outlined'}
                value={form.values.name}
                onChange={form.handleChange}
                margin="dense"
                error={form.touched.name !== undefined && Boolean(form.errors.name)}
                helperText={form.touched.name !== undefined ? form.errors.name : ''}
                fullWidth
              />
            </Grid>
            <StyledContentContainer item xs={12}>
              <TextField
                type="number"
                label="Hourly Rate"
                name="hourlyRate"
                value={form?.user?.hourlyRate ?? ''}
                margin="dense"
                variant={'outlined'}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                fullWidth
                disabled
              />
            </StyledContentContainer>
            <Grid item xs={12}>
              <TextField
                type="number"
                label="Number of Hours"
                name="hours"
                value={form.values.hours !== null ? form.values.hours : ''}
                onChange={form.handleChange}
                margin="dense"
                error={form.touched.hours !== undefined && Boolean(form.errors.hours)}
                helperText={form.touched.hours !== undefined ? form.errors.hours : ''}
                variant={'outlined'}
                fullWidth
              />
            </Grid>
          </StyledContentContainer>

          <StyledContentContainer container justifyContent="space-between">
            <Typography variant="subtitle1" color={theme.palette.grey[600]}>
              Projected total
            </Typography>
            <Typography variant="subtitle1" color={theme.palette.grey[900]}>
              ${Math.round((form.values.hours as number) * (form.user?.hourlyRate as number) * 100) / 100}
            </Typography>
          </StyledContentContainer>
          <StyledContainer item>
            <LoadingButton loading={loading} variant="contained" onClick={() => form.handleSubmit()}>
              Send
            </LoadingButton>
            <Button sx={{ color: theme.palette.primary[600] }} onClick={() => handleCancel()}>
              Cancel
            </Button>
          </StyledContainer>
        </Grid>
      </StyledContainer>
    </>
  );
};
