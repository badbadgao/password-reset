import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import TextField from 'components/TextField';

import './PasswordReset.scss';

interface IFormInput {
  password: string;
}

const MIN_LENGTH = 8;

const schema = yup
  .object()
  .shape({
    password: yup
      .string()
      .required('Must not be empty')
      .test('min_8_characters', 'Must contain at least 8 characters', (currentPassword) => {
        if (currentPassword.length < MIN_LENGTH) {
          return false;
        }
        return true;
      })
      .test('match_constrain', 'Must contain one number and two special characters', (currentPassword) => {
        let isValid = true;
        if (currentPassword.length >= 8 && currentPassword.length < 15) {
          const regex = /^(?=.*\d)(?=.*[\W_].*[\W_])[A-Za-z0-9\W_]{8,}$/;
          isValid = regex.test(currentPassword);
        }

        return isValid;
      }),
  })
  .required();

const PasswordReset = (): JSX.Element => {
  const initalState = { password: '' };

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<IFormInput>({
    mode: 'onChange',
    defaultValues: initalState,
    resolver: yupResolver(schema),
  });

  const onSubmitHandler = (): void => {
    reset(initalState);
  };

  const password = watch('password');

  return (
    <div className="passwordReset">
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <TextField
          id="password"
          label="Password"
          type="password"
          register={register('password')}
          error={errors['password']?.message || ''}
        />
        <input type="submit" disabled={!!errors['password'] || !password} value="Reset" />
      </form>
    </div>
  );
};

export default PasswordReset;
