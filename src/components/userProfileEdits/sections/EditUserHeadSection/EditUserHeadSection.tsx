import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  FormControl,
  FormGroup,
  FormHelperText,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
  styled,
} from '@mui/material';
import CountrySelect from 'components/common/Select/CountrySelect';
import SkillsMultiSelect from 'components/common/Select/SkillsMultiSelect';
import ProfileImageEditor from './ProfileImageEditor';
import { FastField, Field, FieldProps, FormikProps } from 'formik';
import IApiError from 'global/interfaces/api';
import { IFileMetadata } from 'global/interfaces/file';
import { ILanguageSkill, IEditableUser } from 'global/interfaces/user';
import { ISkill, ISkillFilters } from 'global/interfaces/skill';
import { useEffect, useState } from 'react';
import { showUIError } from 'utils/errorHandler';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import LanguageEditor from './LanguageEditor';
import { nameof } from 'ts-simple-nameof';

const pageSize = 10;

const LanguagesHeader = styled(Typography)`
  font-size: 16px;
`;

const LanguageGridItem = styled(Grid)`
  border: 1px solid ${({ theme }) => theme.palette.grey[300]};
  border-radius: 8px;
  padding: 16px 20px;
`;

const LanguageTitle = styled(Typography)`
  color: ${({ theme }) => theme.palette.grey[900]};
`;

const LanguageSubtitle = styled(Typography)`
  color: ${({ theme }) => theme.palette.grey[600]};
`;

const LanguageIconWrapperGrid = styled(Grid)`
  text-align: right;
`;

const LanguageAddButton = styled(Button)`
  margin-left: ${({ theme }) => theme.spacing(1)};
`;

interface IEditUserHeadSectionProps {
  expanded: boolean;
  onChange: (event: React.SyntheticEvent, newExpanded: boolean) => void;
  form: FormikProps<IEditableUser>;
  saveImage: (file: File) => Promise<IFileMetadata>;
  getSkills: (filters: ISkillFilters | null) => Promise<ISkill[]>;
  onExpanded: () => void;
}

