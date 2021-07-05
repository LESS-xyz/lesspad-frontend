import React from 'react';

import s from './FeaturedAlumni.module.scss';

const LogoBlock: React.FC<{ img: string }> = ({ img }) => {
  return (
    <div className={s.logo}>
      <div className={s.logo_inner}>
        <img src={img} alt="logo" />
      </div>
    </div>
  );
};

interface IFeaturedAlumniProps {
  logos: Array<string>;
  title: string;
}

const FeaturedAlumni: React.FC<IFeaturedAlumniProps> = ({ logos, title }) => {
  return (
    <section className={s.block}>
      <div className={s.container}>
        <div className={s.inner}>
          <div className={s.title}>{title}</div>
          <div className={s.logos}>
            {logos.map((logo) => (
              <LogoBlock img={logo} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedAlumni;
