import React from 'react';
import { v4 as uuid } from 'uuid';

import binanceLogo from '../../../assets/img/sections/about-page/binance-logo.svg';
import ethereumLogo from '../../../assets/img/sections/about-page/ethereum-logo.svg';
import polygonLogo from '../../../assets/img/sections/about-page/polygon-logo.svg';

import s from './PoweredBy.module.scss';

interface IPoweredByProps {
  className?: string;
  withTitle?: boolean;
}

const PoweredBy: React.FC<IPoweredByProps> = ({ className, withTitle }) => {
  const logos = [binanceLogo, ethereumLogo, polygonLogo];
  return (
    <div className={`${s.block} ${className}`}>
      <div className={s.container}>
        <div className={s.inner}>
          {withTitle && <div className={s.title}>Powered By</div>}
          <div className={s.logos}>
            {logos.map((logo) => (
              <div className={s.logo} key={uuid()}>
                <img src={logo} alt="logo" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoweredBy;
