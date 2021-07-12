import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import useMedia from 'use-media';

import arrow from '../../assets/img/icons/arrow-down-gradient.svg';
import bnbLogo from '../../assets/img/icons/bnb-logo.svg';
import { ReactComponent as IconBurger } from '../../assets/img/icons/burger.svg';
import { ReactComponent as IconClose } from '../../assets/img/icons/close-color.svg';
import ethLogo from '../../assets/img/icons/eth-logo.svg';
import logo from '../../assets/img/icons/logo.svg';
import maticLogo from '../../assets/img/icons/matic-logo.svg';
import { ReactComponent as ImageBackgroundBottom } from '../../assets/img/sections/header/header-menu-background-bottom.svg';
import { ReactComponent as ImageBackground } from '../../assets/img/sections/header/header-menu-background.svg';
import { userActions, walletActions } from '../../redux/actions';
import { setToStorage } from '../../utils/localStorage';
import Button from '../Button/index';

import PopUp from './PopUp';

import s from './Header.module.scss';

const cryptoLogos = new Map();
cryptoLogos.set('Ethereum', ethLogo);
cryptoLogos.set('Binance-Smart-Chain', bnbLogo);
cryptoLogos.set('Matic', maticLogo);

const Header: React.FC = () => {
  const isDesktop = useMedia({ minWidth: 1024 });

  const [isPopUpOpen, setIsPopUpOpen] = useState<boolean>(false);
  const [openMenu, setOpenMenu] = useState<boolean>(false);

  const { address: userAddress } = useSelector(({ user }: any) => user);
  const { chainType } = useSelector(({ wallet }: any) => wallet);

  const refButtonPopup = React.useRef<HTMLDivElement>(null);

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
  };

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
          {!isDesktop && (
            <div
              className={s.menu_button}
              role="button"
              tabIndex={0}
              onKeyDown={() => {}}
              onClick={() => setOpenMenu(!openMenu)}
            >
              {!openMenu ? <IconBurger /> : <IconClose />}
            </div>
          )}
          <div className={`${s.container_menu_mobile} ${openMenu && s.open}`}>
            <ImageBackground className={s.background} />
            <ImageBackgroundBottom className={s.backgroundBottom} />
            <div className={s.menu_mobile_header}>
              <div
                className={s.menu_button}
                role="button"
                tabIndex={0}
                onKeyDown={() => {}}
                onClick={() => setOpenMenu(false)}
              >
                <IconClose />
              </div>
              <div className={s.logo_menu_mobile}>
                <NavLink to="/">
                  <div className={s.logo_img_mobile}>
                    <img src={logo} alt="Less-logo" />
                  </div>
                  <div className={s.logo_text_mobile}>
                    less
                    <span>pad</span>
                  </div>
                </NavLink>
              </div>
            </div>
            <div className={s.inner_container_menu_mobile}>
              <NavLink
                to="/pools"
                activeClassName={s.active_menu_mobile_item}
                className={s.menu_mobile_item}
                data-text="Pools"
              >
                <div>Pools</div>
              </NavLink>
              <NavLink
                to="/voting"
                activeClassName={s.active_menu_mobile_item}
                className={s.menu_mobile_item}
                data-text="Voting"
              >
                <div>Voting</div>
              </NavLink>
              <NavLink
                to="/staking"
                activeClassName={s.active_menu_mobile_item}
                className={s.menu_mobile_item}
                data-text="Staking"
              >
                <div>Staking</div>
              </NavLink>

              <div className={s.container_menu_mobile_bottom}>
                {!userAddress ? (
                  <Button filled big fullWidth marginRight={0} onClick={handleConnectWallet}>
                    Connect Wallet
                  </Button>
                ) : (
                  <Button filled big fullWidth marginRight={0} onClick={handleDisconnect}>
                    {`${userAddress.slice(0, 10)}...`}
                  </Button>
                )}
                <Button big fullWidth style={{ marginTop: 30 }} to="/create-pool">
                  Create Pool
                </Button>
                <Button
                  big
                  fullWidth
                  marginRight={0}
                  style={{ marginTop: 30 }}
                  onClick={() => setIsPopUpOpen(true)}
                >
                  <div className={s.button_body}>
                    <div className={s.button_body_left}>
                      <div className={s.crypto_logo}>
                        <img src={cryptoLogos.get(chainType)} alt="crypto-logo" />
                      </div>
                      <div className={s.current_crypto}>{chainType}</div>
                    </div>
                    <div className={`${s.arrow} ${isPopUpOpen && s.active}`}>
                      <img src={arrow} alt="arrow" />
                    </div>
                  </div>
                </Button>
                {!isDesktop && isPopUpOpen && (
                  <PopUp
                    setIsPopUpOpen={setIsPopUpOpen}
                    setCurrentCrypto={setChainType}
                    refButton={refButtonPopup}
                    style={!isDesktop && { position: 'relative', top: -1 }}
                  />
                )}
              </div>
            </div>
          </div>

          {!isDesktop && (
            <div className={s.logo_mobile}>
              <NavLink to="/">
                <div className={s.logo_img_mobile}>
                  <img src={logo} alt="Less-logo" />
                </div>
                <div className={s.logo_text_mobile}>
                  less
                  <span>pad</span>
                </div>
              </NavLink>
            </div>
          )}
          <div className={s.left}>
            {isDesktop && (
              <NavLink to="/" className={s.logo}>
                <div className={s.logo_img}>
                  <img src={logo} alt="Less-logo" />
                </div>
                <div className={s.logo_text}>
                  less
                  <span>pad</span>
                </div>
              </NavLink>
            )}
            {isDesktop && (
              <nav className={s.navigation}>
                <NavLink
                  to="/pools"
                  activeClassName={s.active}
                  className={s.nav_link}
                  data-text="Pools"
                >
                  Pools
                </NavLink>
                <NavLink
                  to="/voting"
                  activeClassName={s.active}
                  className={s.nav_link}
                  data-text="Voting"
                >
                  Voting
                </NavLink>
                <NavLink
                  to="/staking"
                  activeClassName={s.active}
                  className={s.nav_link}
                  data-text="Stacking"
                >
                  Staking
                </NavLink>
              </nav>
            )}
          </div>
          <div className={s.right}>
            <div className={s.buttons}>
              {!userAddress ? (
                <Button filled marginRight={isDesktop ? 20 : 0} onClick={handleConnectWallet}>
                  Connect Wallet
                </Button>
              ) : (
                <Button filled marginRight={isDesktop ? 20 : 0} onClick={handleDisconnect}>
                  {`${userAddress.slice(0, 10)}...`}
                </Button>
              )}
              {isDesktop && <Button to="/create-pool">Create Pool</Button>}
              {isDesktop && (
                <Button marginRight={0} onClick={() => setIsPopUpOpen(true)}>
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
              )}
            </div>
          </div>
          {isDesktop && isPopUpOpen && (
            <PopUp
              setIsPopUpOpen={setIsPopUpOpen}
              setCurrentCrypto={setChainType}
              refButton={refButtonPopup}
            />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
