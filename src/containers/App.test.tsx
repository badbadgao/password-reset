import { act, render, screen, fireEvent } from '@testing-library/react';

import PasswordResetScreen from './App';
import { PasswordInvalidError } from './PasswordReset/passwordFormYupSchema';

test('renders password reset screen initial state', () => {
  render(<PasswordResetScreen />);
  const passwordLabel = screen.getByText('Password');
  const passwordInput = screen.getByLabelText('Password');
  const resetSubmit = screen.getByRole('button', { name: 'Reset' });
  const errorText1 = screen.queryByText(PasswordInvalidError.Empty);
  const errorText2 = screen.queryByText(PasswordInvalidError.LessThan8Characters);
  const errorText3 = screen.queryByText(PasswordInvalidError.NotMatchConstrain);

  expect(passwordLabel).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
  expect(passwordInput).toHaveAttribute('type', 'password');
  expect(resetSubmit).toBeInTheDocument();
  expect(resetSubmit).toBeDisabled();
  expect(errorText1).toBeNull();
  expect(errorText2).toBeNull();
  expect(errorText3).toBeNull();
});

test('password validation: less than 8 characters', async () => {
  render(<PasswordResetScreen />);
  const passwordInput = screen.getByLabelText('Password');
  const resetSubmit = screen.getByRole('button', { name: 'Reset' });

  // number and letters, no special characters, less than 8 characters, invalid
  await act(() => fireEvent.change(passwordInput, { target: { value: '123abc4' } }));
  const errorText1 = screen.getByText(PasswordInvalidError.LessThan8Characters);
  expect(errorText1).toBeInTheDocument();
  expect(resetSubmit).toBeDisabled();

  // empty, invalid
  await act(() => fireEvent.change(passwordInput, { target: { value: '' } }));
  const errorText2 = screen.getByText('Must not be empty');
  expect(errorText2).toBeInTheDocument();
  expect(resetSubmit).toBeDisabled();

  // number and letters, 2 special characters, less than 8 characters, invalid
  await act(() => fireEvent.change(passwordInput, { target: { value: '12!#bc5' } }));
  const errorText3 = screen.getByText(PasswordInvalidError.LessThan8Characters);
  expect(errorText3).toBeInTheDocument();
  expect(resetSubmit).toBeDisabled();
});

test('password validation: more than 8 characters and contains one number and two special characters', async () => {
  render(<PasswordResetScreen />);
  const passwordInput = screen.getByLabelText('Password');
  const resetSubmit = screen.getByRole('button', { name: 'Reset' });

  // 8 characters, number and letters, invalid
  await act(() => fireEvent.change(passwordInput, { target: { value: '123abc22' } }));
  const errorText1 = screen.getByText(PasswordInvalidError.NotMatchConstrain);
  expect(errorText1).toBeInTheDocument();
  expect(resetSubmit).toBeDisabled();

  // one speccial character, more than 1 number, letters, invalid
  await act(() => fireEvent.change(passwordInput, { target: { value: '123!ddc22' } }));
  const errorText2 = screen.getByText(PasswordInvalidError.NotMatchConstrain);
  expect(errorText2).toBeInTheDocument();
  expect(resetSubmit).toBeDisabled();

  // two special no number, invalid
  await act(() => fireEvent.change(passwordInput, { target: { value: 'dd!&ddcd' } }));
  const errorText3 = screen.getByText(PasswordInvalidError.NotMatchConstrain);
  expect(errorText3).toBeInTheDocument();
  expect(resetSubmit).toBeDisabled();

  // two special one number, valid
  await act(() => fireEvent.change(passwordInput, { target: { value: '1d!&ddcd' } }));
  const errorText4 = screen.queryByText(PasswordInvalidError.NotMatchConstrain);
  expect(errorText4).toBeNull();
  expect(resetSubmit).toBeEnabled();

  // more than two special and more than one number, valid
  await act(() => fireEvent.change(passwordInput, { target: { value: '11!&_ddd' } }));
  const errorText5 = screen.queryByText(PasswordInvalidError.NotMatchConstrain);
  expect(errorText5).toBeNull();
  expect(resetSubmit).toBeEnabled();
});

test('password validation: more than 15 characters', async () => {
  render(<PasswordResetScreen />);
  const passwordInput = screen.getByLabelText('Password');
  const resetSubmit = screen.getByRole('button', { name: 'Reset' });

  // 14 numbers, invalid
  await act(() => fireEvent.change(passwordInput, { target: { value: '12345678901234' } }));
  const errorText1 = screen.queryByText(PasswordInvalidError.NotMatchConstrain);
  expect(errorText1).toBeInTheDocument();
  expect(resetSubmit).toBeDisabled();

  // 14 characters, invalid
  await act(() => fireEvent.change(passwordInput, { target: { value: 'asdfghjklzxcvw' } }));
  const errorText2 = screen.queryByText(PasswordInvalidError.NotMatchConstrain);
  expect(errorText2).toBeInTheDocument();
  expect(resetSubmit).toBeDisabled();

  // 14 combinations characters, invalid
  await act(() => fireEvent.change(passwordInput, { target: { value: '123456789asdf' } }));
  const errorText3 = screen.queryByText(PasswordInvalidError.NotMatchConstrain);
  expect(errorText3).toBeInTheDocument();
  expect(resetSubmit).toBeDisabled();

  // 15 numbers, valid
  await act(() => fireEvent.change(passwordInput, { target: { value: '123456789012345' } }));
  const errorText4 = screen.queryByText(PasswordInvalidError.NotMatchConstrain);
  expect(errorText4).toBeNull();
  expect(resetSubmit).toBeEnabled();

  // 15 letters, valid
  await act(() => fireEvent.change(passwordInput, { target: { value: 'asdfghjklzxcvwa' } }));
  const errorText5 = screen.queryByText(PasswordInvalidError.NotMatchConstrain);
  expect(errorText5).toBeNull();
  expect(resetSubmit).toBeEnabled();

  // numbers and characters, in total 15, valid
  await act(() => fireEvent.change(passwordInput, { target: { value: 'asdfghjklz12345' } }));
  const errorText6 = screen.queryByText(PasswordInvalidError.NotMatchConstrain);
  expect(errorText6).toBeNull();
  expect(resetSubmit).toBeEnabled();
});

test('reset button behaviour', async () => {
  render(<PasswordResetScreen />);
  const passwordInput = screen.getByLabelText('Password');
  const resetSubmit = screen.getByRole('button', { name: 'Reset' });

  await act(() => fireEvent.change(passwordInput, { target: { value: 'asdfghjkl1z12345' } }));
  expect(resetSubmit).toBeEnabled();

  await act(() => fireEvent.click(resetSubmit));
  expect(passwordInput).toHaveValue('');
  expect(resetSubmit).toBeDisabled();
});