export const EditUserHeadSection = ({
  expanded,
  onChange,
  form,
  saveImage,
  getSkills,
  onExpanded,
}: IEditUserHeadSectionProps) => {
  const [skills, setSkills] = useState<ISkill[]>([]);
  const [skillsLoading, setSkillsLoading] = useState<boolean>(false);
  const [languageEditorOpen, setLanguageEditorOpen] = useState<boolean>(false);

  const onUpdateLanguages = (languages: ILanguageSkill[]): void => {
    setLanguageEditorOpen(false);
    form.setFieldTouched('languages', true);
    form.setFieldValue('languages', [...languages]);
  };

  const fetchSkills = (value?: string) => {
    setSkillsLoading(true);
    getSkills({ search: value, pageSize: pageSize * 2 })
      .then((retrievedSkills: ISkill[]) => {
        setSkills([...retrievedSkills]);
        setSkillsLoading(false);
      })
      .catch((err: IApiError) => {
        showUIError(err.message);
      });
  };

  useEffect(() => {
    if (form.dirty) {
      fetchSkills();
    }
  }, [form.dirty]);

  const handleCountryChange = (_: React.SyntheticEvent, value: { label: string; code: string } | null): void => {
    form.setFieldValue('country', value?.code, true);
  };

  const handleProfileImgChange = async (file: File): Promise<string> =>
    await new Promise((resolve, reject) => {
      if (file !== null) {
        saveImage(file)
          .then((file: IFileMetadata) => {
            form.setFieldValue('profileImage', file);
            resolve(file.path);
          })
          .catch((err: IApiError) => {
            showUIError(err.message);
            reject(err.message);
          });
      }
    });

  const profilePath = form.values.profileImage ? form.values.profileImage.path : '';
  const usedSkills = form.values.skills.map(s => s.id);
  const filteredSkills = skills.filter(s => usedSkills.indexOf(s.id) < 0).slice(0, pageSize);

  return (
    <Accordion expanded={expanded} onChange={onChange} TransitionProps={{ onEntered: onExpanded }}>
      <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
        <Typography variant="h5">General</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={0}>
          <Grid item xs={12} sm={4} sx={{ p: 1 }}>
            <ProfileImageEditor
              error={form.errors.profileImage}
              isTouched={form.touched.profileImage !== undefined}
              handleProfileImgChange={handleProfileImgChange}
              imagePath={profilePath}
            ></ProfileImageEditor>
          </Grid>
          <Grid item xs={12} sm={8} container>
            <Grid item xs={12}>
              <FormGroup>
                <FormControl sx={{ m: 1 }} variant="standard">
                  <FastField name={nameof<IEditableUser>(x => x.email)}>
                    {({ field, form: { handleChange } }: FieldProps) => (
                      <TextField
                        name={field.name}
                        value={field.value}
                        onChange={handleChange}
                        type="email"
                        label="Email"
                        variant={'outlined'}
                        disabled
                      />
                    )}
                  </FastField>
                </FormControl>
              </FormGroup>
            </Grid>
            <Grid item xs={12}>
              <FormGroup>
                <FormControl sx={{ m: 1 }} variant="standard">
                  <FastField name={nameof<IEditableUser>(x => x.firstName)}>
                    {({ field, form: { handleChange }, meta }: FieldProps) => (
                      <TextField
                        name={field.name}
                        value={field.value}
                        onChange={handleChange}
                        label="First Name"
                        variant="outlined"
                        error={meta.touched && Boolean(meta.error)}
                        helperText={meta.touched ? meta.error : ''}
                      />
                    )}
                  </FastField>
                </FormControl>
              </FormGroup>
            </Grid>
            <Grid item xs={12}>
              <FormGroup>
                <FormControl sx={{ m: 1 }} variant="standard">
                  <FastField name={nameof<IEditableUser>(x => x.lastName)}>
                    {({ field, form: { handleChange }, meta }: FieldProps) => (
                      <TextField
                        name={field.name}
                        value={field.value}
                        onChange={handleChange}
                        label="Last Name"
                        variant="outlined"
                        error={meta.touched && Boolean(meta.error)}
                        helperText={meta.touched ? meta.error : ''}
                      />
                    )}
                  </FastField>
                </FormControl>
              </FormGroup>
            </Grid>
            <Grid item xs={12}>
              <FormGroup>
                <FormControl sx={{ m: 1 }}>
                  <FastField name={nameof<IEditableUser>(x => x.title)}>
                    {({ field, form: { handleChange }, meta }: FieldProps) => (
                      <TextField
                        name={field.name}
                        value={field.value ?? ''}
                        onChange={handleChange}
                        label="Title"
                        variant="outlined"
                        error={meta.touched && Boolean(meta.error)}
                        helperText={meta.touched ? meta.error : ''}
                      />
                    )}
                  </FastField>
                </FormControl>
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormGroup>
                <FormControl sx={{ m: 1 }} variant="standard">
                  <FastField name={nameof<IEditableUser>(x => x.city)}>
                    {({ field, form: { handleChange }, meta }: FieldProps) => (
                      <TextField
                        name={field.name}
                        value={field.value}
                        onChange={handleChange}
                        label="Town/City"
                        variant="outlined"
                        error={meta.touched && Boolean(meta.error)}
                        helperText={meta.touched ? meta.error : ''}
                      />
                    )}
                  </FastField>
                </FormControl>
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormGroup>
                <FormControl sx={{ m: 1 }} variant="standard">
                  <FastField name={nameof<IEditableUser>(x => x.country)}>
                    {({ field, meta }: FieldProps) => (
                      <CountrySelect
                        value={field.value}
                        onChange={handleCountryChange}
                        label="Country"
                        error={meta.touched && Boolean(meta.error)}
                        helperText={meta.touched ? meta.error : ''}
                        disabled={form.values.countryEditable !== undefined && !form.values.countryEditable}
                      />
                    )}
                  </FastField>
                </FormControl>
              </FormGroup>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <FormGroup>
              <FormControl sx={{ m: 1 }}>
                <FastField name={nameof<IEditableUser>(x => x.bio)}>
                  {({ field, form: { handleChange }, meta }: FieldProps) => (
                    <TextField
                      name={field.name}
                      value={field.value ?? ''}
                      onChange={handleChange}
                      label="Bio"
                      variant={'outlined'}
                      multiline
                      rows={4}
                      error={meta.touched && Boolean(meta.error)}
                      helperText={meta.touched ? meta.error : ''}
                    />
                  )}
                </FastField>
              </FormControl>
            </FormGroup>
          </Grid>
          <Grid item xs={12}>
            <FormGroup>
              <FormControl sx={{ m: 1 }} variant="standard">
                <Field name={nameof<IEditableUser>(x => x.skills)}>
                  {({ field, form: { setFieldValue }, meta }: FieldProps) => (
                    <SkillsMultiSelect
                      options={filteredSkills}
                      values={field.value}
                      onChange={changedSkills =>
                        setFieldValue(
                          nameof<IEditableUser>(x => x.skills),
                          changedSkills,
                        )
                      }
                      onInputChange={fetchSkills}
                      loading={skillsLoading}
                      error={meta.touched && Boolean(meta.error)}
                      helpertext={meta.touched ? meta.error?.toString() : ''}
                    />
                  )}
                </Field>
              </FormControl>
            </FormGroup>
          </Grid>
          <Grid item xs={12} sx={{ m: 1 }}>
            <Stack direction="row" alignItems="center" sx={{ mb: 2 }}>
              <LanguagesHeader variant="caption">Languages</LanguagesHeader>
              <LanguageAddButton variant="outlined" onClick={() => setLanguageEditorOpen(true)}>
                Add
              </LanguageAddButton>
            </Stack>
            <Grid container spacing={1} sx={{ pb: 1 }}>
              {form.values.languages.map((language, i) => (
                <Grid item xs={12} sm={4} key={i}>
                  <LanguageGridItem container>
                    <Grid item xs={11}>
                      <LanguageTitle variant="subtitle1">{language.language}</LanguageTitle>
                      <LanguageSubtitle variant="body2">{language.proficiency}</LanguageSubtitle>
                    </Grid>
                    <LanguageIconWrapperGrid item xs={1}>
                      <IconButton onClick={() => setLanguageEditorOpen(true)}>
                        <BorderColorOutlinedIcon />
                      </IconButton>
                    </LanguageIconWrapperGrid>
                  </LanguageGridItem>
                </Grid>
              ))}
              {form.touched.languages !== undefined && form.errors.languages && (
                <Grid sx={{ p: 1 }} item xs={12}>
                  <FormHelperText error>{form.errors.languages.toString()}</FormHelperText>
                </Grid>
              )}
            </Grid>
            <LanguageEditor
              languages={form.values.languages}
              error={form.touched.languages !== undefined && Boolean(form.errors.languages)}
              onUpdateLanguages={onUpdateLanguages}
              onCloseClick={() => setLanguageEditorOpen(false)}
              open={languageEditorOpen}
            />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};
