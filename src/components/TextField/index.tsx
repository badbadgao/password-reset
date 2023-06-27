import { UseFormRegisterReturn } from 'react-hook-form';

import './TextField.scss';

interface IProps {
  label: string;
  id: string;
  error?: string;
  type?: string;
  register: UseFormRegisterReturn<string>;
}

const TextField = ({ label, id, error, register, ...rest }: IProps): JSX.Element => {
  return (
    <div className="textField">
      <label htmlFor={id}>{label}</label>
      <div className="textField__inputRoot">
        <input {...register} id={id} {...rest} />
        <small>{error}</small>
      </div>
    </div>
  );
};

export default TextField;
