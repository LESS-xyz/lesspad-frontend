import s from './Header.module.scss';
import logo from '../../assets/img/icons/logo.svg';
import arrow from '../../assets/img/icons/arrow-down-gradient.svg';
import Button from '../Button/index';
import PopUp from './PopUp';
import { useState } from 'react';
import ethLogo from '../../assets/img/icons/eth-logo-colorful.svg';
import bnbLogo from '../../assets/img/icons/bnb-logo-colorful.svg';
import maticLogo from '../../assets/img/icons/matic-logo.svg';
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { walletActions, userActions } from '../../redux/actions';
import { setToStorage } from '../../utils/localStorage';

const cryptoLogos = new Map();
cryptoLogos.set('Ethereum', ethLogo);
cryptoLogos.set('Binance-Smart-Chain', bnbLogo);
cryptoLogos.set('Matic', maticLogo);

const Header: React.FC = () => {
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);

  const { address: userAddress } = useSelector(({ user }: any) => user);
  const { chainType } = useSelector(({ wallet }: any) => wallet);

  const dispatch = useDispatch();
  const setWalletType = (props: string) => dispatch(walletActions.setWalletType(props));
  const setChainType = (props: string) => dispatch(walletActions.setChainType(props));
  const setUserData = (props: any) => dispatch(userActions.setUserData(props));

  const handleConnectWallet = () => {
    try {
      setToStorage('walletType', 'metamask');
      setWalletType('metamask');
    } catch (e) {
      console.error(e);
    }
  }

  const handleDisconnect = () => {
    try {
      setToStorage('walletType', '');
      setUserData({ address: undefined, balance: 0 });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <header className={s.header}>
      <div className={s.container}>
        <div className={s.inner}>
          {isPopUpOpen && (
            <PopUp setIsPopUpOpen={setIsPopUpOpen} setCurrentCrypto={setChainType} />
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
              {!userAddress ?
                <Button filled marginRight={20} onClick={handleConnectWallet}>
                  Connect Wallet
                </Button>
                :
                <Button filled marginRight={20} onClick={handleDisconnect}>
                  {`${userAddress.slice(0, 10)}...`}
                </Button>
              }
              <Button to="/create-pool">Create Pool</Button>
              <Button marginRight={0} onClick={() => setIsPopUpOpen(!isPopUpOpen)}>
                <div className={s.button_body}>
                  <div className={s.crypto_logo}>
                    <img src={cryptoLogos.get(chainType)} alt="crypto-logo" />
                  </div>
                  <div className={s.current_crypto}>{chainType}</div>
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
