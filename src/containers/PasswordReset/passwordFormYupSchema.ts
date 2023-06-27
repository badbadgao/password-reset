import * as yup from 'yup';

const MIN_LENGTH = 8;

const passwordYupSchema = yup
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
