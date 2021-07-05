import React, { useState } from 'react';

import s from './Checkbox.module.scss';

interface ICheckboxProps {
  checkboxTitle: string;
  optionOne: string;
  optionTwo: string;
  defaultValue: boolean;
  onChange: (value: boolean) => void;
}

const Checkbox: React.FC<ICheckboxProps> = ({
  checkboxTitle,
  optionOne,
  optionTwo,
  onChange,
  defaultValue,
}) => {
  const [isActive, setIsActive] = useState(defaultValue);

  const handleChange = (foo: boolean) => {
    setIsActive(foo);
    onChange(foo);
  };
  return (
    <div className={s.presale_type}>
      <div className={s.presale_type__title}>{checkboxTitle}</div>
      <div className={s.presale_type__inner}>
        <div
          tabIndex={0}
          role="button"
          className={`${s.presale_type__button} ${isActive && s.active}`}
          onClick={() => handleChange(true)}
          onKeyDown={() => {}}
        >
          {optionOne}
        </div>
        <div
          tabIndex={-1}
          role="button"
          className={`${s.presale_type__button} ${!isActive && s.active}`}
          onClick={() => handleChange(false)}
          onKeyDown={() => {}}
        >
          {optionTwo}
        </div>
      </div>
    </div>
  );
};

export default Checkbox;
