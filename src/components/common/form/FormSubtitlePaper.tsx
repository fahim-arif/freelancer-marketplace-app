import { Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

export const FormSubtitlePaper = styled(Paper)`
  border: 0;
  height: 50px;
  background-color: ${({ theme }) => theme.palette.grey[200]};
  padding: ${({ theme }) => theme.spacing(1.25)};
  margin-bottom: ${({ theme }) => theme.spacing(1.25)};
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
`;
