import { SelectProps } from '@mui/material/Select';
import { ErrorSelectProps } from 'global/interfaces/selects';
import FormSelect from './FormSelect';

interface YearSelectProps extends ErrorSelectProps, SelectProps {}

export default function YearSelect(props: YearSelectProps): JSX.Element {
  const year = new Date().getFullYear();
  // Drop down for last 30 years
  const years = Array.from(new Array(30), (val, index) => Math.abs(index - year));
  const items = years.map(year => ({ id: year, label: year.toString() }));

  return <FormSelect {...props} items={items} />;
}
