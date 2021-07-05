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
  href?: string;
  fullWidth?: boolean;
  style?: any;
}

const Button: React.FC<IButtonProps> = (props) => {
  const {
    children,
    filled,
    onClick,
    disabled = false,
    marginRight,
    big,
    long,
    to,
    href,
    fullWidth = false,
    style,
  } = props;
  const handleClick = () => {
    if (disabled) return;
    if (!onClick) return;
    onClick();
  };

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        style={{ ...style, marginRight: marginRight ?? 10 }}
        className={`${s.button} ${filled && s.filled} ${big && s.big} ${fullWidth && s.fullWidth}`}
        rel="noreferrer"
      >
        {children}
      </a>
    );
  }
  if (to) {
    return (
      <Link
        to={to}
        onKeyDown={() => {}}
        style={{ ...style, marginRight: marginRight ?? 10 }}
        className={`${s.button} ${filled && s.filled} ${big && s.big} ${fullWidth && s.fullWidth}`}
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
      style={{ ...style, marginRight: marginRight ?? 10, minWidth: long ? '150px' : '' }}
      className={`${s.button} ${filled && s.filled} ${big && s.big} ${fullWidth && s.fullWidth}`}
    >
      {children}
    </div>
  );
};

export default Button;
