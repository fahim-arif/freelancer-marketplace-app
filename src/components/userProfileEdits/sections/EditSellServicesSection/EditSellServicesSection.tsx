import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  FormControlLabel,
  FormGroup,
  Grid,
  Switch,
  Typography,
} from '@mui/material';
import { FormikProps } from 'formik';
import { IEditableUser } from 'global/interfaces/user';
import { VettingStatusBadge } from './VettingStatusBadge';
import { ScreeningLinks } from './ScreeningLinks';
import { PricingEditor } from './PricingEditor';

interface IEditSellServicesSectionProps {
  expanded: boolean;
  onChange: (event: React.SyntheticEvent, newExpanded: boolean) => void;
  form: FormikProps<IEditableUser>;
  onExpanded: () => void;
}

export const EditSellServicesSection = ({ expanded, onChange, form, onExpanded }: IEditSellServicesSectionProps) => {
  const handleSellStatusChange = () => {
    form.setFieldValue('isSellingServices', !form.values.isSellingServices);
  };

  return (
    <Accordion expanded={expanded} onChange={onChange} TransitionProps={{ onEntered: onExpanded }}>
      <AccordionSummary>
        <Typography variant="h5">Sell services</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ p: 1 }}>
          <Typography variant="h6">Do you want to sell services?</Typography>
          <FormGroup>
            <FormControlLabel
              control={<Switch checked={form.values.isSellingServices} />}
              label={undefined}
              onChange={handleSellStatusChange}
            />
          </FormGroup>
        </Box>
        <Grid container spacing={0} sx={{ p: 1, display: !form.values.isSellingServices ? 'none' : 'inherit' }}>
          <Grid item xs={12}>
            <VettingStatusBadge vettingStatus={form.values.vetting.status} />
          </Grid>
          <Grid item xs={12}>
            <ScreeningLinks form={form} />
          </Grid>
          <Grid item xs={12}>
            <PricingEditor form={form} />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};
