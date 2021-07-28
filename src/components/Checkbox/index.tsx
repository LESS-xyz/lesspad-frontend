import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';

import s from './Checkbox.module.scss';

interface IOption {
  key: string;
  text: string;
}

interface ICheckboxProps {
  name: string;
  options: IOption[];
  value: string;
  onChange: (value: string) => void;
}

const Checkbox: React.FC<ICheckboxProps> = (props) => {
  const { name, options, onChange, value } = props;

  const [activeItem, setActiveItem] = useState<string>(value);

  const handleChange = (key) => {
    setActiveItem(key);
    onChange(key);
  };

  return (
    <div className={s.presale_type}>
      <div className={s.presale_type__title}>{name}</div>
      <div className={s.presale_type__inner}>
        {options?.map((item: any) => {
          const { key, text } = item;
          const isActive = key === activeItem;
          return (
            <div
              key={uuid()}
              tabIndex={0}
              role="button"
              className={`${s.presale_type__button} ${isActive && s.active}`}
              onClick={() => handleChange(key)}
              onKeyDown={() => {}}
            >
              {text}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Checkbox;
