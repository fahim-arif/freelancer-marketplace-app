import { SelectProps } from '@mui/material/Select';
import { ErrorSelectProps } from 'global/interfaces/selects';
import FormSelect from './FormSelect';

interface MonthSelectProps extends ErrorSelectProps, SelectProps {}

const months = Array.from({ length: 12 }, (_, i) => i + 1);

export default function MonthSelect(props: MonthSelectProps): JSX.Element {
  const items = months.map(x => ({ id: x, label: x.toString() }));

  return <FormSelect {...props} items={items} />;
}
