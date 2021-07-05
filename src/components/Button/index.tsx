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
}

const Button: React.FC<IButtonProps> = (props) => {
  const { children, filled, onClick, disabled = false, marginRight, big, long, to, href } = props;
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
        style={{ marginRight: marginRight ?? 10 }}
        className={`${s.button} ${filled && s.filled} ${big && s.big}`}
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
