import { Tab, Tabs, Typography } from '@mui/material';
import { Dispatch } from 'react';

type EnumListProps<T extends Record<string, string | number>> = {
  enumValues: T;
  currentValue: number;
  setValue: Dispatch<any>;
};

export const ShouttTabs = <T extends Record<string, string | number>>({
  enumValues,
  currentValue,
  setValue,
}: EnumListProps<T>) => {
  const dict: Record<string, number> = Object.keys(enumValues).reduce((acc, key) => {
    if (isNaN(Number(key))) {
      const value = enumValues[key];
      return { ...acc, [key]: value };
    }
    return acc;
  }, {});
  return (
    <Tabs value={currentValue} onChange={(e, newValue) => setValue(newValue)}>
      {Object.keys(dict).map(key => (
        <Tab
          label={<Typography variant="subtitle2">{key}</Typography>}
          sx={{ textTransform: 'none' }}
          key={dict[key]}
          value={dict[key]}
        ></Tab>
      ))}
    </Tabs>
  );
};
