import { Accordion, AccordionDetails, AccordionSummary, Grid, Typography } from '@mui/material';
import MultiFileUpload from 'components/common/PortfolioFiles/MultiFileUpload';
import { FormikErrors, FormikProps } from 'formik';
import { FileType } from 'global/enums/fileTypes';
import { IFileMetadata } from 'global/interfaces/file';
import { IPortfolioFile, IEditableUser } from 'global/interfaces/user';

interface IEditPortfolioSectionProps {
  expanded: boolean;
  onChange: (event: React.SyntheticEvent, newExpanded: boolean) => void;
  form: FormikProps<IEditableUser>;
  onExpanded: () => void;
}

export const EditPortfolioSection = ({ expanded, onChange, form, onExpanded }: IEditPortfolioSectionProps) => {
  const onFileDelete = (id: string): void => {
    form.setFieldValue('portfolioFiles', [...form.values.portfolioFiles.filter(file => file.id !== id)]);
  };

  const onUploadStatusChange = (status: boolean): void => {
    form.setFieldValue('isUploading', status);
    form.setFieldTouched('isUploading');
  };

  // Handle Portfolio File Add
  const handleAddPortfolioFile = (file: IFileMetadata): void => {
    const isFeatured =
      form.values.portfolioFiles.filter(f => f.type == FileType.Image).length == 0 && file.type == FileType.Image;
    form.values.portfolioFiles.push({ ...file, isFeatured: isFeatured });
    form.setFieldValue('portfolioFiles', form.values.portfolioFiles);
  };

  // On File Name Change
  const onNameChange = (id: string, fileName: string): void => {
    const files = form.values.portfolioFiles;
    const fileIndex = files.findIndex(file => file.id === id);
    if (fileIndex > -1) {
      files[fileIndex].name = fileName;
    }
    form.setFieldValue('portfolioFiles', [...files]);
  };

  // On Featured
  const onFeaturedSelected = (id: string): void => {
    const files = form.values.portfolioFiles;
    const updatedFiles = files.map(f => ({ ...f, isFeatured: f.id == id }));
    form.setFieldValue('portfolioFiles', [...updatedFiles]);
  };

  const portfolioFilesError = typeof form.errors.portfolioFiles === 'string' ? form.errors.portfolioFiles : '';
  const isUploadingError = form.errors.isUploading ?? '';
  const nameError: string =
    Array.isArray(form.errors.portfolioFiles) && form.errors.portfolioFiles.length > 0
      ? (form.errors.portfolioFiles as FormikErrors<IPortfolioFile>[]).filter(f => f != undefined)[0].name ?? ''
      : '';
  const error =
    form.touched.portfolioFiles !== undefined
      ? [portfolioFilesError, isUploadingError, nameError].filter(x => x).join('\n')
      : '';

  return (
    <Accordion expanded={expanded} onChange={onChange} TransitionProps={{ onEntered: onExpanded }}>
      <AccordionSummary>
        <Typography variant="h5">Portolio</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={0} sx={{ p: 1 }}>
          <MultiFileUpload
            error={error}
            files={form.values.portfolioFiles}
            onAddFile={handleAddPortfolioFile}
            onNameChange={onNameChange}
            onDelete={onFileDelete}
            onUploadStatusChange={onUploadStatusChange}
            onFeaturedSelected={onFeaturedSelected}
          />
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};
