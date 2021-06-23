import React from 'react';
import { Link } from 'react-router-dom';

import s from './Button.module.scss';

interface IButtonProps {
  children?: React.ReactElement | string;
  onClick?: () => void;
  filled?: boolean;
  disabled?: boolean;
  marginRight?: number;
  big?: boolean;
  long?: boolean;
  to?: string;
}

const Button: React.FC<IButtonProps> = ({
  children,
  filled,
  onClick,
  disabled = false,
  marginRight,
  big,
  long,
  to,
}) => {
  const handleClick = () => {
    if (disabled) return;
    if (!onClick) return;
    onClick();
  };

  if (to) {
    return (
      <Link
        to={to}
        onKeyDown={() => {}}
        style={{ marginRight: marginRight ?? 10 }}
        className={`${s.button} ${filled && s.filled} ${big && s.big}`}
      >
        {children}
      </Link>
    );
  }
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
