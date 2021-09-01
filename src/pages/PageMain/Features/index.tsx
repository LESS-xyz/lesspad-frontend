import React from 'react';

import vector1 from '../../../assets/img/sections/home/features/vector-1.svg';
import vector2 from '../../../assets/img/sections/home/features/vector-2.svg';
import vector3 from '../../../assets/img/sections/home/features/vector-3.svg';

import s from './Features.module.scss';

const Features: React.FC = () => {
  return (
    <section className={s.features}>
      <div className={s.container}>
        <div className={s.features_inner}>
          <div className={s.feature}>
            <div className={s.feature_img}>
              <img src={vector1} alt="vector-img-1" />
            </div>
            <div className={s.feature_text}>100% Community</div>
          </div>

          <div className={s.feature}>
            <div className={s.feature_img}>
              <img src={vector2} alt="vector-img-2" />
            </div>
            <div className={s.feature_text}>No limits</div>
          </div>

          <div className={s.feature}>
            <div className={s.feature_img}>
              <img src={vector3} alt="vector-img-3" />
            </div>
            <div className={s.feature_text}>Guaranteed Allocations</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
