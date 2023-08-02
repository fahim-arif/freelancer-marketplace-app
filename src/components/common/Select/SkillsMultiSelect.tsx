import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { ISkill } from 'global/interfaces/skill';
import { useMemo } from 'react';
import { CircularProgress, debounce } from '@mui/material';

export interface ISkillsMultiSelectProps {
  options: ISkill[];
  values: ISkill[];
  onChange: (skills: ISkill[]) => void;
  onInputChange: (value: string) => void;
  error: boolean;
  helpertext?: string;
  loading: boolean;
}

export default function SkillsMultiSelect({
  options,
  values,
  onChange,
  error,
  helpertext,
  onInputChange,
  loading,
}: ISkillsMultiSelectProps): JSX.Element {
  const handleOnChange = (_: unknown, values: (string | ISkill)[]) => {
    const skills = values.map(value => (typeof value === 'string' ? { value } : value));
    onChange(skills);
  };

  const handleOnInputChange = (_: unknown, value: string) => {
    onInputChange(value);
  };

  const handleOnInputChangeDebounced = useMemo(() => debounce(handleOnInputChange, 300), [handleOnInputChange]);

  return (
    <Autocomplete
      multiple
      options={options}
      freeSolo
      onChange={handleOnChange}
      filterOptions={x => x}
      value={values}
      loading={loading}
      onInputChange={handleOnInputChangeDebounced}
      renderTags={(value, getTagProps) =>
        // eslint-disable-next-line react/jsx-key
        value.map((option, index) => <Chip variant="outlined" label={option.value} {...getTagProps({ index })} />)
      }
      renderInput={params => (
        <TextField
          error={error}
          helperText={helpertext}
          {...params}
          variant="outlined"
          label="Skills"
          placeholder="Maximum of 8 Skills"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      getOptionLabel={option => (typeof option === 'string' ? option : option.value)}
    />
  );
}
