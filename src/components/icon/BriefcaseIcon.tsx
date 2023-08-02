import { SvgIcon, SvgIconProps } from '@mui/material';

export const BriefcaseIcon = (props: SvgIconProps) => (
  <SvgIcon {...props}>
    <rect x="2" y="6" rx="4" width="20" height="16" />
    <path d="M8 6V5C8 3.34315 9.34315 2 11 2H13C14.6569 2 16 3.34315 16 5V6" strokeLinecap="round" />
    <path d="M2 13H22" strokeLinecap="round" />
    <path
      d="M14 13C14 14.1046 13.1046 15 12 15C10.8954 15 10 14.1046 10 13C10 11.8954 10.8954 11 12 11C13.1046 11 14 11.8954 14 13Z"
      fill="#28303F"
    />
  </SvgIcon>
);
