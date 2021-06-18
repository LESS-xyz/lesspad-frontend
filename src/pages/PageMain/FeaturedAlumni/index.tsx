import s from './FeaturedAlumni.module.scss';
import logo1 from '../../../assets/img/sections/alumni-logos/logo-1.svg';

const LogoBlock: React.FC<{ img: string }> = ({ img }) => {
  return (
    <div className={s.logo}>
      <div className={s.logo_inner}>
        <img src={img} alt="logo" />
      </div>
    </div>
  );
};

const FeaturedAlumni: React.FC = () => {
  const alumnies = [logo1, logo1, logo1, logo1, logo1, logo1, logo1, logo1];
  return (
    <section className={s.block}>
      <div className={s.container}>
        <div className={s.inner}>
          <div className={s.title}>Featured Alumni</div>
          <div className={s.logos}>
            {alumnies.map((logo) => (
              <LogoBlock img={logo} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedAlumni;
