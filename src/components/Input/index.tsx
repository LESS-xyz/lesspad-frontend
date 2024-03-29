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
  suffix?: string;
  regexp?: (str: string) => string;
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
    suffix,
    regexp,
  } = props;

  const [errorInner, setErrorInner] = useState(error);
  const [inputValue, setInputValue] = useState(value);
  const debouncedInputValue = useDebounce(inputValue, delay);

  const handleChange = async (str: string) => {
    let typedValue: string | null = null;
    // if (type === 'number') {
    //   typedValue = str.replace(/[^\d.,]/g, '').replace(/,/g, '.');
    // }
    // if (type === 'addresses') {
    //   typedValue = str.replace(/[!@#$%^&*()`;.?[\]'":{}|\-\\<>/_+=~ ]/g, '').replace(/ /g, '');
    // }
    if (regexp) {
      typedValue = regexp(str);
    }
    if (validations) {
      for (let i = 0; i < validations.length; i += 1) {
        const { equation, message } = validations[i];
        const equal = await equation(typedValue || str);
        if (!equal) {
          setErrorInner(message);
          break; // show only first message if equation returns false
        } else {
          setErrorInner('');
        }
      }
    }
    setInputValue(typedValue || str);
  };

  useEffect(() => {
    onChange(debouncedInputValue);
  }, [debouncedInputValue, onChange]);

  return (
    <div className={`${s.input} ${error || errorInner ? s.invalid : ''}`} style={style}>
      <div className={s.input_title} style={styleTitle}>
        {title}
      </div>
      <div className={s.input_wrapper}>
        <input
          required={required}
          value={inputValue}
          placeholder={placeholder}
          onWheel={(evt) => {
            evt.preventDefault();
          }}
          onChange={(e) => handleChange(e.target.value)}
          type={type}
          style={styleInput}
        />
        {suffix && <div className={s.input_suffix}>{suffix}</div>}
      </div>
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
