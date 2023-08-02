import { IVetting, IVettingChangeView } from 'global/interfaces/user';
import Timeline from '@mui/lab/Timeline';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  TextField,
  Typography,
  styled,
} from '@mui/material';
import { Email, Send, ExpandMore, Check, Cancel, SvgIconComponent, PersonAdd } from '@mui/icons-material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { useEffect, useState } from 'react';
import { FormikProps, useFormik } from 'formik';
import { object, string } from 'yup';
import { VettingStatus } from 'global/enums/vettingStatus';
import { formatDistance } from 'date-fns';
import { VettingView } from './VettingView';

interface VettingManagerProps {
  changes: IVettingChangeView[];
  onApprove: () => void;
  onFeedback: (comment: string) => void;
  onReject: () => void;
  vetting: IVetting;
}

interface DialogSettings {
  isOpen: boolean;
  question?: string;
  description?: string;
  onAgree?: () => void;
}

interface SendFeedbackFormProps {
  comment: string;
}

interface EventHistorySetting {
  icon: SvgIconComponent;
  titleFunc: (name: string, date: string) => string;
  color: 'grey' | 'inherit' | 'primary' | 'error' | 'warning';
}

const historyMap: Record<VettingStatus, EventHistorySetting> = {
  [VettingStatus.NotSubmitted]: {
    icon: PersonAdd,
    titleFunc: (_, time) => `Profile created ${time}.`,
    color: 'inherit',
  },
  [VettingStatus.InProgress]: {
    icon: Send,
    titleFunc: (_, time) => `Profile submitted ${time}.`,
    color: 'grey',
  },
  [VettingStatus.Approved]: {
    icon: Check,
    titleFunc: (name, time) => `Profile approved by ${name} ${time}.`,
    color: 'primary',
  },
  [VettingStatus.UpdatesRequired]: {
    icon: Email,
    titleFunc: (name, time) => `${name} left a comment ${time}.`,
    color: 'warning',
  },
  [VettingStatus.Rejected]: {
    icon: Cancel,
    titleFunc: (name, time) => `Profile rejected by ${name} ${time}.`,
    color: 'error',
  },
};

const LeftTimeline = styled(Timeline)`
  padding-top: 0;
  padding-bottom: 0;
  margin-top: 0;
  margin-bottom: 0;
  .${timelineItemClasses.root}:before {
    flex: 0;
    padding: 0;
  }
`;

