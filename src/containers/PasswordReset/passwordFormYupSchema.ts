import * as yup from 'yup';

const MIN_LENGTH = 8;
const NO_CONSTRAIN_LENGTH = 15;

export const enum PasswordInvalidError {
  Empty = 'Must not be empty',
  LessThan8Characters = 'Must contain at least 8 characters',
  NotMatchConstrain = 'Must contain one number and two special characters',
}

const passwordYupSchema = yup
  .string()
  .required(PasswordInvalidError.Empty)
  .test('min_8_characters', PasswordInvalidError.LessThan8Characters, (currentPassword) => {
    if (currentPassword.length < MIN_LENGTH) {
      return false;
    }
    return true;
  })
  .test('match_constrain', PasswordInvalidError.NotMatchConstrain, (currentPassword) => {
    let isValid = true;
    if (currentPassword.length >= MIN_LENGTH && currentPassword.length < NO_CONSTRAIN_LENGTH) {
      const regex = /^(?=.*\d)(?=.*[\W_].*[\W_])[A-Za-z0-9\W_]{8,}$/;
      isValid = regex.test(currentPassword);
    }

    return isValid;
  });

const schema: yup.ObjectSchema<{
  password: string;
}> = yup
  .object()
  .shape({
    password: passwordYupSchema,
  })
  .required();

export default schema;
