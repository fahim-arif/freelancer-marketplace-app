import { Button, Drawer, FormHelperText, Grid, IconButton, Typography, styled, useTheme } from '@mui/material';
import { IChatUserThread } from 'global/interfaces/chatThread';
import { IDeliverableForApproval } from 'global/interfaces/contract';
import * as React from 'react';
import useProgressBar from 'global/hooks/useProgressBar';
import DeliverablesForApprovalSelect from './deliverablesForApprovalSelect';
import { UserAuth } from 'contexts/AuthContext';
import { sendDeliverablesForApproval } from 'services/contractService';
import IApiError from 'global/interfaces/api';
import { showUIError } from 'utils/errorHandler';
import CloseIcon from '@mui/icons-material/Close';
import { StyledDrawerGrid } from 'components/common/StyledDrawerGrid';

interface ISendDeliverablesForApprovalProps {
  user: UserAuth | null;
  open: boolean;
  selectedThread?: IChatUserThread;
  handleClose: () => void;
}

const StyledTypography = styled(Typography)(() => ({
  overflowWrap: 'break-word',
}));

const StyledGrid = styled(Grid)(() => ({
  marginTop: '24px',
}));

export default function SendDeliverablesForApproval(props: ISendDeliverablesForApprovalProps): JSX.Element {
  const [selectedDeliverables, setSelectedDeliverables] = React.useState<IDeliverableForApproval[]>([]);
  const [sendClicked, setSendClicked] = React.useState<boolean>(false);
  const [deliverablesAvailable, setDeliverablesAvailable] = React.useState<boolean>(true);
  const theme = useTheme();
  const [progress, showProgress] = useProgressBar();

  const handleSelectedDeliverblesChange = (deliverables: IDeliverableForApproval[]): void => {
    setSelectedDeliverables(deliverables);
  };

  const handleDeliverablesLoaded = (delsAvailable: boolean) => {
    setDeliverablesAvailable(delsAvailable);
  };

  const handleSend = (): void => {
    setSendClicked(true);
    if (selectedDeliverables.length > 0) {
      props.handleClose();
      showProgress(true);
      sendDeliverablesForApproval(props.selectedThread?.chatThreadId ?? '', selectedDeliverables)
        .then(() => {
          // Add message to UI
          showProgress(false);
        })
        .catch((err: IApiError) => {
          showUIError('Could not submit deliverables for approval ' + err.message);
        });
    }
  };

  React.useEffect(() => {
    setSelectedDeliverables([]);
    setSendClicked(false);
    setDeliverablesAvailable(true);
  }, [props.open]);

  return (
    <React.Fragment>
      <Drawer
        anchor="right"
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <StyledDrawerGrid container>
          <Grid item xs={10}>
            <StyledTypography variant="h6" color={theme.palette.grey[900]}>
              Send Deliverables For Approval
            </StyledTypography>
          </Grid>
          <Grid item xs={2} container justifyContent="flex-end">
            <IconButton onClick={() => props.handleClose()}>
              <CloseIcon />
            </IconButton>
          </Grid>
          <Grid item xs={12}>
            {deliverablesAvailable && (
              <React.Fragment>
                <DeliverablesForApprovalSelect
                  handleSelectedDeliverblesChange={handleSelectedDeliverblesChange}
                  user={props.user}
                  selectedThread={props.selectedThread}
                  handleLoaded={handleDeliverablesLoaded}
                />
                {sendClicked && selectedDeliverables.length === 0 && (
                  <FormHelperText error sx={{ mb: 1 }}>
                    Please select one or more deliverables
                  </FormHelperText>
                )}
              </React.Fragment>
            )}
            {!deliverablesAvailable && (
              <Typography variant="subtitle1">
                You currently have no open contracts with deliverables which need approved.
              </Typography>
            )}
          </Grid>
          <StyledGrid item container>
            {!deliverablesAvailable && (
              <React.Fragment>
                <Button onClick={props.handleClose}>OK</Button>
              </React.Fragment>
            )}
            {deliverablesAvailable && (
              <>
                <Button variant="contained" onClick={handleSend}>
                  Send for approval
                </Button>
                <Button onClick={props.handleClose}>Cancel</Button>
              </>
            )}
          </StyledGrid>
        </StyledDrawerGrid>
      </Drawer>
      {progress}
    </React.Fragment>
  );
}
