import { SvgIcon, SvgIconProps } from '@mui/material';

export const AddIconContained = (props: SvgIconProps) => (
  <SvgIcon {...props}>
    <path
      d="M11 7V15M15 11H7M17 1H5C2.79086 1 1 2.79086 1 5V17C1 19.2091 2.79086 21 5 21H17C19.2091 21 21 19.2091 21 17V5C21 2.79086 19.2091 1 17 1Z"
      stroke={props.style?.color ?? undefined}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SvgIcon>
);
