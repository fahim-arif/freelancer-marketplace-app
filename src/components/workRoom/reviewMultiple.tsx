import { IChatDeliverable } from 'global/interfaces/chatMessage';
import * as React from 'react';
import {
  Button,
  Drawer,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Typography,
  styled,
  useTheme,
} from '@mui/material';
import useProgressBar from 'global/hooks/useProgressBar';
import {
  ContractDeliverableStatus,
  IContract,
  IReviewMultipleDeliverablesForm,
  IReviewedDeliverable,
  IReviewedDeliverableDisplay,
} from 'global/interfaces/contract';
import { useFormik, getIn, FormikProps } from 'formik';
import { reviewMultipleDeliverablesValidation } from 'global/validations/reviewMultipleDeliverables';
import { getOpenContracts, reviewDeliverables } from 'services/contractService';
import IApiError from 'global/interfaces/api';
import { showUIError } from 'utils/errorHandler';
import RuleOutlinedIcon from '@mui/icons-material/RuleOutlined';
import { StyledDrawerGrid } from 'components/common/StyledDrawerGrid';
import CloseIcon from '@mui/icons-material/Close';

interface IReviewMultipleProps {
  deliverables: IChatDeliverable[];
  chatThreadId: string;
  messageId: string;
}

const StyledTypography = styled(Typography)(() => ({
  overflowWrap: 'break-word',
}));

const StyledGrid = styled(Grid)(() => ({
  marginTop: '24px',
}));

