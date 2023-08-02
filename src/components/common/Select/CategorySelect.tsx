import { SelectProps } from '@mui/material';
import { ErrorSelectProps } from 'global/interfaces/selects';
import FormSelect from './FormSelect';

const categories: string[] = [
  'Web / Graphic Design',
  'UX Design',
  'Film and Motion',
  'Photography',
  'Audio',
  'VA / Support',
  'Development',
  'Market Research',
  'Strategy',
  'Data',
  'Marketing',
  'Copywriting',
  'Project / Content Manager',
  'Events',
  'Finance',
];

interface CategorySelectProps extends ErrorSelectProps, SelectProps {}

export default function CategorySelect({ ...props }: CategorySelectProps): JSX.Element {
  const categoryItems = categories.map(category => ({ id: category, label: category }));
  const items = [{ id: '', label: 'None' }, ...categoryItems];

  return <FormSelect {...props} items={items} />;
}
