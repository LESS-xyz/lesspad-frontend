import { useSelector } from "react-redux";
import React from "react";
import { v4 as uuid } from 'uuid';
import { Link } from 'react-router-dom';

import s from './FeaturedProjects.module.scss';
import TokenCard from '../../../components/TokenCard/index';
import { CardConditions, cryptos } from '../../../types/index';

import logo1 from '../../../assets/img/sections/token-card/logo-1.png';
import logo2 from '../../../assets/img/sections/token-card/logo-2.png';

const cardsExample = [
  {
    type: CardConditions.inVoting,
    cryptoType: cryptos.BNB,
    logo: logo1,
    name: 'XOLO Financies',
    cost: '0.0000345',
    totalAmount: 3454,
    currentAmount: 2343,
    minPercent: 45,
    liquidityPercent: 56,
    daysBeforeOpening: 4,
    yesCounter: 12321,
    noCounter: 4455,
  },
  {
    type: CardConditions.closed,
    cryptoType: cryptos.ETH,
    logo: logo2,
    name: 'XOLO Financies',
    cost: '0.0000345',
    totalAmount: 3454,
    currentAmount: 2343,
    minPercent: 45,
    liquidityPercent: 56,
    daysBeforeOpening: 4,
  },
];

const emptyCards = [1, 2, 3];
// обрезаем кол-во пустых карточек
emptyCards.length = 3 - cardsExample.length;

const FeaturedProject: React.FC = () => {
  const { pools } = useSelector(({ pool }: any) => pool);

  return (
    <section className={s.page}>
      <div className={s.container}>
        <div className={s.inner}>
          <div className={s.title}>Featured Projects</div>
          <div className={s.cards}>
            {pools.slice(0, 5).map((item: any) => {
              const { address = '', title = '', } = item;
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
              return (
                <TokenCard key={uuid()} address={address} {...props} />
              )
            })}
            {emptyCards.map((element) => (
              <Link to="/create-pool" key={element} className={s.emptyCard} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProject;
