import s from './Input.module.scss';
import cancelIcon from '../../assets/img/icons/cancel.svg';
import { useState } from 'react';

interface IInputProps {
  title: string;
  value: string;
  onChange: (str: string) => void;
  invalid?: boolean;
  subtitle?: string;
}

const Input: React.FC<IInputProps> = ({ title, value, onChange, invalid, subtitle }) => {
  const [inputVal, setInputVal] = useState(value);
  const handleChange = (str: string) => {
    setInputVal(str);
    onChange(str);
  };
  return (
    <div className={`${s.input} ${invalid ? s.invalid : ''}`}>
      <div className={s.input_title}>{title}</div>
      <input required value={inputVal} onChange={(e) => handleChange(e.target.value)} type="text" />
      {subtitle && <div className={s.input_subtitle}>{subtitle}</div>}
      {invalid && (
        <div className={s.invalid_err}>
          <div className={s.invalid_err__img}>
            <img src={cancelIcon} alt="cancelIcon" />
          </div>
          <div className={s.invalid_err__text}>Invalid address</div>
        </div>
      )}
    </div>
  );
};

export default Input;
