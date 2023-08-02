import { styled } from '@mui/material/styles';

export const BorderedForm = styled('form')`
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.palette.grey[200]};
  padding: ${({ theme }) => theme.spacing(1.25)};
`;
