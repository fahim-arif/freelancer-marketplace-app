import DOMPurify from 'dompurify';
import Box from '@mui/material/Box';

interface ISantizeProps {
  html: string;
}

export default function Sanitize(props: ISantizeProps): JSX.Element {
  DOMPurify.setConfig({ ADD_ATTR: ['target'] });
  const clean = DOMPurify.sanitize(props.html);
  return <Box dangerouslySetInnerHTML={{ __html: clean }} />;
}
