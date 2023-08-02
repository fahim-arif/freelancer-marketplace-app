import { SvgIcon, SvgIconProps } from '@mui/material';

export const TaskIcon = (props: SvgIconProps) => (
  <SvgIcon {...props}>
    <svg
      width={props.width ?? '20'}
      height={props.height ?? '22'}
      viewBox="0 0 20 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 8H10M6 12H14M6 16H14M13.9995 1V4M5.99951 1V4M5 2.5H15C17.2091 2.5 19 4.29086 19 6.5V17C19 19.2091 17.2091 21 15 21H5C2.79086 21 1 19.2091 1 17V6.5C1 4.29086 2.79086 2.5 5 2.5Z"
        stroke={props.color ?? '#2B43CA'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </SvgIcon>
);
