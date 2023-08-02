import React, { useEffect } from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { ILanguageSkill } from 'global/interfaces/user';
import { useFormik } from 'formik';
import { LanguageProficiency } from 'global/enums/languageProficiency';
import { Language } from 'global/enums/language';
import FormSelect from 'components/common/Select/FormSelect';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import { styled, IconButton } from '@mui/material';

interface IWorkHistoryProps {
  languages: ILanguageSkill[];
  onUpdateLanguages: (languages: ILanguageSkill[]) => void;
  onCloseClick: () => void;
  error: boolean;
  open: boolean;
}

const AddLanguageButton = styled(Button)`
  color: ${({ theme }) => theme.palette.primary[600]};
`;

export default function LanguageEditor({ open, languages, onUpdateLanguages, onCloseClick }: IWorkHistoryProps) {
  const form = useFormik<ILanguageSkill[]>({
    initialValues: languages,
    onSubmit: (values: ILanguageSkill[]) => {
      onUpdateLanguages([...values]);
    },
  });

  useEffect(() => {
    if (form.values != languages) {
      form.setValues([...languages]);
    }
  }, [languages]);

  const handleClose = (): void => {
    form.resetForm();
    onCloseClick();
  };

  const languageItems = Object.values(Language).map(vs => ({ id: vs.toString(), label: vs.toString() }));
  const languageProficiencyItems = Object.values(LanguageProficiency).map(vs => ({
    id: vs.toString(),
    label: vs.toString(),
  }));

  const handleAddLanguage = () => {
    form.setValues([...form.values, { language: Language.English, proficiency: LanguageProficiency.Proficient }]);
  };

  const handleDelete = (index: number) => () => {
    const newValues = form.values.filter((val, i) => i !== index);
    form.setValues([...newValues]);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth
      maxWidth="xs"
    >
      <form onSubmit={form.handleSubmit}>
        <DialogTitle>Languages</DialogTitle>
        <DialogContent>
          <Grid container spacing={1} sx={{ mt: 0.5 }}>
            {form.values.map((language, i) => (
              <Grid item xs={12} container key={i} spacing={1}>
                <Grid item xs={6}>
                  <FormSelect
                    name={`[${i}].language`}
                    items={languageItems}
                    value={language.language}
                    onChange={form.handleChange}
                    disabled={i === 0 && language.language === Language.English}
                  />
                </Grid>
                <Grid item xs={5}>
                  <FormSelect
                    name={`[${i}].proficiency`}
                    items={languageProficiencyItems}
                    value={language.proficiency}
                    onChange={form.handleChange}
                  />
                </Grid>
                <Grid item xs={1}>
                  <IconButton onClick={handleDelete(i)} disabled={i === 0 && language.language === Language.English}>
                    <ClearIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            <Grid item xs={12}>
              <AddLanguageButton startIcon={<AddIcon />} onClick={handleAddLanguage}>
                Add language
              </AddLanguageButton>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">OK</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
