import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { FileIcon } from 'components/icon/FileIcon';
import { openPDF } from 'utils/file';

interface BlobImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  extension: string;
  id: string;
  directory: string;
}

const StyledBox = styled(Box)(({ theme }) => ({
  cursor: 'pointer',
  padding: '10px',
  margin: '40px',
  marginTop: '30px',
  borderRadius: '50%',
  backgroundColor: theme.palette.primary[100],
  display: 'flex',
  alignItems: 'center',
}));

const StyledFileIcon = styled(FileIcon)(({ theme }) => ({
  width: '50px',
  height: '50px',
  fill: 'none',
  stroke: theme.palette.primary[600],
}));

export default function BlobPDF(props: BlobImageProps): JSX.Element {
  const { extension, id, directory, ...imgProps } = props;
  const pdfPath = `${directory}/${id}${extension}`;
  return (
    <StyledBox onClick={() => openPDF(pdfPath)} {...imgProps}>
      <StyledFileIcon />
    </StyledBox>
  );
}
