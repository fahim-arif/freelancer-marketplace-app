export interface ISignUpForm {
  firstName: string;
  lastName: string;
  city: string;
  country: string;
  email: string;
  password: string;
  confirmPassword: string;
  confirmationCode: number | undefined;
}
