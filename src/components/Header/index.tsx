import s from './Header.module.scss';
import logo from '../../assets/img/icons/logo.svg';
import arrow from '../../assets/img/icons/arrow-down-gradient.svg';
import Button from '../Button/index';
import PopUp from './PopUp';
import { useState } from 'react';
import ethLogo from '../../assets/img/icons/eth-logo-colorful.svg';
import bnbLogo from '../../assets/img/icons/bnb-logo-colorful.svg';
import polkaLogo from '../../assets/img/icons/polkadot-logo-colorful.svg';
import {
  Link
} from "react-router-dom";

const cryptoLogos = new Map();
cryptoLogos.set('Ethereum', ethLogo);
cryptoLogos.set('Binance Smart Chain', bnbLogo);
cryptoLogos.set('PolkaDot', polkaLogo);

const Header: React.FC = () => {
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [currentCrypto, setCurrentCrypto] = useState('Ethereum');
  return (
    <header className={s.header}>
      <div className={s.container}>
        <div className={s.inner}>
          {isPopUpOpen && (
            <PopUp setIsPopUpOpen={setIsPopUpOpen} setCurrentCrypto={setCurrentCrypto} />
          )}
          <div className={s.left}>
            <Link to="/" className={s.logo}>
              <div className={s.logo_img}>
                <img src={logo} alt="Less-logo" />
              </div>
              <div className={s.logo_text}>
                less
                <span>pad</span>
              </div>
            </Link>
            <nav className={s.navigation}>
              <Link to="/pools" className={s.nav_link} data-text="Pools">
                Pools
              </Link>
              <Link to="/voting" className={s.nav_link} data-text="Voting">
                Voting
              </Link>
              <Link to="/staking" className={s.nav_link} data-text="Stacking">
                Staking
              </Link>
            </nav>
          </div>
          <div className={s.right}>
            <div className={s.buttons}>
              <Button filled marginRight={20} onClick={() => alert('Click')}>
                Connect Wallet
              </Button>
              <Button>Create Pool</Button>
              <Button marginRight={0} onClick={() => setIsPopUpOpen(!isPopUpOpen)}>
                <div className={s.button_body}>
                  <div className={s.crypto_logo}>
                    <img src={cryptoLogos.get(currentCrypto)} alt="crypto-logo" />
                  </div>
                  <div className={s.current_crypto}>{currentCrypto}</div>
                  <div className={`${s.arrow} ${isPopUpOpen && s.active}`}>
                    <img src={arrow} alt="arrow" />
                  </div>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
