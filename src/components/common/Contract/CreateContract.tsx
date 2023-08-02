import {
  Avatar,
  Button,
  FormHelperText,
  Grid,
  Grow,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  styled,
  useTheme,
} from '@mui/material';
import { useFormik, FormikProvider, FormikProps } from 'formik';
import { ICreateContractForm, ContractType } from 'global/interfaces/contract';
import { createContractValidation } from 'global/validations/contract';
import React, { Dispatch, useState } from 'react';
import { getPayout } from 'services/payoutService';
import { IStripeConnect } from 'global/interfaces/payout';
import IApiError from 'global/interfaces/api';
import { showUIError } from 'utils/errorHandler';
import { createContract } from 'services/contractService';
import { getUser } from 'services/userService';
import { IUser } from 'global/interfaces/user';
import { TaskIcon } from 'components/icon/TaskIcon';
import { ArrowBackIcon } from 'components/icon/ArrowBackIcon';
import { CreateHourlyContract } from './CreateHourlyContract';
import { StyledListItemButton } from 'views/signup/AccountType';
import { CreateFixedContract } from './CreateFixedContract';
import { nameof } from 'ts-simple-nameof';
import { useNavigate } from 'react-router-dom';
import { AccessTimeOutlined } from '@mui/icons-material';
import { SelectUser } from './SelectUser';
import { IChatRecipient } from 'global/interfaces/chatThread';

const StyledList = styled(List)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
}));

const StyledTypography = styled(Typography)(() => ({
  marginLeft: '20px',
  alignSelf: 'center',
}));

const StyledGrow = styled(Grow)(() => ({
  marginBottom: '20px',
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.primary[100],
  color: theme.palette.primary[500],
}));

const StyledGrid = styled(Grid)(() => ({
  marginTop: '24px',
}));

export enum CreateContractStep {
  SelectPackage,
  SelectUser,
  FillData,
}

interface ICreateContractProps {
  chatThreadId?: string;
  fullWidth?: boolean;
  setOpenConnectDrawer: Dispatch<boolean>;
  multiRecipients: IChatRecipient[] | undefined;
  otherUserId: string | null;
}

const FIXED_PACKAGE = 0;
const HOURLY_PACKAGE = 1;
const ICON_COLOUR = '#2B43CA';

export default function CreateContract(props: ICreateContractProps): JSX.Element {
  const [stripeAccount, setStripeAccount] = React.useState<IStripeConnect | null>(null);
  const [user, setUser] = React.useState<IUser | null>(null);
  const [viewPackage, setViewPackage] = React.useState<CreateContractStep>(CreateContractStep.SelectPackage);
  const [selectedPackage, setSelectedPackage] = useState<number>(-1);
  const [loading, setLoading] = useState<boolean>(false);
  const theme = useTheme();
  const navigate = useNavigate();

  const handleClose = (): void => {
    props.setOpenConnectDrawer(false);
    setSelectedPackage(-1);
    setViewPackage(CreateContractStep.SelectPackage);
    form.resetForm();
    setLoading(false);
  };

  const handleCancel = (): void => {
    props.setOpenConnectDrawer(false);
  };

  const handlePayoutClick = (): void => {
    handleClose();
    navigate('/PayoutDetails');
  };

  const form = useFormik<ICreateContractForm>({
    initialValues: {
      name: '',
      contractType: ContractType.Hourly,
      deliverables: [''],
      hours: null,
      fixedPackageIndex: 0,
      delivery: null,
      revisions: null,
      license: '',
      custom: '',
      otherUserId: props.otherUserId,
    },
    validationSchema: createContractValidation,
    onSubmit: (values: ICreateContractForm) => {
      setLoading(true);
      createContract(values, props.chatThreadId)
        .then(() => {
          handleClose();
        })
        .catch((err: IApiError) => {
          showUIError(err.message);
        });
    },
  });

  React.useEffect(() => {
    getPayout()
      .then((res: IStripeConnect) => {
        setStripeAccount(res);
      })
      .catch((err: IApiError) => {
        showUIError(err.message);
      });

    getUser()
      .then((res: IUser) => {
        setUser(res);
      })
      .catch((err: IApiError) => {
        if (err.status !== 404) {
          showUIError(err.message);
        }
      });
  }, []);

  return (
    <React.Fragment>
      <Grid item xs={11.7}>
        {stripeAccount !== null && (!stripeAccount?.payoutsEnabled || !stripeAccount?.ordersEnabled) && (
          <React.Fragment>
            <Grid container>
              <IconButton onClick={() => props.setOpenConnectDrawer(false)}>
                <ArrowBackIcon />
              </IconButton>
              <StyledTypography variant="h6" color={theme.palette.grey[900]}>
                New Contract
              </StyledTypography>
            </Grid>
            <Grid item container xs={12} justifyContent="center">
              <Grid item xs={11.5}>
                <Typography variant="body1">
                  Payouts are not currently enabled on your account. You must enter your payout details prior to
                  creating contracts.
                </Typography>
                <Button onClick={handleClose}>Cancel</Button>
                <Button variant="contained" onClick={handlePayoutClick}>
                  Go to Payout Details
                </Button>
              </Grid>
            </Grid>
          </React.Fragment>
        )}
        {stripeAccount !== null && stripeAccount?.payoutsEnabled && stripeAccount?.ordersEnabled && (
          <FormikProvider value={form}>
            <form onSubmit={form.handleSubmit}>
              {viewPackage == CreateContractStep.SelectPackage && (
                <ChoosePackage
                  form={form}
                  next={() =>
                    setViewPackage(props.multiRecipients ? CreateContractStep.SelectUser : CreateContractStep.FillData)
                  }
                  setOpenConnectDrawer={props.setOpenConnectDrawer}
                  selectedPackage={selectedPackage}
                  setSelectedPackage={setSelectedPackage}
                />
              )}

              {props.multiRecipients && viewPackage == CreateContractStep.SelectUser && (
                <SelectUser
                  {...form}
                  setViewPackage={setViewPackage}
                  handleCancel={() => handleCancel()}
                  loading={loading}
                  recipients={props.multiRecipients}
                />
              )}

              {viewPackage == CreateContractStep.FillData && selectedPackage === FIXED_PACKAGE && (
                <CreateFixedContract
                  {...form}
                  user={user}
                  setViewPackage={setViewPackage}
                  handleCancel={() => handleCancel()}
                  loading={loading}
                />
              )}
              {viewPackage == CreateContractStep.FillData && selectedPackage === HOURLY_PACKAGE && (
                <CreateHourlyContract
                  {...form}
                  user={user}
                  setViewPackage={setViewPackage}
                  handleCancel={() => handleCancel()}
                  loading={loading}
                />
              )}
            </form>
          </FormikProvider>
        )}
      </Grid>
    </React.Fragment>
  );
}

