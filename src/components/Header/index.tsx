import s from './Header.module.scss';
import logo from '../../assets/img/icons/logo.svg';
import arrow from '../../assets/img/icons/arrow-down-gradient.svg';
import Button from '../Button/index';
import PopUp from './PopUp';
import { useState } from 'react';
import ethLogo from '../../assets/img/icons/eth-logo-colorful.svg';
import bnbLogo from '../../assets/img/icons/bnb-logo-colorful.svg';
import polkaLogo from '../../assets/img/icons/polkadot-logo-colorful.svg';
import { useDispatch, useSelector } from 'react-redux';
import { walletActions, userActions } from '../../redux/actions';
import { setToStorage } from '../../utils/localStorage';

const cryptoLogos = new Map();
cryptoLogos.set('Ethereum', ethLogo);
cryptoLogos.set('Binance Smart Chain', bnbLogo);
cryptoLogos.set('PolkaDot', polkaLogo);

const Header: React.FC = () => {
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [currentCrypto, setCurrentCrypto] = useState('Ethereum');

  const { address: userAddress } = useSelector(({ user }: any) => user);

  const dispatch = useDispatch();
  const setWalletType = (props: string) => dispatch(walletActions.setWalletType(props));
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
            <PopUp setIsPopUpOpen={setIsPopUpOpen} setCurrentCrypto={setCurrentCrypto} />
          )}
          <div className={s.left}>
            <div className={s.logo}>
              <div className={s.logo_img}>
                <img src={logo} alt="Less-logo" />
              </div>
              <div className={s.logo_text}>
                less
                <span>pad</span>
              </div>
            </div>
            <nav className={s.navigation}>
              <div className={s.nav_link} data-text="Pools">
                Pools
              </div>
              <div className={s.nav_link} data-text="Voting">
                Voting
              </div>
              <div className={s.nav_link} data-text="Stacking">
                Staking
              </div>
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
