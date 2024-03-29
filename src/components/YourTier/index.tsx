import React from 'react';

import s from './YourTier.module.scss';

interface IYourTierProps {
  tier: string;
  className?: string;
}

const YourTier: React.FC<IYourTierProps> = ({ tier, className }) => {
  return (
    <div className={`${s.tier} ${className}`}>
      <div className={s.container}>
        <div className={s.tier_title}>Your Tier</div>
        <div className={s.tier_body}>
          <div className={`${s.tier_item} ${s.pawn} ${tier === '1' && s.active}`}>
            <div className={s.tier_item_bg} />
            <div className={s.tier_item_title}>Pawn</div>
          </div>
          <div className={`${s.tier_item} ${s.bishop} ${tier === '2' && s.active}`}>
            <div className={s.tier_item_bg} />
            <div className={s.tier_item_title}>Bishop</div>
          </div>
          <div className={`${s.tier_item} ${s.rook} ${tier === '3' && s.active}`}>
            <div className={s.tier_item_bg} />
            <div className={s.tier_item_title}>Rook</div>
          </div>
          <div className={`${s.tier_item} ${s.queen} ${tier === '4' && s.active}`}>
            <div className={s.tier_item_bg} />
            <div className={s.tier_item_title}>Queen</div>
          </div>
          <div className={`${s.tier_item} ${s.king} ${tier === '5' && s.active}`}>
            <div className={s.tier_item_bg} />
            <div className={s.tier_item_title}>King</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YourTier;
