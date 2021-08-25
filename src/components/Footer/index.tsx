import React from 'react';
import { Link } from 'react-router-dom';

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
            <Link to="/pools" className={s.link}>
              Pools
            </Link>
            <Link to="/voting" className={s.link}>
              Voting
            </Link>
            {/* <div className={s.link}>Liquidity Mining</div> */}
            {/* <div className={s.link}>Stats</div> */}
            <Link to="/staking" className={s.link}>
              Staking
            </Link>
          </div>
          <div className={s.line} />
          <div className={s.info}>
            <div className={s.info_text}>2021 © Lesspad a product of Less Token — less.xyz</div>
            <div className={s.social_links}>
              <a
                href="https://twitter.com/LessToken"
                target="_blank"
                rel="noreferrer nooppener"
                className={s.social_link}
              >
                <img src={twitter} alt="twitter" />
              </a>
              <a
                href="https://less-token.medium.com/"
                target="_blank"
                rel="noreferrer nooppener"
                className={s.social_link}
              >
                <img src={medium} alt="medium" />
              </a>
              <a
                href="https://t.me/lesstokenann"
                target="_blank"
                rel="noreferrer nooppener"
                className={s.social_link}
              >
                <img src={telegram} alt="telegram" />
              </a>
              <a
                href="https://github.com/LESS-xyz"
                target="_blank"
                rel="noreferrer nooppener"
                className={s.social_link}
              >
                <img src={github} alt="github" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