export default function ReviewMultiple(props: IReviewMultipleProps): JSX.Element {
  const [approvedDeliverables, setApprovedDeliverables] = React.useState<IChatDeliverable[]>([]);
  const [revisionDeliverables, setRevisionDeliverables] = React.useState<IChatDeliverable[]>([]);
  const [open, setOpen] = React.useState<boolean>(false);
  const [progress, showProgress] = useProgressBar();
  const theme = useTheme();

  const handleReview = (): void => {
    setOpen(true);
    showProgress(false);
  };

  const handleClose = (): void => {
    form.resetForm();
    setOpen(false);
  };

  const handleStatusChange = (
    form: FormikProps<IReviewMultipleDeliverablesForm>,
    deliverable: IReviewedDeliverableDisplay,
    targetValue: string,
    index: number,
  ): void => {
    let clearLastDeliverables = false;

    if (targetValue === ContractDeliverableStatus.Approved) {
      const numberOtherDeliverablesApproved = form.values.deliverables.filter(
        p =>
          p.contractId === deliverable.contractId &&
          p.newStatus === ContractDeliverableStatus.Approved &&
          p.name !== deliverable.name,
      ).length;
      if (numberOtherDeliverablesApproved + 1 === deliverable.numDeliverablesRemaining)
        form.setFieldValue(`deliverables.${index}.isLastDeliverable`, true);
      else clearLastDeliverables = true;
    } else {
      clearLastDeliverables = true;
    }

    if (clearLastDeliverables) {
      for (let i = 0; i < form.values.deliverables.length; i++) {
        if (form.values.deliverables[i].contractId === deliverable.contractId)
          form.setFieldValue(`deliverables.${i}.isLastDeliverable`, false);
      }
    }
  };

  const form = useFormik<IReviewMultipleDeliverablesForm>({
    initialValues: {
      deliverables: [],
    },
    validationSchema: reviewMultipleDeliverablesValidation,
    onSubmit: (values: IReviewMultipleDeliverablesForm) => {
      setOpen(false);
      if (values.deliverables.length > 0) {
        showProgress(true);
        reviewDeliverables(values.deliverables, props.messageId)
          .then(() => {
            showProgress(false);
          })
          .catch((err: IApiError) => {
            showUIError('Could not send message. Please refresh the page: ' + err.message);
          });
      }
    },
  });

  const createDeliverablesToReview = (
    res: IContract[],
    deliverablesAlreadyApproved: IChatDeliverable[],
    deliverablesAlreadyRequestedRevision: IChatDeliverable[],
    deliverablesToReview: IReviewedDeliverable[],
  ): void => {
    for (const chatDeliverable of props.deliverables) {
      const contract = res.find(p => p.contractId == chatDeliverable.contractId);
      if (contract === undefined) {
        deliverablesAlreadyApproved.push(chatDeliverable);
        continue;
      }

      const contractDeliverable = contract.deliverables.find(p => p.name === chatDeliverable.name);
      const numberOfDeliverablesRemaining = contract.deliverables.filter(
        p => p.status !== ContractDeliverableStatus.Approved,
      ).length;

      if (contractDeliverable === undefined || contractDeliverable.status === ContractDeliverableStatus.Approved) {
        deliverablesAlreadyApproved.push(chatDeliverable);
        continue;
      }

      if (contractDeliverable.status === ContractDeliverableStatus.RevisionRequired) {
        deliverablesAlreadyRequestedRevision.push(chatDeliverable);
        continue;
      }

      const reviewedDeliverable: IReviewedDeliverableDisplay = {
        contractId: chatDeliverable.contractId,
        contractName: chatDeliverable.contractName,
        name: chatDeliverable.name,
        currentStatus: contractDeliverable.status,
        newStatus: '',
        numDeliverablesRemaining: numberOfDeliverablesRemaining,
        hasRevisionsRemaining: contractDeliverable.revisionsRequested < contract.revisions,
        isLastDeliverable: false,
      };
      deliverablesToReview.push(reviewedDeliverable);
    }
  };

  React.useEffect(() => {
    if (open) {
      setApprovedDeliverables([]);
      setRevisionDeliverables([]);
      const chatThreadId: string = props.chatThreadId ?? '';
      if (props.deliverables !== undefined && chatThreadId !== '') {
        getOpenContracts(chatThreadId)
          .then((res: IContract[]) => {
            const deliverablesToReview: IReviewedDeliverable[] = [];
            const deliverablesAlreadyApproved: IChatDeliverable[] = [];
            const deliverablesAlreadyRequestedRevision: IChatDeliverable[] = [];

            createDeliverablesToReview(
              res,
              deliverablesAlreadyApproved,
              deliverablesAlreadyRequestedRevision,
              deliverablesToReview,
            );
            form.resetForm();
            setApprovedDeliverables(deliverablesAlreadyApproved);
            setRevisionDeliverables(deliverablesAlreadyRequestedRevision);
            form.setValues({ deliverables: deliverablesToReview });
          })
          .catch((err: IApiError) => {
            showUIError(err.message);
          });
      }
    }
  }, [open]);

  return (
    <React.Fragment>
      <Button variant="contained" type="button" onClick={handleReview} startIcon={<RuleOutlinedIcon />}>
        Review
      </Button>
      <Drawer
        anchor="right"
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <form onSubmit={form.handleSubmit}>
          <StyledDrawerGrid container>
            <Grid item xs={10}>
              <StyledTypography variant="h6" color={theme.palette.grey[900]}>
                Send Deliverables For Approval
              </StyledTypography>
            </Grid>
            <Grid item xs={2} container justifyContent="flex-end">
              <IconButton onClick={() => handleClose()}>
                <CloseIcon />
              </IconButton>
            </Grid>
            {approvedDeliverables.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="subtitle1">You have already approved the following deliverables:</Typography>
              </Grid>
            )}
            {approvedDeliverables.map((item: IChatDeliverable, i: number) => (
              <Grid key={i} item xs={12}>
                <Typography variant="subtitle1" color={theme.palette.grey[900]}>
                  {item.contractName}:&nbsp;{item.name}
                </Typography>
              </Grid>
            ))}
            {revisionDeliverables.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="h6">
                  You have already requested a revision of the following deliverables:
                </Typography>
              </Grid>
            )}
            {revisionDeliverables.map((item: IChatDeliverable, i: number) => (
              <Grid key={i} item xs={12}>
                <Typography variant="subtitle1" color={theme.palette.grey[900]}>
                  {item.contractName}:&nbsp;{item.name}
                </Typography>
              </Grid>
            ))}

            {form.values.deliverables.map((item: IReviewedDeliverableDisplay, i: number) => (
              <StyledGrid key={i} item xs={12}>
                <FormControl
                  fullWidth
                  error={
                    form.touched.deliverables !== undefined &&
                    form.errors.deliverables !== undefined &&
                    Boolean(form.errors.deliverables[i])
                  }
                >
                  <Typography variant="subtitle1" color={theme.palette.grey[900]}>
                    {item.contractName}:&nbsp;{item.name}
                  </Typography>
                  <Select
                    name={`deliverables.${i}.newStatus`}
                    value={form.values.deliverables[i].newStatus}
                    onChange={e => {
                      form.handleChange(e);
                      handleStatusChange(form, form.values.deliverables[i], e.target.value, i);
                    }}
                    fullWidth
                  >
                    <MenuItem value={ContractDeliverableStatus.Approved}>Approve</MenuItem>
                    <MenuItem
                      value={ContractDeliverableStatus.RevisionRequired}
                      disabled={!(form.values.deliverables[i] as IReviewedDeliverableDisplay).hasRevisionsRemaining}
                    >
                      Request revision
                    </MenuItem>
                    <MenuItem
                      disabled={(form.values.deliverables[i] as IReviewedDeliverableDisplay).hasRevisionsRemaining}
                      value={ContractDeliverableStatus.Disputed}
                    >
                      Raise dispute
                    </MenuItem>
                  </Select>
                  <FormHelperText sx={{ ml: 0 }}>
                    {form.touched.deliverables !== undefined &&
                    form.errors.deliverables !== undefined &&
                    Boolean(form.errors.deliverables[i])
                      ? getIn(form.errors.deliverables[i], 'newStatus')
                      : ''}
                  </FormHelperText>
                  <FormHelperText sx={{ ml: 0 }}>
                    {(form.values.deliverables[i] as IReviewedDeliverableDisplay).isLastDeliverable &&
                    form.values.deliverables[i].newStatus === ContractDeliverableStatus.Approved
                      ? 'This is the last deliverable to be approved of contract ' +
                        form.values.deliverables[i].contractName +
                        '. Once approved, the contract will be completed and the freelancer will be paid.'
                      : ''}
                  </FormHelperText>
                  <FormHelperText sx={{ ml: 0 }}>
                    {!(form.values.deliverables[i] as IReviewedDeliverableDisplay).hasRevisionsRemaining &&
                    form.values.deliverables[i].newStatus === ContractDeliverableStatus.Disputed
                      ? 'Please attempt to resolve any issues with the deliverable with the seller. A dispute should only be raised as a last resort.'
                      : ''}
                  </FormHelperText>
                </FormControl>
              </StyledGrid>
            ))}
            <Grid container item>
              <Button variant="contained" type="submit">
                OK
              </Button>
              <Button onClick={handleClose}>Cancel</Button>
            </Grid>
          </StyledDrawerGrid>
        </form>
      </Drawer>
      {progress}
    </React.Fragment>
  );
}
