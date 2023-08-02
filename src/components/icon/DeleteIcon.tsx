import { SvgIcon, SvgIconProps } from '@mui/material';

export const DeleteIcon = (props: SvgIconProps) => (
  <SvgIcon {...props}>
    <svg width="18" height="20" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17.5 8L16.7841 17.3068C16.6238 19.3908 14.886 21 12.7959 21H8.20412C6.11398 21 4.37621 19.3908 4.21591 17.3068L3.5 8M19.5 6C16.9021 4.73398 13.8137 4 10.5 4C7.18635 4 4.09792 4.73398 1.5 6M8.5 4V3C8.5 1.89543 9.39543 1 10.5 1C11.6046 1 12.5 1.89543 12.5 3V4M8.5 10V16M12.5 10V16"
        stroke={props.style?.color ?? undefined}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  </SvgIcon>
);
