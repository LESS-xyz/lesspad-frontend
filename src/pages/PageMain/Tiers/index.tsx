import React from 'react';
import { v4 as uuid } from 'uuid';

import tierBishop from '../../../assets/img/sections/home/tiers/bishop.svg';
import tierKing from '../../../assets/img/sections/home/tiers/king.svg';
import tierPawn from '../../../assets/img/sections/home/tiers/pawn.svg';
import tierQueen from '../../../assets/img/sections/home/tiers/queen.svg';
import tierRook from '../../../assets/img/sections/home/tiers/rook.svg';

import s from './Tiers.module.scss';

const tiersImgs = [tierPawn, tierBishop, tierRook, tierQueen, tierKing];

const tiersData = [
  {
    title: 'Pawns',
    text: ['Stake 1,000 $LESS', 'Pool Size = 15%', 'Lottery Based'],
  },
  {
    title: 'Bishops',
    text: ['Stake 5,000 $LESS', 'Pool Size = 20%', 'Lottery Based'],
  },
  {
    title: 'Rooks',
    text: ['Stake 20,000 $LESS', 'Pool Size = 15%', 'Guaranteed Allocation'],
  },
  {
    title: 'Queens',
    text: ['Stake 50,000 $LESS', 'Pool Size = 20%', 'Guaranteed Allocation'],
  },
  {
    title: 'Kings',
    text: ['Stake 200,000 $LESS', 'Pool Size = 30%', 'Guaranteed Allocation'],
  },
];

interface ITierProps {
  tierCount: number;
  title: string;
  text: Array<string>;
}

const Tier: React.FC<ITierProps> = ({ tierCount, title, text }) => (
  <div className={s.tier_wrap}>
    <div className={s.tier}>
      <div className={s.tier_img}>
        <img src={tiersImgs[tierCount - 1]} alt="tier-img" />
      </div>
      <div className={s.tier_count}>Tier {tierCount}</div>
      <div className={s.tier_title}>{title}</div>
      <div className={s.tier_text}>
        {text.map((p) => (
          <p key={uuid()}>{p}</p>
        ))}
      </div>
    </div>
  </div>
);

const Tiers: React.FC = () => {
  return (
    <section className={s.tiers}>
      <div className={s.container}>
        <div className={s.tiers_title}>Lesspad Tiers</div>
        <div className={s.tiers_subtitle}>
          <p>
            A tier based system integrated with LessPad provides certain bonuses like guaranteed
            allocation to each participants in a presale pool.{' '}
          </p>
          <p>
            This feature is designed to provide a simple and fair process for all participants. The
            more $LESS a holder stakes, the higher the pool weight of its allocation.
          </p>
        </div>
        <div className={s.tiers_body}>
          {tiersData.map((tier, index) => (
            <Tier key={uuid()} tierCount={index + 1} {...tier} />
          ))}
        </div>
        <div className={s.tiers_subtext}>
          *The tier system can be subject to adjustments in the future if necessary
        </div>
      </div>
    </section>
  );
};

export default Tiers;
