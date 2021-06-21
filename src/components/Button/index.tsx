import React from 'react';

import s from './Button.module.scss';

interface IButtonProps {
  children?: React.ReactElement | string;
  onClick?: () => void;
  filled?: boolean;
  disabled?: boolean;
  marginRight?: number;
  big?: boolean;
  long?: boolean;
}

const Button: React.FC<IButtonProps> = ({
  children,
  filled,
  onClick,
  disabled,
  marginRight,
  big,
  long,
}) => {
  const handleClick = () => {
    if (disabled) return;
    if (!onClick) return;
    onClick();
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={() => {}}
      style={{ marginRight: marginRight ?? 10, minWidth: long ? '150px' : '' }}
      className={`${s.button} ${filled && s.filled} ${big && s.big}`}
    >
      {children}
    </div>
  );
};

export default Button;
