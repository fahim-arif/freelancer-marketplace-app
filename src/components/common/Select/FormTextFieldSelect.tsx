import { FormControl, FormHelperText, MenuItem, StandardTextFieldProps, TextField } from '@mui/material';
import { ErrorSelectProps, SelectItem } from 'global/interfaces/selects';

export interface FormTextFieldSelectProps extends StandardTextFieldProps, ErrorSelectProps {
  items: SelectItem[];
}

export const FormTextFieldSelect: React.FC<FormTextFieldSelectProps> = ({
  items,
  ...props
}: FormTextFieldSelectProps) => {
  const localProps = {
    ...props,
    label: props.value !== undefined && props.value !== '' ? undefined : props.label,
  };
  return (
    <FormControl fullWidth>
      <TextField select {...localProps}>
        {items.map((item, i) => (
          <MenuItem key={i} value={item.id}>
            {item.label}
          </MenuItem>
        ))}
      </TextField>
      {props.error === true && <FormHelperText error>{props.helpertext}</FormHelperText>}
    </FormControl>
  );
};
