import { ISignUpForm } from 'global/interfaces/signup';
import { object, string, SchemaOf, ref, number } from 'yup';
import axios from 'axios';

export const editSignUpValidation: SchemaOf<ISignUpForm> = object({
  firstName: string().required('First Name is required').max(30, 'Maximum of 30 characters allowed'),
  lastName: string().required('Last Name is required').max(30, 'Maximum of 30 characters allowed'),
  city: string().required('City is required').max(50, 'Maximum of 50 characters allowed'),
  country: string().nullable().required('Country is required'),
  email: string()
    .required('Email is required')
    .max(150, 'Maximum of 150 characters allowed')
    .email('Invalid email address')
    .test(
      'Email-backend-validation', // Name
      'Account already registered to this email address', // Msg
      async email => {
        // Res from backend will be flag. True means email is good otherwise it's false
        const validateUrl = `${process.env.REACT_APP_API_URL ?? ''}/core/users/validations/email`;

        const { data } = await axios.post(validateUrl, { email });

        return data;
      },
    ),
  password: string()
    .required('Password is required')
    .min(8, 'Password must be a minimum of 8 characters')
    .max(50, 'Maximum of 50 characters allowed'),
  confirmPassword: string()
    .required('Confirm Password is required')
    .oneOf([ref('password'), null], 'Confirm Password must match Password'),
  confirmationCode: number()
    .defined()
    .when('isSubmit', {
      is: true,
      then: number()
        .min(1, 'You must enter the validation code')
        .max(6, 'Validation code must be 6 characters or less'),
    }),
});
