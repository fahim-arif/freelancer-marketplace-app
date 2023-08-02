import { SvgIcon, SvgIconProps } from '@mui/material';

export const MoneyIcon = (props: SvgIconProps) => (
  <SvgIcon {...props}>
    <rect x="2" y="4" width="20" height="16" rx="4" strokeWidth="1.5" />
    <circle cx="2" cy="2" r="2" transform="matrix(1 0 0 -1 10 14)" strokeWidth="1.5" />
    <circle cx="1" cy="1" r="1" transform="matrix(1 0 0 -1 17 13)" />
    <circle cx="1" cy="1" r="1" transform="matrix(1 0 0 -1 5 13)" />
  </SvgIcon>
);