const ChoosePackage: React.FC<{
  form: FormikProps<ICreateContractForm>;
  next: () => void;
  setOpenConnectDrawer: Dispatch<boolean>;
  selectedPackage: number;
  setSelectedPackage: Dispatch<number>;
}> = ({ next, setOpenConnectDrawer, setSelectedPackage, selectedPackage, form }) => {
  const theme = useTheme();
  const [error, setError] = useState<boolean>(false);
  return (
    <>
      <Grid container>
        <IconButton onClick={() => setOpenConnectDrawer(false)}>
          <ArrowBackIcon />
        </IconButton>
        <StyledTypography variant="h6" color={theme.palette.grey[900]}>
          New Contract
        </StyledTypography>
      </Grid>
      <StyledGrid container justifyContent="center">
        <Grid item xs={11.5}>
          <StyledGrow in={true} timeout={500}>
            <StyledList disablePadding>
              <ListItem disablePadding>
                <StyledListItemButton
                  selected={selectedPackage === FIXED_PACKAGE}
                  onClick={() => {
                    setError(false);
                    form.setFieldValue(
                      nameof<ICreateContractForm>(x => x.contractType),
                      ContractType.FixedPackage,
                    );
                    setSelectedPackage(FIXED_PACKAGE);
                  }}
                  disableRipple
                >
                  <ListItemAvatar>
                    <StyledAvatar>
                      <TaskIcon sx={{ marginLeft: '3px', color: ICON_COLOUR }} />
                    </StyledAvatar>
                  </ListItemAvatar>
                  <ListItemText primary={<Typography variant="subtitle1">Fixed package</Typography>} />
                </StyledListItemButton>
              </ListItem>
            </StyledList>
          </StyledGrow>
          <StyledGrow in={true} timeout={1000}>
            <StyledList disablePadding>
              <ListItem disablePadding>
                <StyledListItemButton
                  selected={selectedPackage === HOURLY_PACKAGE}
                  onClick={() => {
                    setError(false);
                    form.setFieldValue(
                      nameof<ICreateContractForm>(x => x.contractType),
                      ContractType.Hourly,
                    );
                    setSelectedPackage(HOURLY_PACKAGE);
                  }}
                  disableRipple
                >
                  <ListItemAvatar>
                    <StyledAvatar>
                      <AccessTimeOutlined sx={{ color: ICON_COLOUR }} />
                    </StyledAvatar>
                  </ListItemAvatar>
                  <ListItemText primary={<Typography variant="subtitle1">Hourly package</Typography>} />
                </StyledListItemButton>
              </ListItem>
              <FormHelperText sx={{ color: '#F04438' }}>{error ? 'Select a contract type' : ''}</FormHelperText>
            </StyledList>
          </StyledGrow>
          <Grid container>
            <Button
              variant="contained"
              onClick={() => {
                if (selectedPackage === -1) {
                  setError(true);
                  return;
                }
                next();
              }}
            >
              Next
            </Button>

            <Button onClick={() => setOpenConnectDrawer(false)}>Cancel</Button>
          </Grid>
        </Grid>
      </StyledGrid>
    </>
  );
};
