import React from 'react';
import { v4 as uuid } from 'uuid';

import tier1 from '../../../assets/img/sections/about-page/tier-1.svg';
import tier2 from '../../../assets/img/sections/about-page/tier-2.svg';
import tier3 from '../../../assets/img/sections/about-page/tier-3.svg';
import tier4 from '../../../assets/img/sections/about-page/tier-4.svg';
import tier5 from '../../../assets/img/sections/about-page/tier-5.svg';
import Button from '../../../components/Button/index';

import s from './FiveTiers.module.scss';

interface ITierCardProps {
  img: string;
  tierCounter: number;
  title: string;
  subtitleOne: string;
  subtitleTwo: string;
}

const TierCard: React.FC<ITierCardProps> = ({
  img,
  tierCounter,
  title,
  subtitleOne,
  subtitleTwo,
}) => {
  return (
    <div className={`${s.card} ${s.tier_card}`}>
      <div className={s.tier_card__inner}>
        <div className={s.tier_card__img}>
          <img src={img} alt="tier-card-img" />
        </div>
        <div className={s.tier_card__tier}>Tier {tierCounter}</div>
        <div className={s.tier_card__title}>{title}</div>
        <div className={s.tier_card__subtitle}>
          <p>{subtitleOne}</p>
          <p>{subtitleTwo}</p>
        </div>
      </div>
    </div>
  );
};

const tiersData: Array<ITierCardProps> = [
  {
    img: tier1,
    tierCounter: 1,
    title: 'Earth',
    subtitleOne: 'Public- holding $LESS is not required to participate for this tier',
    subtitleTwo: 'Allocation percentage = 4%',
  },
  {
    img: tier2,
    tierCounter: 2,
    title: 'Moon',
    subtitleOne: 'Stake 7500 $LESS',
    subtitleTwo: 'Allocation percentage = 9%',
  },
  {
    img: tier3,
    tierCounter: 3,
    title: 'White Dwarf',
    subtitleOne: 'Stake 15,000 $LESS ',
    subtitleTwo: 'Allocation percentage = 17%',
  },
  {
    img: tier4,
    tierCounter: 4,
    title: 'Red Giant',
    subtitleOne: 'Stake 30,000 $LESS',
    subtitleTwo: 'Allocation percentage = 27%',
  },
  {
    img: tier5,
    tierCounter: 5,
    title: 'Supernova',
    subtitleOne: 'Stake 50,000 $LESS',
    subtitleTwo: 'Allocation percentage = 43%',
  },
];

const Tiers: React.FC = () => {
  return (
    <div className={s.tiers}>
      <div className={s.container}>
        <div className={s.inner}>
          <div className={s.cards}>
            <div className={s.card}>
              <div className={s.card_title}>The Five Tiers of Lesspad</div>
              <div className={s.card_subtitle}>
                <p>
                  Lesspad uses a tier based system to determine the guaranteed allocation for each
                  participant in a pool.
                </p>
                <p>
                  It&apos;s a fair and simple process: the amount of Less tokens a holder has staked
                  determines the pool weight of allocation for a given participant.
                </p>
              </div>
              <div className={s.card_button}>
                <Button long>Join Lesspad</Button>
              </div>
            </div>
            {tiersData.map((tier) => (
              <TierCard key={uuid()} {...tier} />
            ))}
          </div>
          <div className={s.info}>
            <div className={s.info_inner}>
              <div className={s.info_left}>
                We aim to provide a seamless experience for fund raising and exposure on any major
                protocol
              </div>
              <div className={s.info_right}>
                <div className={s.info_right__text}>
                  Funding? Exposure? <br /> LessPad has it all, click below!
                </div>
                <Button>Start application</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tiers;
