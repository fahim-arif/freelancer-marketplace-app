import { Button, Grid, IconButton, Typography, styled, useTheme } from '@mui/material';
import { PackageType } from 'global/enums/packageType';
import { FormikProps } from 'formik';
import { ICreateContractForm } from 'global/interfaces/contract';
import { Dispatch, useEffect, useState } from 'react';
import { ArrowBackIcon } from 'components/icon/ArrowBackIcon';
import { LoadingButton } from '@mui/lab';
import { nameof } from 'ts-simple-nameof';
import { CreateContractStep } from './CreateContract';
import { IChatRecipient } from 'global/interfaces/chatThread';
import FormSelect from '../Select/FormSelect';
import { SelectItem } from 'global/interfaces/selects';

const StyledTypography = styled(Typography)(() => ({
  marginLeft: '20px',
  alignSelf: 'center',
}));

const StyledContainer = styled(Grid)(() => ({
  marginTop: '36px',
}));

export interface IContractFixedProps extends FormikProps<ICreateContractForm> {
  setViewPackage: Dispatch<CreateContractStep>;
  loading: boolean;
  handleCancel: () => void;
  recipients: IChatRecipient[];
}

export const SelectUser: React.FC<IContractFixedProps> = ({
  setViewPackage,
  loading,
  handleCancel,
  recipients,
  ...form
}) => {
  const theme = useTheme();
  const [showError, setShowError] = useState<boolean>(false);

  useEffect(() => {
    form.setFieldValue(
      nameof<ICreateContractForm>(x => x.name),
      PackageType[0],
    );
  }, []);

  const items: SelectItem[] = [
    { id: '', label: 'None' },
    ...recipients.map(r => ({ id: r.userId, label: r.displayName })),
  ];

  const handleOnNext = () => {
    if (form.values.otherUserId) {
      setShowError(false);
      setViewPackage(CreateContractStep.FillData);
    } else {
      setShowError(true);
    }
  };

  return (
    <>
      <Grid container>
        <IconButton onClick={() => setViewPackage(CreateContractStep.SelectPackage)}>
          <ArrowBackIcon />
        </IconButton>
        <StyledTypography variant="h6" color={theme.palette.grey[900]}>
          Recipient
        </StyledTypography>
      </Grid>
      <Grid container justifyContent="space-between" alignItems="center" padding={2}>
        <Grid item xs={12} sx={{ mt: 2 }}>
          <FormSelect
            items={items}
            value={form.values.otherUserId ?? ''}
            onChange={form.handleChange}
            label="Recipient"
            name="otherUserId"
            error={showError}
            helpertext={showError ? 'Contract recipient is required.' : ''}
          />
        </Grid>
        <StyledContainer item xs={12}>
          <LoadingButton loading={loading} variant="contained" onClick={handleOnNext}>
            Next
          </LoadingButton>
          <Button sx={{ color: theme.palette.primary[600] }} onClick={() => handleCancel()}>
            Cancel
          </Button>
        </StyledContainer>
      </Grid>
    </>
  );
};
