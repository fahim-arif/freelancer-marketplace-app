import { Button, FormHelperText, Grid, IconButton, Typography, styled, useTheme } from '@mui/material';
import { StyledTab, StyledTabs } from '../StyledTabs/TabStyles';
import { PackageType } from 'global/enums/packageType';
import { IFixedPackage, IUser } from 'global/interfaces/user';
import { FormikProps } from 'formik';
import { ICreateContractForm } from 'global/interfaces/contract';
import { LicenseType } from 'global/enums/licenseTypes';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { AccessTime, BadgeOutlined, Tune } from '@mui/icons-material';
import { Dispatch, useEffect } from 'react';
import { ArrowBackIcon } from 'components/icon/ArrowBackIcon';
import { LoadingButton } from '@mui/lab';
import { nameof } from 'ts-simple-nameof';
import { CreateContractStep } from './CreateContract';

const StyledTypography = styled(Typography)(() => ({
  marginLeft: '20px',
  alignSelf: 'center',
}));

const StyledContentContainer = styled(Grid)(() => ({
  marginTop: '26px',
}));

const StyledContainer = styled(Grid)(() => ({
  marginTop: '36px',
}));

export interface IContractFixedProps extends FormikProps<ICreateContractForm> {
  user: IUser | null;
  setViewPackage: Dispatch<CreateContractStep>;
  handleCancel: () => void;
  loading: boolean;
}

export const CreateFixedContract: React.FC<IContractFixedProps> = ({
  setViewPackage,
  loading,
  handleCancel,
  ...form
}) => {
  const tabIndexLength = (form.user?.fixedPackages.length ?? 0) - 1;
  const currentFixedPackage: IFixedPackage | undefined = form.user?.fixedPackages[form.values.fixedPackageIndex ?? 0];
  const theme = useTheme();

  useEffect(() => {
    form.setFieldValue(
      nameof<ICreateContractForm>(x => x.name),
      PackageType[0],
    );
  }, []);

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
          Fixed package
        </StyledTypography>
      </Grid>
      <Grid container justifyContent="space-between" alignItems="center" padding={2}>
        <Grid item xs={12}>
          <StyledTabs
            value={
              form.values.fixedPackageIndex !== null && form.values.fixedPackageIndex !== undefined
                ? form.values.fixedPackageIndex
                : 0
            }
            onChange={(e, newValue: number) => {
              form.setFieldValue('fixedPackageIndex', newValue);
              form.setFieldValue(
                nameof<ICreateContractForm>(x => x.name),
                PackageType[newValue],
              );
            }}
          >
            <StyledTab value={PackageType.Loud} label="Loud" />
            {tabIndexLength > PackageType.Loud && <StyledTab value={PackageType.Louder} label="Louder" />}
            {tabIndexLength > PackageType.Louder && <StyledTab value={PackageType.Loudest} label="Loudest" />}
          </StyledTabs>
        </Grid>
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Typography variant="body1">What&apos;s included</Typography>
        </Grid>
        {currentFixedPackage !== null && currentFixedPackage !== undefined && (
          <>
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Grid container justifyContent="space-between">
                {currentFixedPackage.deliverables.map((p: string, index: number) => [
                  <Grid item xs={1} key={`${index}-primary`}>
                    <CheckCircleIcon color="primary" />
                  </Grid>,
                  <Grid item xs={11} key={`${index}-body`}>
                    <Typography variant="body1">{p}</Typography>
                  </Grid>,
                ])}
              </Grid>
            </Grid>

            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="body1">Terms</Typography>
            </Grid>
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Grid container justifyContent="space-between">
                <Grid item xs={1}>
                  <AccessTime />
                </Grid>
                <Grid item xs={11}>
                  <Typography variant="body1">{`${currentFixedPackage?.deliveryMethods} ${
                    currentFixedPackage?.deliveryMethods !== undefined &&
                    currentFixedPackage?.deliveryMethods !== null &&
                    currentFixedPackage?.deliveryMethods > 1
                      ? 'days'
                      : 'day'
                  } delivery`}</Typography>
                </Grid>

                <Grid item xs={1}>
                  <Tune />
                </Grid>
                <Grid item xs={11}>
                  <Typography variant="body1">Revisions: {currentFixedPackage.revisions}</Typography>
                </Grid>

                <Grid item xs={1}>
                  <BadgeOutlined />
                </Grid>
                <Grid item xs={11}>
                  <Typography variant="body1">
                    License:{' '}
                    {currentFixedPackage.license !== LicenseType.Custom
                      ? currentFixedPackage.license
                      : currentFixedPackage.custom}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </>
        )}
        <FormHelperText>
          {form.touched.fixedPackageIndex !== undefined ? form.errors.fixedPackageIndex : ''}
        </FormHelperText>
        <StyledContentContainer container justifyContent="space-between">
          <Typography variant="subtitle1" color={theme.palette.grey[600]}>
            Projected total
          </Typography>
          <Typography variant="subtitle1" color={theme.palette.grey[900]}>
            ${Math.round((form.user?.fixedPackages[form.values.fixedPackageIndex ?? 0].price as number) * 100) / 100}
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
    </>
  );
};
