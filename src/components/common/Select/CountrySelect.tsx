import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

interface CountrySelectProps {
  label: string;
  error?: boolean;
  helperText?: string;
  onChange?: (event: React.SyntheticEvent, value: { label: string; code: string } | null) => void;
  value?: string;
  disabled?: boolean;
}

export default function CountrySelect(props: CountrySelectProps): JSX.Element {
  return (
    <Autocomplete
      isOptionEqualToValue={(option, value) => option.code === value.code && option.label === value.label}
      value={countryCodeValues[props.value ?? ''] ?? null}
      options={countryList}
      onChange={props.onChange}
      autoHighlight
      getOptionLabel={option => option.label}
      disabled={props.disabled}
      renderOption={(props, option) => (
        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
          <img
            loading="lazy"
            width="20"
            src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
            srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
            alt=""
          />
          {option.label}
        </Box>
      )}
      renderInput={params => (
        <TextField
          {...params}
          label={props.label}
          error={props.error}
          helperText={props.helperText}
          inputProps={{
            ...params.inputProps,
            autoComplete: 'new-password', // disable autocomplete and autofill
          }}
        />
      )}
    />
  );
}

interface CountryType {
  code: string;
  label: string;
  phone: string;
  suggested?: boolean;
}

// From https://bitbucket.org/atlassian/atlaskit-mk-2/raw/4ad0e56649c3e6c973e226b7efaeb28cb240ccb0/packages/core/select/src/data/countries.js
const countries: readonly CountryType[] = [
  { code: 'AT', label: 'Austria', phone: '43' },
  {
    code: 'AU',
    label: 'Australia',
    phone: '61',
    suggested: true,
  },
  { code: 'BE', label: 'Belgium', phone: '32' },
  { code: 'BG', label: 'Bulgaria', phone: '359' },
  {
    code: 'CA',
    label: 'Canada',
    phone: '1',
    suggested: true,
  },
  { code: 'HR', label: 'Croatia', phone: '385' },
  { code: 'CY', label: 'Cyprus', phone: '357' },
  { code: 'CZ', label: 'Czech Republic', phone: '420' },
  { code: 'DK', label: 'Denmark', phone: '45' },
  { code: 'EE', label: 'Estonia', phone: '372' },
  { code: 'FI', label: 'Finland', phone: '358' },
  {
    code: 'FR',
    label: 'France',
    phone: '33',
    suggested: true,
  },
  {
    code: 'DE',
    label: 'Germany',
    phone: '49',
    suggested: true,
  },
  { code: 'GI', label: 'Gibraltar', phone: '350' },
  { code: 'GR', label: 'Greece', phone: '30' },
  { code: 'HK', label: 'Hong Kong', phone: '852' },
  { code: 'HU', label: 'Hungary', phone: '36' },
  { code: 'IE', label: 'Ireland', phone: '353' },
  { code: 'IT', label: 'Italy', phone: '39' },
  {
    code: 'JP',
    label: 'Japan',
    phone: '81',
    suggested: true,
  },
  { code: 'LV', label: 'Latvia', phone: '371' },
  { code: 'LI', label: 'Liechtenstein', phone: '423' },
  { code: 'LT', label: 'Lithuania', phone: '370' },
  { code: 'LU', label: 'Luxembourg', phone: '352' },
  { code: 'MT', label: 'Malta', phone: '356' },
  { code: 'MX', label: 'Mexico', phone: '52' },
  { code: 'NL', label: 'Netherlands', phone: '31' },
  { code: 'NZ', label: 'New Zealand', phone: '64' },
  { code: 'NO', label: 'Norway', phone: '47' },
  { code: 'PL', label: 'Poland', phone: '48' },
  { code: 'PT', label: 'Portugal', phone: '351' },
  { code: 'RO', label: 'Romania', phone: '40' },
  { code: 'SG', label: 'Singapore', phone: '65' },
  { code: 'SK', label: 'Slovakia', phone: '421' },
  { code: 'SI', label: 'Slovenia', phone: '386' },
  { code: 'ES', label: 'Spain', phone: '34' },
  { code: 'SE', label: 'Sweden', phone: '46' },
  { code: 'CH', label: 'Switzerland', phone: '41' },
  { code: 'TH', label: 'Thailand', phone: '66' },
  { code: 'AE', label: 'United Arab Emirates', phone: '971', suggested: true },
  { code: 'GB', label: 'United Kingdom', phone: '44', suggested: true },
  {
    code: 'US',
    label: 'United States',
    phone: '1',
    suggested: true,
  },
];

const countryList: ReadonlyArray<{ label: string; code: string }> = countries.map(function (i) {
  return {
    code: i.code,
    label: i.label,
  };
});

const countryCodeValues: { [key: string]: { label: string; code: string } } = Object.assign(
  {},
  ...countries.map(x => ({ [x.code]: { label: x.label, code: x.code } })),
);
