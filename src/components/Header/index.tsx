import s from './Header.module.scss';
import logo from '../../assets/img/icons/logo.svg';
import Button from '../Button/index';

const Header: React.FC = () => {
  return (
    <header className={s.header}>
      <div className={s.container}>
        <div className={s.inner}>
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
              <Button filled marginRight={20} onClick={() => alert('Click')}>
                Connect Wallet
              </Button>
              <Button>Create Pool</Button>
              <Button>Binance...</Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
