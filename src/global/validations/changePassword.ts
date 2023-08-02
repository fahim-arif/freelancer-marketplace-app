import { IChangePasswordForm } from 'global/interfaces/changePassword';
import { object, string, SchemaOf, ref } from 'yup';

export const changePasswordValidation: SchemaOf<IChangePasswordForm> = object({
  newPassword: string()
    .required('New password is required')
    .min(8, 'New password must be a minimum of 8 characters')
    .max(50, 'Maximum of 50 characters allowed'),
  confirmNewPassword: string()
    .required('Confirm Password is required')
    .oneOf([ref('newPassword'), null], 'Confirm Password must match New Password'),
});
