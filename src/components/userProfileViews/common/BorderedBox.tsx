import { Box, styled } from '@mui/material';

interface IBorderedBoxProps {
  showBorder: boolean;
}

export const BorderedBox = styled(Box, {
  // Configure which props should be forwarded on DOM
  shouldForwardProp: prop => prop !== 'showBorder',
})<IBorderedBoxProps>(({ theme, showBorder }) => ({
  backgroundColor: theme.palette.common.white,
  borderColor: theme.palette.grey[200],
  borderWidth: '1px',
  borderStyle: showBorder ? 'solid' : 'none',
  borderRadius: '8px',
  marginBottom: '16px',
  padding: '24px',
  paddingBottom: showBorder ? '24px' : '0px',
}));
