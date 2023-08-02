import { Accordion, AccordionDetails, AccordionSummary, Grid, Typography } from '@mui/material';
import WorkHistoryEditor from 'components/userProfileEdits/sections/EditWorkHistorySection/WorkHistoryEditor';
import { FormikProps } from 'formik';
import { IEditableUser, IWorkHistory } from 'global/interfaces/user';

interface IEditWorkHistorySectionProps {
  expanded: boolean;
  onChange: (event: React.SyntheticEvent, newExpanded: boolean) => void;
  form: FormikProps<IEditableUser>;
  onExpanded: () => void;
}

export const EditWorkHistorySection = ({ expanded, onChange, form, onExpanded }: IEditWorkHistorySectionProps) => {
  // On History Change
  const onUpdateHistories = (history: IWorkHistory[]): void => {
    form.setFieldValue('workHistories', [...history]);
  };

  return (
    <Accordion expanded={expanded} onChange={onChange} TransitionProps={{ onEntered: onExpanded }}>
      <AccordionSummary>
        <Typography variant="h5">Work History</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={0} sx={{ p: 1 }}>
          <WorkHistoryEditor
            error={form.touched.workHistories !== undefined && Boolean(form.errors.workHistories)}
            onUpdateHistories={onUpdateHistories}
            workHistories={form.values.workHistories}
          />
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};
