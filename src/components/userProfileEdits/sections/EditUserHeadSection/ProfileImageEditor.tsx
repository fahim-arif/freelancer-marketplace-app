import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { PhotoCamera } from '@mui/icons-material';
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';
import { FormHelperText, Paper, useMediaQuery, useTheme } from '@mui/material';
import FaceIcon from '@mui/icons-material/Face';
import { profileContainer } from 'global/constants';
import React, { useState } from 'react';
import { getBase64Image } from 'utils/file';
import Croppie from 'croppie';
import 'croppie/croppie.css';

interface IProfileImageEditorProps {
  handleProfileImgChange: (file: File) => Promise<string>;
  error: string | undefined;
  imagePath: string | undefined;
  isTouched: boolean;
}

export default function ProfileImageEditor(props: IProfileImageEditorProps): JSX.Element {
  const theme = useTheme();
  const matchesSm = useMediaQuery(theme.breakpoints.down('sm'), { noSsr: true });

  const [cropImage, setCropImage] = useState('');
  const [croppie, setCroppie] = useState<Croppie | null>(null);

  // Initialize image cropper
  const handleImage = (image: string): void => {
    const el = document.getElementById('image-helper');
    if (el !== null) {
      const croppieInstance = new Croppie(el, {
        viewport: {
          height: 280,
          width: matchesSm ? 310 : 360,
        },
        showZoomer: false,
      });
      croppieInstance.bind({
        url: image,
      });
      setCroppie(croppieInstance);
    }
  };

  const handleImageInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file: File | null = event.target.files !== null ? event.target.files[0] : null;
    if (file !== null) {
      getBase64Image(file).then((res: string) => {
        setCropImage(file.name);
        handleImage(res);
      });
    }
  };

  const handleCancelCrop = (e: React.MouseEvent): void => {
    e.preventDefault();
    setCroppie(null);
    setCropImage('');
  };

  const handleApplyCrop = (e: React.MouseEvent): void => {
    e.preventDefault();
    if (croppie !== null) {
      croppie
        .result({
          type: 'blob',
          size: 'viewport',
          quality: 1,
        })
        .then((blob: Blob) => {
          props.handleProfileImgChange(new File([blob], cropImage, { type: blob.type })).finally(() => {
            setCropImage('');
            setCroppie(null);
          });
        });
    }
  };

  // Check edit mode or existing picture and render relevant sub-component
  return cropImage !== ''
    ? imageCropper(props, handleCancelCrop, handleApplyCrop)
    : profilePicture(props, handleImageInputChange);
}

function imageCropper(
  props: IProfileImageEditorProps,
  handleCancelCrop: React.MouseEventHandler,
  handleApplyCrop: React.MouseEventHandler,
): JSX.Element {
  return (
    <Grid container columnSpacing={1}>
      <Grid item xs={6}>
        <Button
          fullWidth
          size="large"
          onClick={handleCancelCrop}
          component={'label'}
          color={'info'}
          variant="outlined"
          startIcon={<ClearIcon />}
        >
          Cancel
        </Button>
      </Grid>
      <Grid item xs={6}>
        <Button
          fullWidth
          size="large"
          onClick={handleApplyCrop}
          component={'label'}
          variant="contained"
          startIcon={<DoneIcon />}
        >
          Apply
        </Button>
      </Grid>

      <Grid xs={12} item>
        <Paper
          variant="outlined"
          sx={{
            mt: 1,
            p: '0.1rem',
            width: 'auto',
            height: '290px',
            maxWidth: '100%',
          }}
        >
          <div id="image-helper"></div>
        </Paper>
      </Grid>
      {props.isTouched && Boolean(props.error) && (
        <Grid item>
          <FormHelperText sx={{ textAlign: 'center' }} error>
            {props.error}
          </FormHelperText>
        </Grid>
      )}
    </Grid>
  );
}

function profilePicture(
  props: IProfileImageEditorProps,
  handleProfileImgChange: React.ChangeEventHandler,
): JSX.Element {
  return (
    <Grid container width={1}>
      <Grid item xs={12}>
        <Button fullWidth size="large" component={'label'} variant="outlined" endIcon={<PhotoCamera />}>
          Profile Pic
          <input onChange={handleProfileImgChange} hidden accept="image/*" type="file" />
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Paper
          variant="outlined"
          sx={{
            textAlign: 'center',
            mt: 1,
            width: '100%',
            height: '290px',
            maxWidth: '100%',
          }}
        >
          {props.imagePath !== '' ? (
            <img
              height={'100%'}
              width={'100%'}
              src={`${String(process.env.REACT_APP_CDN_URL) ?? ''}/${profileContainer}/${String(props.imagePath)}`}
            ></img>
          ) : (
            <FaceIcon
              sx={{
                height: '100%',
                width: '100%',
              }}
              color={'disabled'}
            ></FaceIcon>
          )}
        </Paper>
      </Grid>
      {props.isTouched && Boolean(props.error) && (
        <Grid item>
          <FormHelperText sx={{ textAlign: 'center' }} error>
            {props.error}
          </FormHelperText>
        </Grid>
      )}
    </Grid>
  );
}
