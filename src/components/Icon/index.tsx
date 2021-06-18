import React, { useState } from 'react';

interface IIconProps {
  onHover: string;
  defaultIcon: string;
}

const Icon: React.FC<IIconProps> = ({ onHover, defaultIcon }) => {
  const [isHover, setIsHover] = useState(false);
  return (
    <img
      onMouseOver={() => setIsHover(true)}
      onFocus={() => setIsHover(true)}
      onMouseOut={() => setIsHover(false)}
      onBlur={() => setIsHover(false)}
      src={isHover ? onHover : defaultIcon}
      alt="social-icon"
    />
  );
};

export default Icon;
