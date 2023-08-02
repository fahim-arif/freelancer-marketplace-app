import { Box, Typography } from '@mui/material';
import { FormikProps, Formik } from 'formik';
import { IFileMetadata } from 'global/interfaces/file';
import { IEditableUser, IUser } from 'global/interfaces/user';
import { ISkillFilters, ISkill } from 'global/interfaces/skill';
import { editUserValidation } from 'global/validations/user';
import { showUIError } from 'utils/errorHandler';
import useProgressBar from 'global/hooks/useProgressBar';
import IApiError from 'global/interfaces/api';
import { EditUserProfileForm } from './EditUserProfileForm';

interface IEditUserProfileProps {
  user: IUser;
  saveImage: (file: File) => Promise<IFileMetadata>;
  getSkills: (filters: ISkillFilters | null) => Promise<ISkill[]>;
  upsertUser: (user: IEditableUser) => Promise<IEditableUser>;
}

export const EditUserProfile = ({ user, saveImage, getSkills, upsertUser }: IEditUserProfileProps) => {
  const [progress, showProgress, successRedirect] = useProgressBar();

  const onSubmit = (values: IEditableUser) => {
    showProgress();
    upsertUser(values)
      .then(() => {
        if (values.isSubmittingForVetting) {
          successRedirect('/PaymentDecider');
          return;
        }
        successRedirect(`/users/${user.id}`);
      })
      .catch((err: IApiError) => {
        showProgress(false);
        showUIError(err.message);
      });
  };

  const initialValues: IEditableUser = { ...user, isUploading: false };

  return (
    <Box>
      <Typography variant="h4" sx={{ mr: 1, mb: 1 }}>
        Edit profile
      </Typography>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={editUserValidation}
        validateOnChange={false}
      >
        {(form: FormikProps<IEditableUser>) => (
          <EditUserProfileForm form={form} saveImage={saveImage} getSkills={getSkills} />
        )}
      </Formik>
      {progress}
    </Box>
  );
};
