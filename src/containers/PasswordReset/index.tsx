import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import TextField from 'components/TextField';

import './PasswordReset.scss';
import schema from './passwordFormYupSchema';

interface IFormInput {
  password: string;
}

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
