import { useFormik } from 'formik';
import { ISignUpForm } from 'global/interfaces/signup';
import { editSignUpValidation } from 'global/validations/signup';
import { useState } from 'react';
import { AccountVerification } from './sections/AccountVerification';
import { SignupForm } from './sections/SignupForm';
import { verifyEmail } from 'services/userService';

export const SignupRenderer: React.FC = () => {
  const [isVerify, setVerify] = useState<boolean>(false);
  const [codeError, setCodeError] = useState<boolean>(false);

  const form = useFormik<ISignUpForm>({
    initialValues: {
      firstName: '',
      lastName: '',
      city: '',
      country: '',
      email: '',
      password: '',
      confirmPassword: '',
      confirmationCode: 0,
    },
    validationSchema: editSignUpValidation,
    onSubmit: async (values: ISignUpForm) => {
      verifyEmail(values.email)
        .then(() => setVerify(true))
        .catch(() => setCodeError(true));
    },
  });

  return (
    <>
      {isVerify ? (
        <AccountVerification form={form} codeError={codeError} setCodeError={setCodeError} />
      ) : (
        <SignupForm {...form} />
      )}
    </>
  );
};
