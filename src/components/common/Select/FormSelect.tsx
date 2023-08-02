import Select, { SelectProps } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { FormHelperText, styled } from '@mui/material';
import { ErrorSelectProps, SelectItem } from 'global/interfaces/selects';

const StyledSelect = styled(Select)(() => ({
  height: '44px',
}));

const StyledInputLabel = styled(InputLabel)(() => ({
  paddingTop: 0,
  marginTop: -5,
}));

interface FormSelectProps extends SelectProps, ErrorSelectProps {
  items: SelectItem[];
}

export default function FormSelect({ items, ...props }: FormSelectProps): JSX.Element {
  return (
    <FormControl fullWidth>
      <StyledInputLabel error={props.error}>{props.label}</StyledInputLabel>
      <StyledSelect {...props}>
        {items.map(item => (
          <MenuItem key={item.id} value={item.id}>
            {item.label}
          </MenuItem>
        ))}
      </StyledSelect>
      {props.error === true && <FormHelperText error>{props.helpertext}</FormHelperText>}
    </FormControl>
  );
}
