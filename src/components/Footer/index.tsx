import React from 'react';

import github from '../../assets/img/icons/github.svg';
import logo from '../../assets/img/icons/logo-small.svg';
import medium from '../../assets/img/icons/medium.svg';
import telegram from '../../assets/img/icons/telegram.svg';
import twitter from '../../assets/img/icons/twitter.svg';

import s from './Footer.module.scss';

const Footer: React.FC = () => {
  return (
    <footer className={s.footer}>
      <div className={s.container}>
        <div className={s.inner}>
          <div className={s.logo}>
            <div className={s.logo_img}>
              <img src={logo} alt="Less-logo" />
            </div>
            <div className={s.logo_text}>less</div>
          </div>
          <div className={s.links}>
            <div className={s.link}>Pools</div>
            <div className={s.link}>Voting</div>
            <div className={s.link}>Liquidity Mining</div>
            <div className={s.link}>Stats</div>
            <div className={s.link}>Staking</div>
          </div>
          <div className={s.line} />
          <div className={s.info}>
            <div className={s.info_text}>2021 © Lesspad a product of Less Token — less.xyz</div>
            <div className={s.social_links}>
              <div className={s.social_link}>
                <img src={twitter} alt="twitter" />
              </div>
              <div className={s.social_link}>
                <img src={medium} alt="medium" />
              </div>
              <div className={s.social_link}>
                <img src={telegram} alt="telegram" />
              </div>
              <div className={s.social_link}>
                <img src={github} alt="github" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
