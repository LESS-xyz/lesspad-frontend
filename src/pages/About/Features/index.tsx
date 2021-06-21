import s from './Features.module.scss';
import vector1 from '../../../assets/img/sections/about-page/vector-1.svg';
import vector2 from '../../../assets/img/sections/about-page/vector-2.svg';
import vector3 from '../../../assets/img/sections/about-page/vector-3.svg';

const Features: React.FC = () => {
  return (
    <div className={s.features}>
      <div className={s.container}>
        <div className={s.inner}>
          <div className={s.title}>Features</div>
          <div className={s.features_cards}>
            <div className={s.features_card}>
              <div className={s.features_card__img}>
                <img src={vector1} alt="vector" />
              </div>
              <div className={s.features_card__title}>100% Community</div>
              <div className={s.features_card__subtitle}>
                Community driven voting system allows your voice to be heard during the selection
                process. No kyc, rules or manual selection, you decide. Everyone is able to invest
                in the next big gem.
              </div>
            </div>
            <div className={s.features_card}>
              <div className={s.features_card__img}>
                <img src={vector2} alt="vector" />
              </div>
              <div className={s.features_card__title}>No limits</div>
              <div className={s.features_card__subtitle}>
                No need to go to multiple places for different protocols as you look to enter the
                space. LessPad allows you to launch across multiple protocols all in one place.
              </div>
            </div>
            <div className={s.features_card}>
              <div className={s.features_card__img}>
                <img src={vector3} alt="vector" />
              </div>
              <div className={s.features_card__title}>Guaranteed Allocations</div>
              <div className={s.features_card__subtitle}>
                LessPad uses a tier-based system to determine the guaranteed allocation for each
                participant in a pool.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
