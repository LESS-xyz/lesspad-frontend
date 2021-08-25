import React, { useEffect, useState } from 'react';

import cancelIcon from '../../assets/img/icons/cancel.svg';
import useDebounce from '../../hooks/useDebounce';

import s from './Input.module.scss';

interface IInputProps {
  title: string;
  type?: 'text' | 'number';
  value: string;
  onChange: (str: string) => void;
  error?: string;
  required?: boolean;
  subtitle?: string;
  placeholder?: string;
  validations?: { equation: any; message: string }[];
  delay?: number;
  style?: any;
  styleInput?: any;
  styleTitle?: any;
  styleSubtitle?: any;
}

const Input: React.FC<IInputProps> = (props) => {
  const {
    type = 'text',
    title,
    value,
    onChange,
    error,
    subtitle,
    required = false,
    placeholder = '',
    validations,
    delay = 0,
    style,
    styleInput,
    styleTitle,
    styleSubtitle,
  } = props;

  const [errorInner, setErrorInner] = useState(error);
  const [inputValue, setInputValue] = useState(value);
  const debouncedInputValue = useDebounce(inputValue, delay);

  const handleChange = async (str: string) => {
    let numberValue: string | null = null;
    if (type === 'number') {
      numberValue = str.replace(/[^\d.,]/g, '').replace(/,/g, '.');
    }
    if (validations) {
      for (let i = 0; i < validations.length; i += 1) {
        const { equation, message } = validations[i];
        const equal = await equation(numberValue || str);
        if (!equal) {
          setErrorInner(message);
          break; // show only first message if equation returns false
        } else {
          setErrorInner('');
        }
      }
    }
    setInputValue(numberValue || str);
  };

  useEffect(() => {
    onChange(debouncedInputValue);
  }, [debouncedInputValue, onChange]);

  return (
    <div className={`${s.input} ${error || errorInner ? s.invalid : ''}`} style={style}>
      <div className={s.input_title} style={styleTitle}>
        {title}
      </div>
      <input
        required={required}
        value={inputValue}
        placeholder={placeholder}
        onChange={(e) => handleChange(e.target.value)}
        type="text"
        style={styleInput}
      />
      {subtitle && (
        <div className={s.input_subtitle} style={styleSubtitle}>
          {subtitle}
        </div>
      )}
      {(error || errorInner) && (
        <div className={s.invalid_err}>
          <div className={s.invalid_err__img}>
            <img src={cancelIcon} alt="cancelIcon" />
          </div>
          <div className={s.invalid_err__text}>{error || errorInner}</div>
        </div>
      )}
    </div>
  );
};

export default Input;
