import { IChatDeliverable } from 'global/interfaces/chatMessage';
import * as React from 'react';
import { Button, Drawer, Grid, IconButton, Typography, styled, useTheme } from '@mui/material';
import { getContract, reviewDeliverables } from 'services/contractService';
import { ContractDeliverableStatus, IContract, IReviewedDeliverable } from 'global/interfaces/contract';
import IApiError from 'global/interfaces/api';
import { showUIError } from 'utils/errorHandler';
import useProgressBar from 'global/hooks/useProgressBar';
import DoneAllOutlinedIcon from '@mui/icons-material/DoneAllOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { GreyButton } from './buttons';
import { StyledDrawerGrid } from 'components/common/StyledDrawerGrid';
import CloseIcon from '@mui/icons-material/Close';

export enum ReviewResult {
  AlreadyApproved,
  AlreadyRevisionRequested,
  AlreadyDisputed,
  ConfirmApproval,
  ConfirmRaiseDispute,
  ExecuteApprovalRevision,
}

interface IReviewSingleProps {
  deliverable: IChatDeliverable;
  messageId: string;
}

const StyledGrid = styled(Grid)(() => ({
  marginTop: '24px',
}));

export default function ReviewSingle(props: IReviewSingleProps): JSX.Element {
  const [open, setOpen] = React.useState<boolean>(false);
  const [reviewResult, setReviewResult] = React.useState<ReviewResult | undefined>(undefined);
  const [progress, showProgress] = useProgressBar();
  const theme = useTheme();

  const handleReview = (newStatus: ContractDeliverableStatus): void => {
    getContract(props.deliverable.contractId)
      .then((res: IContract) => {
        const deliverable = res.deliverables.find(p => p.name == props.deliverable.name);
        const isLastDeliverableToApprove =
          res.deliverables.filter(p => p.status != ContractDeliverableStatus.Approved).length === 1;

        let newReviewResult: ReviewResult | undefined = undefined;

        if (deliverable === undefined || deliverable === null) {
          showUIError('Cannot find deliverable');
        } else if (deliverable.status === ContractDeliverableStatus.Approved) {
          newReviewResult = ReviewResult.AlreadyApproved;
        } else if (deliverable.status === ContractDeliverableStatus.RevisionRequired) {
          newReviewResult = ReviewResult.AlreadyRevisionRequested;
        } else if (deliverable.status === ContractDeliverableStatus.Disputed) {
          newReviewResult = ReviewResult.AlreadyDisputed;
        } else if (
          deliverable.status === ContractDeliverableStatus.WaitingApproval &&
          isLastDeliverableToApprove &&
          newStatus === ContractDeliverableStatus.Approved
        ) {
          newReviewResult = ReviewResult.ConfirmApproval;
        } else if (
          deliverable.status === ContractDeliverableStatus.WaitingApproval &&
          deliverable.revisionsRequested === res.revisions &&
          newStatus === ContractDeliverableStatus.RevisionRequired
        ) {
          newReviewResult = ReviewResult.ConfirmRaiseDispute;
        } else if (deliverable.status === ContractDeliverableStatus.WaitingApproval) {
          newReviewResult = ReviewResult.ExecuteApprovalRevision;
        }

        setReviewResult(newReviewResult);
        if (newReviewResult !== ReviewResult.ExecuteApprovalRevision) {
          setOpen(true);
        } else {
          updateDeliverableStatus(newStatus);
        }
      })
      .catch((err: IApiError) => {
        showUIError(err.message);
      });
  };

  const handleApprove = (): void => {
    handleReview(ContractDeliverableStatus.Approved);
  };

  const handleRequestRevision = (): void => {
    handleReview(ContractDeliverableStatus.RevisionRequired);
  };

  const updateDeliverableStatus = (newStatus: ContractDeliverableStatus): void => {
    setOpen(false);
    showProgress(true);
    const deliverablesToSend: IReviewedDeliverable[] = [
      {
        contractId: props.deliverable.contractId,
        contractName: props.deliverable.contractName,
        name: props.deliverable.name,
        newStatus: newStatus,
      },
    ];
    reviewDeliverables(deliverablesToSend, props.messageId)
      .then(() => {
        showProgress(false);
      })
      .catch((err: IApiError) => {
        showUIError('Could not send message. Please refresh the page: ' + err.message);
      });
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  return (
    <>
      <Grid container direction="row" justifyContent="flex-start" alignItems="center" spacing={1}>
        <Grid item>
          <Button variant="contained" type="button" onClick={handleApprove} startIcon={<DoneAllOutlinedIcon />}>
            Approve
          </Button>
        </Grid>
        <Grid item>
          <GreyButton
            variant="outlined"
            type="button"
            onClick={handleRequestRevision}
            startIcon={<ClearOutlinedIcon />}
          >
            Request Revision
          </GreyButton>
        </Grid>
      </Grid>
      <Drawer
        anchor="right"
        open={open}
        onClose={handleClose}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <StyledDrawerGrid container>
          {reviewResult === ReviewResult.AlreadyApproved && (
            <>
              <Grid item xs={10}>
                <Typography variant="h6" color={theme.palette.grey[900]}>
                  Already approved
                </Typography>
              </Grid>
              <Grid item xs={2} container justifyContent="flex-end">
                <IconButton onClick={() => handleClose()}>
                  <CloseIcon />
                </IconButton>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1">{`Deliverable ${props.deliverable.contractName}: ${props.deliverable.name} has already been approved.`}</Typography>
              </Grid>
              <StyledGrid item container>
                <Button variant="contained" onClick={() => handleClose()}>
                  Ok
                </Button>
              </StyledGrid>
            </>
          )}

          {reviewResult === ReviewResult.AlreadyRevisionRequested && (
            <>
              <Grid item xs={10}>
                <Typography variant="h6" color={theme.palette.grey[900]}>
                  Already Requested Revision
                </Typography>
              </Grid>
              <Grid item xs={2} container justifyContent="flex-end">
                <IconButton onClick={() => handleClose()}>
                  <CloseIcon />
                </IconButton>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">{`You have already requested a revision of deliverable ${props.deliverable.contractName}: ${props.deliverable.name}.`}</Typography>
              </Grid>
              <StyledGrid item container>
                <Button variant="contained" onClick={() => handleClose()}>
                  Ok
                </Button>
              </StyledGrid>
            </>
          )}

          {reviewResult === ReviewResult.AlreadyDisputed && (
            <>
              <Grid item xs={10}>
                <Typography variant="h6" color={theme.palette.grey[900]}>
                  Already disputed
                </Typography>
              </Grid>
              <Grid item xs={2} container justifyContent="flex-end">
                <IconButton onClick={() => handleClose()}>
                  <CloseIcon />
                </IconButton>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1">{`You have already raised a dispute for deliverable ${props.deliverable.contractName}: ${props.deliverable.name}.`}</Typography>
              </Grid>
              <StyledGrid item container>
                <Button variant="contained" onClick={() => handleClose()}>
                  Ok
                </Button>
              </StyledGrid>
            </>
          )}

          {reviewResult === ReviewResult.ConfirmApproval && (
            <>
              <Grid item xs={10}>
                <Typography variant="h6" color={theme.palette.grey[900]}>
                  Confirm approval
                </Typography>
              </Grid>
              <Grid item xs={2} container justifyContent="flex-end">
                <IconButton onClick={() => handleClose()}>
                  <CloseIcon />
                </IconButton>
              </Grid>
              <StyledGrid item xs={12}>
                <Typography variant="body1">{`This is the last deliverable to be approved of contract ${props.deliverable.contractName}. Once approved, the contract will be completed and the freelancer will be paid. Do you approve deliverable ${props.deliverable.name}?`}</Typography>
              </StyledGrid>
              <StyledGrid item container>
                <Button variant="contained" onClick={() => updateDeliverableStatus(ContractDeliverableStatus.Approved)}>
                  Yes
                </Button>
                <Button onClick={handleClose}>No</Button>
              </StyledGrid>
            </>
          )}

          {reviewResult === ReviewResult.ConfirmRaiseDispute && (
            <>
              <Grid item xs={10}>
                <Typography variant="h6" color={theme.palette.grey[900]}>
                  Raise dispute
                </Typography>
              </Grid>
              <Grid item xs={2} container justifyContent="flex-end">
                <IconButton onClick={() => handleClose()}>
                  <CloseIcon />
                </IconButton>
              </Grid>
              <StyledGrid item xs={12}>
                <Typography variant="subtitle1">{`There are no revisions left in contract ${props.deliverable.contractName}. Please attempt to resolve any issues with the deliverable with the seller. A dispute should only be raised as a last resort. Would you like to raise a dispute now?`}</Typography>
              </StyledGrid>
              <StyledGrid item container>
                <Button onClick={handleClose}>No</Button>
                <Button variant="contained" onClick={() => updateDeliverableStatus(ContractDeliverableStatus.Disputed)}>
                  Yes
                </Button>
              </StyledGrid>
            </>
          )}
        </StyledDrawerGrid>
      </Drawer>
      {progress}
    </>
  );
}
