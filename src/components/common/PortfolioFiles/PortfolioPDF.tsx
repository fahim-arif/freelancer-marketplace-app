import { ImageListItemBar, Paper, TextField, Typography, styled, useTheme } from '@mui/material';
import BlobPDF from 'components/common/BlobFiles/BlobPDF';
import React from 'react';
import PortfolioDeleteIcon from './PortfolioDeleteIcon';

interface IPortfolioPDFProps {
  extension: string;
  id: string;
  directory: string;
  fileName: string;
  onDelete?: (id: string) => void;
  onNameChange?: (id: string, fileName: string) => void;
  isEditView: boolean;
}

const StyledPaper = styled(Paper)(() => ({
  height: '100%',
  minHeight: '150px',
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  alignItems: 'center',
  borderRadius: '8px',
}));

const EllipsisWrapperDiv = styled('div')`
  display: table;
  table-layout: fixed;
  width: 100%;
  white-space: nowrap;
`;

const EllipsisTypography = styled(Typography)(() => ({
  display: 'table-cell',
}));

EllipsisTypography.defaultProps = {
  noWrap: true,
};

export default function PortfolioPDF(props: IPortfolioPDFProps): JSX.Element {
  const theme = useTheme();
  return (
    <React.Fragment>
      <StyledPaper square variant="outlined">
        <BlobPDF id={props.id} directory={props.directory} extension={props.extension}></BlobPDF>
      </StyledPaper>

      {props.isEditView && <PortfolioDeleteIcon id={props.id} onDelete={props.onDelete} />}

      {props.isEditView && (
        <ImageListItemBar
          position="bottom"
          className="image-list-header-bar"
          title={
            <TextField
              sx={{ input: { color: 'grey.600' }, marginBottom: '20px' }}
              inputProps={{ style: { fontSize: '0.8rem' } }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (props.onNameChange !== undefined) {
                  props.onNameChange(props.id, e.target.value);
                }
              }}
              hiddenLabel
              variant="standard"
              size="small"
              value={props.fileName}
            />
          }
        />
      )}

      {!props.isEditView && (
        <ImageListItemBar
          position="bottom"
          className="image-list-header-bar"
          title={
            <EllipsisWrapperDiv>
              <EllipsisTypography variant="body2" color={theme.palette.grey[600]} title={props.fileName}>
                {props.fileName}
                {props.extension}
              </EllipsisTypography>
            </EllipsisWrapperDiv>
          }
        />
      )}
    </React.Fragment>
  );
}
