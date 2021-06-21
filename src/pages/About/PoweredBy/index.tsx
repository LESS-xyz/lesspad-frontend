import s from './PoweredBy.module.scss';
import binanceLogo from '../../../assets/img/sections/about-page/binance-logo.svg';
import ethereumLogo from '../../../assets/img/sections/about-page/ethereum-logo.svg';
import polygonLogo from '../../../assets/img/sections/about-page/polygon-logo.svg';

const PoweredBy: React.FC = () => {
  const logos = [binanceLogo, ethereumLogo, polygonLogo];
  return (
    <div className={s.block}>
      <div className={s.container}>
        <div className={s.inner}>
          <div className={s.title}>Powered By</div>
          <div className={s.logos}>
            {logos.map((logo) => (
              <div className={s.logo}>
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
