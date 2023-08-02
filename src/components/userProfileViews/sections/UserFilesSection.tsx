import { Box, Grid, Stack, Typography, styled, useTheme } from '@mui/material';
import { FileIcon } from 'components/icon/FileIcon';
import { FolderIcon } from 'components/icon/FolderIcon';
import { IPortfolioFile } from 'global/interfaces/user';
import { openPDF } from 'utils/file';

const FlexBox = styled(Box)`
  display: flex;
  align-items: center;
`;

const PaddedBox = styled(FlexBox)(() => ({
  marginTop: '32px',
  paddingLeft: '24px',
  paddingRight: '24px',
}));

const StyledFolderIcon = styled(FolderIcon)(({ theme }) => ({
  width: '32px',
  height: '32px',
  fill: 'none',
  stroke: theme.palette.grey[600],
}));

const StyledFileBox = styled(Box)(({ theme }) => ({
  cursor: 'pointer',
  height: '150px',
  width: '150px',
  display: 'flex',
  padding: '16px',
  justifyContent: 'center',
  alignItems: 'center',
  borderColor: theme.palette.grey[200],
  borderWidth: '1px',
  borderStyle: 'solid',
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

const StyledBox = styled(Box)(({ theme }) => ({
  width: '70px',
  height: '70px',
  cursor: 'pointer',
  borderRadius: '50%',
  backgroundColor: theme.palette.primary[100],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledFileIcon = styled(FileIcon)(({ theme }) => ({
  width: '50px',
  height: '50px',
  fill: 'none',
  stroke: theme.palette.primary[600],
}));

interface IUserFilesSectionProps {
  pdfFiles: IPortfolioFile[];
}

export default function UserFilesSection(props: IUserFilesSectionProps) {
  const theme = useTheme();

  return (
    <>
      <PaddedBox>
        <StyledFolderIcon />
        <Typography marginLeft={2} variant="h5" color={theme.palette.grey[900]}>
          Documents
        </Typography>
      </PaddedBox>
      <Grid container direction="row" justifyContent="flex-start" alignItems="center" spacing={2} sx={{ p: 3, pb: 2 }}>
        {props.pdfFiles.map((p: IPortfolioFile, index: number) => [
          <Grid item key={index}>
            <StyledFileBox onClick={() => openPDF(`${p.directory}/${p.id}${p.extension}`)}>
              <Stack direction="column" spacing={2} alignItems="center">
                <StyledBox>
                  <StyledFileIcon />
                </StyledBox>
                <EllipsisWrapperDiv>
                  <EllipsisTypography variant="body2" color={theme.palette.grey[600]} title={p.name}>
                    {p.name}
                    {p.extension}
                  </EllipsisTypography>
                </EllipsisWrapperDiv>
              </Stack>
            </StyledFileBox>
          </Grid>,
        ])}
      </Grid>
    </>
  );
}
