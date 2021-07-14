import React from 'react';
import { useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';

import logo1 from '../../../assets/img/sections/token-card/logo-1.png';
import TokenCard from '../../../components/TokenCard/index';
import { CardConditions, cryptos } from '../../../types/index';

import s from './PoolsInVoting.module.scss';

// const cardsExample = [
// ];

const PoolsiInVoting: React.FC = () => {
  const { pools } = useSelector(({ pool }: any) => pool);

  return (
    <section className={s.block}>
      <div className={s.container}>
        <div className={s.inner}>
          <div className={s.title}>Pools in Voting</div>
          <div className={s.cards}>
            {pools.slice(0, 3).map((item: any) => {
              const { address = '', title = '' } = item;
              const props = {
                name: title || 'Pool',
                type: CardConditions.closed,
                cryptoType: cryptos.ETH,
                logo: logo1,
                cost: '0.0000345',
                totalAmount: 3454,
                currentAmount: 2343,
                minPercent: 45,
                liquidityPercent: 56,
                daysBeforeOpening: 4,
              };
              return <TokenCard key={uuid()} address={address} {...props} />;
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PoolsiInVoting;
