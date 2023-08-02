export interface IChangePasswordForm {
  newPassword: string;
  confirmNewPassword: string;
}

export interface IResetPasswordForm {
  token: string;
}