export const VettingManager = ({
  changes,
  onApprove,
  onFeedback,
  onReject,
  vetting: { status: lastStatus, viewedOn },
}: VettingManagerProps): JSX.Element => {
  const [isFeedbackMode, setIsFeedbackMode] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [dialogSettings, setDialogSettings] = useState<DialogSettings>({ isOpen: false });
  const { isOpen, question, description, onAgree } = dialogSettings;

  useEffect(() => {
    if (lastStatus === VettingStatus.InProgress || lastStatus === VettingStatus.UpdatesRequired) {
      setIsExpanded(true);
    }
  }, [lastStatus]);

  const handleApprove = (): void => {
    setDialogSettings({
      isOpen: true,
      question: 'Approve this user?',
      description: 'Approval of this user will immediatly make him visible to public.',
      onAgree: () => {
        setDialogSettings({ isOpen: false });
        onApprove();
      },
    });
  };

  const handleSendFeedback = (values: SendFeedbackFormProps): void => {
    setDialogSettings({
      isOpen: true,
      question: 'Send feedback?',
      description: 'Your entered feedback will be sent to the user as an email.',
      onAgree: () => {
        setIsFeedbackMode(false);
        setDialogSettings({ isOpen: false });
        onFeedback(values.comment);
        feedbackForm.resetForm();
      },
    });
  };

  const handleReject = (): void => {
    setDialogSettings({
      isOpen: true,
      question: 'Reject this user?',
      description: "User won't be able to provide his services and currently he can't do anything to get approved.",
      onAgree: () => {
        setDialogSettings({ isOpen: false });
        onReject();
      },
    });
  };

  const feedbackForm: FormikProps<SendFeedbackFormProps> = useFormik<SendFeedbackFormProps>({
    initialValues: {
      comment: '',
    },
    onSubmit: handleSendFeedback,
    validationSchema: object({
      comment: string().required('Comment is required'),
    }),
  });

  return (
    <>
      <Accordion expanded={isExpanded} onChange={() => setIsExpanded(!isExpanded)}>
        <AccordionSummary expandIcon={<ExpandMore />} sx={{ bgcolor: '#eeeeee', alignItems: 'center' }}>
          <Typography>VettingStatus: {lastStatus}</Typography> {viewedOn && <VettingView viewedOn={viewedOn} />}
        </AccordionSummary>
        <AccordionDetails>
          <LeftTimeline>
            {changes.map(({ status, createdAt, createdBy, comment }) => {
              const { color, titleFunc, icon } = historyMap[status];
              const timeDistance = formatDistance(new Date(createdAt), new Date(), { addSuffix: true });
              const Icon = icon;
              return (
                <TimelineItem key={createdAt}>
                  <TimelineSeparator>
                    <TimelineDot color={color}>
                      <Icon />
                    </TimelineDot>
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography variant="subtitle1" component="p">
                      {titleFunc(createdBy, timeDistance)}
                    </Typography>
                    {comment != null && (
                      <Typography variant="caption" component="p" color="GrayText" sx={{ fontStyle: 'italic' }}>
                        {comment}
                      </Typography>
                    )}
                    <Typography variant="h5" component="p">
                      VettingStatus: {status}
                    </Typography>
                  </TimelineContent>
                </TimelineItem>
              );
            })}
            <TimelineItem>
              <TimelineSeparator sx={{ marginX: '10px' }}>
                <TimelineDot />
              </TimelineSeparator>
              {isFeedbackMode && (
                <TimelineContent>
                  <form onSubmit={feedbackForm.handleSubmit}>
                    <FormControl sx={{ mb: 1 }} fullWidth>
                      <TextField
                        id="comment"
                        multiline
                        rows={4}
                        placeholder="Enter a comment for user"
                        value={feedbackForm.values.comment}
                        onChange={feedbackForm.handleChange}
                        error={feedbackForm.touched.comment === true && Boolean(feedbackForm.errors.comment)}
                        helperText={feedbackForm.touched.comment === true && feedbackForm.errors.comment}
                      />
                    </FormControl>
                    <Button variant="contained" endIcon={<Email />} color="warning" sx={{ mr: 1 }} type="submit">
                      Send feedback
                    </Button>
                    <Button
                      variant="contained"
                      endIcon={<Cancel />}
                      color="error"
                      onClick={() => setIsFeedbackMode(false)}
                    >
                      Cancel
                    </Button>
                  </form>
                </TimelineContent>
              )}
              {!isFeedbackMode && (
                <TimelineContent>
                  {lastStatus !== VettingStatus.Approved && (
                    <Button variant="contained" endIcon={<Check />} sx={{ mr: 1 }} onClick={() => handleApprove()}>
                      Approve
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    endIcon={<Email />}
                    color="warning"
                    onClick={() => setIsFeedbackMode(true)}
                    sx={{ mr: 1 }}
                  >
                    Send feedback
                  </Button>
                  {lastStatus !== VettingStatus.Rejected && (
                    <Button variant="contained" endIcon={<Cancel />} color="error" onClick={() => handleReject()}>
                      Reject
                    </Button>
                  )}
                </TimelineContent>
              )}
            </TimelineItem>
          </LeftTimeline>
        </AccordionDetails>
      </Accordion>
      <Dialog open={isOpen} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{question}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{description}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogSettings({ isOpen: false })}>No</Button>
          <Button variant="contained" onClick={onAgree} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
