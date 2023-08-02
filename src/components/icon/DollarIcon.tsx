import { SvgIcon, SvgIconProps } from '@mui/material';

export const DollarIcon = (props: SvgIconProps) => (
  <SvgIcon {...props}>
    <circle cx="12" cy="12" r="10" />
    <path
      d="M14 10C14 8.89543 13.1046 8 12 8C10.8954 8 10 8.89543 10 10C10 11.1046 10.8954 12 12 12"
      strokeLinecap="round"
    />
    <path
      d="M12 12C13.1046 12 14 12.8954 14 14C14 15.1046 13.1046 16 12 16C10.8954 16 10 15.1046 10 14"
      strokeLinecap="round"
    />
    <path d="M12 6.5V8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 16V17.5" strokeLinecap="round" strokeLinejoin="round" fill="#28303F" />
  </SvgIcon>
);
