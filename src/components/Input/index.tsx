import React, { useState } from 'react';

import cancelIcon from '../../assets/img/icons/cancel.svg';

import s from './Input.module.scss';

interface IInputProps {
  title: string;
  value: string;
  onChange: (str: string) => void;
  error?: string;
  required?: boolean;
  subtitle?: string;
}

const Input: React.FC<IInputProps> = (props) => {
  const { title, value, onChange, error, subtitle, required = false } = props;
  const [inputVal, setInputVal] = useState(value);
  const handleChange = (str: string) => {
    setInputVal(str);
    onChange(str);
  };
  return (
    <div className={`${s.input} ${error ? s.invalid : ''}`}>
      <div className={s.input_title}>{title}</div>
      <input
        required={required}
        value={inputVal}
        onChange={(e) => handleChange(e.target.value)}
        type="text"
      />
      {subtitle && <div className={s.input_subtitle}>{subtitle}</div>}
      {error && (
        <div className={s.invalid_err}>
          <div className={s.invalid_err__img}>
            <img src={cancelIcon} alt="cancelIcon" />
          </div>
          <div className={s.invalid_err__text}>{error}</div>
        </div>
      )}
    </div>
  );
};

export default Input;
