import { GitHub, InsertLink, Instagram, LinkedIn, MoreHoriz, SportsBasketball, Twitter } from '@mui/icons-material';
import { FormControl, FormGroup, FormHelperText, Grid, InputAdornment, TextField, Typography } from '@mui/material';
import { BehanceIcon } from 'components/common/StyledIcons/BehanceIcon';
import { StackOverflowIcon } from 'components/common/StyledIcons/StackOverflowIcon';
import { TikTokIcon } from 'components/common/StyledIcons/TikTokIcon';
import { FastField, FieldProps, FormikProps } from 'formik';
import { IEditableUser } from 'global/interfaces/user';
import { nameof } from 'ts-simple-nameof';

interface IScreeningLinksProps {
  form: FormikProps<IEditableUser>;
}

export const ScreeningLinks = ({ form }: IScreeningLinksProps) => {
  const hasError =
    form.touched.links?.behance !== undefined &&
    form.errors.isScreenLinkError !== undefined &&
    form.errors.isScreenLinkError !== null;
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} sx={{ mt: 2 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Screening links
        </Typography>
        <FormHelperText sx={{ mb: 1 }} error={hasError}>
          Provide up to 3 links for our moderators to review and assess your suitability for inclusion on Shoutt. These
          will not be published on your profile but are an important part of the moderation process.
        </FormHelperText>
      </Grid>
      <Grid item xs={6} sm={12}>
        <FormGroup>
          <FormControl>
            <FastField name={`${nameof<IEditableUser>(x => x.links.behance)}`}>
              {({ field, form: { handleChange }, meta }: FieldProps) => (
                <TextField
                  name={field.name}
                  value={field.value ?? ''}
                  onChange={handleChange}
                  variant="outlined"
                  placeholder="Behance"
                  error={meta.touched && Boolean(meta.error)}
                  helperText={meta.touched ? meta.error : ''}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BehanceIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            </FastField>
          </FormControl>
        </FormGroup>
      </Grid>

      <Grid item xs={6} sm={4}>
        <FormGroup>
          <FormControl>
            <FastField name={`${nameof<IEditableUser>(x => x.links.personalSite)}`}>
              {({ field, form: { handleChange }, meta }: FieldProps) => (
                <TextField
                  name={field.name}
                  value={field.value ?? ''}
                  onChange={handleChange}
                  variant="outlined"
                  placeholder="Personal site"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <InsertLink />
                      </InputAdornment>
                    ),
                  }}
                  error={meta.touched && Boolean(meta.error)}
                  helperText={meta.touched ? meta.error : ''}
                />
              )}
            </FastField>
          </FormControl>
        </FormGroup>
      </Grid>

      <Grid item xs={6} sm={4}>
        <FormGroup>
          <FormControl>
            <FastField name={`${nameof<IEditableUser>(x => x.links.github)}`}>
              {({ field, form: { handleChange }, meta }: FieldProps) => (
                <TextField
                  name={field.name}
                  value={field.value ?? ''}
                  onChange={handleChange}
                  variant="outlined"
                  placeholder="Github"
                  error={meta.touched && Boolean(meta.error)}
                  helperText={meta.touched ? meta.error : ''}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <GitHub />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            </FastField>
          </FormControl>
        </FormGroup>
      </Grid>

      <Grid item xs={6} sm={4}>
        <FormGroup>
          <FormControl>
            <FastField name={`${nameof<IEditableUser>(x => x.links.linkedIn)}`}>
              {({ field, form: { handleChange }, meta }: FieldProps) => (
                <TextField
                  name={field.name}
                  value={field.value ?? ''}
                  onChange={handleChange}
                  variant="outlined"
                  placeholder="LinkedIn"
                  error={meta.touched && Boolean(meta.error)}
                  helperText={meta.touched ? meta.error : ''}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LinkedIn />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            </FastField>
          </FormControl>
        </FormGroup>
      </Grid>

      <Grid item xs={6} sm={4}>
        <FormGroup>
          <FormControl>
            <FastField name={`${nameof<IEditableUser>(x => x.links.instagram)}`}>
              {({ field, form: { handleChange }, meta }: FieldProps) => (
                <TextField
                  name={field.name}
                  value={field.value ?? ''}
                  onChange={handleChange}
                  variant="outlined"
                  placeholder="Instagram"
                  error={meta.touched && Boolean(meta.error)}
                  helperText={meta.touched ? meta.error : ''}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Instagram />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            </FastField>
          </FormControl>
        </FormGroup>
      </Grid>

      <Grid item xs={6} sm={4}>
        <FormGroup>
          <FormControl>
            <FastField name={`${nameof<IEditableUser>(x => x.links.stackOverflow)}`}>
              {({ field, form: { handleChange }, meta }: FieldProps) => (
                <TextField
                  name={field.name}
                  value={field.value ?? ''}
                  onChange={handleChange}
                  variant="outlined"
                  placeholder="Stack Overflow"
                  error={meta.touched && Boolean(meta.error)}
                  helperText={meta.touched ? meta.error : ''}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <StackOverflowIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            </FastField>
          </FormControl>
        </FormGroup>
      </Grid>

      <Grid item xs={6} sm={4}>
        <FormGroup>
          <FormControl>
            <FastField name={`${nameof<IEditableUser>(x => x.links.twitter)}`}>
              {({ field, form: { handleChange }, meta }: FieldProps) => (
                <TextField
                  name={field.name}
                  value={field.value ?? ''}
                  onChange={handleChange}
                  variant="outlined"
                  placeholder="Twitter"
                  error={meta.touched && Boolean(meta.error)}
                  helperText={meta.touched ? meta.error : ''}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Twitter />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            </FastField>
          </FormControl>
        </FormGroup>
      </Grid>

      <Grid item xs={6} sm={4}>
        <FormGroup>
          <FormControl>
            <FastField name={`${nameof<IEditableUser>(x => x.links.dribbble)}`}>
              {({ field, form: { handleChange }, meta }: FieldProps) => (
                <TextField
                  name={field.name}
                  value={field.value ?? ''}
                  onChange={handleChange}
                  variant="outlined"
                  placeholder="Dribbble"
                  error={meta.touched && Boolean(meta.error)}
                  helperText={meta.touched ? meta.error : ''}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SportsBasketball />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            </FastField>
          </FormControl>
        </FormGroup>
      </Grid>

      <Grid item xs={6} sm={4}>
        <FormGroup>
          <FormControl>
            <FastField name={`${nameof<IEditableUser>(x => x.links.tikTok)}`}>
              {({ field, form: { handleChange }, meta }: FieldProps) => (
                <TextField
                  name={field.name}
                  value={field.value ?? ''}
                  onChange={handleChange}
                  variant="outlined"
                  placeholder="Tik Tok"
                  error={meta.touched && Boolean(meta.error)}
                  helperText={meta.touched ? meta.error : ''}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <TikTokIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            </FastField>
          </FormControl>
        </FormGroup>
      </Grid>

      <Grid item xs={6} sm={4}>
        <FormGroup>
          <FormControl>
            <FastField name={`${nameof<IEditableUser>(x => x.links.other)}`}>
              {({ field, form: { handleChange }, meta }: FieldProps) => (
                <TextField
                  name={field.name}
                  value={field.value ?? ''}
                  onChange={handleChange}
                  variant="outlined"
                  placeholder="Other"
                  error={meta.touched && Boolean(meta.error)}
                  helperText={meta.touched ? meta.error : ''}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MoreHoriz />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            </FastField>
          </FormControl>
        </FormGroup>
      </Grid>
    </Grid>
  );
};
