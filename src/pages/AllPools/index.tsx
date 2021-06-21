import s from './AllPools.module.scss';
import TokenCard from '../../components/TokenCard/index';
import { CardConditions, cryptos } from '../../types/index';
import logo1 from '../../assets/img/sections/token-card/logo-1.png';
import { useState } from 'react';
import Pagination from '../../components/Pagination/index';
import Selector from '../../components/Selector/index';
import Input from '../../components/Input/index';

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
    logo: logo1,
    name: 'XOLO Financies',
    cost: '0.0000345',
    totalAmount: 3454,
    currentAmount: 2343,
    minPercent: 45,
    liquidityPercent: 56,
    daysBeforeOpening: 4,
  },
  {
    type: CardConditions.notOpened,
    cryptoType: cryptos.BNB,
    logo: logo1,
    name: 'XOLO Financies',
    cost: '0.0000345',
    totalAmount: 3454,
    currentAmount: 2343,
    minPercent: 45,
    liquidityPercent: 56,
    daysBeforeOpening: 4,
  },
];

const AllPoolsPage: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [currentOption, setCurrentOption] = useState('All');
  return (
    <section className={s.page}>
      <div className={s.container}>
        <div className={s.inner}>
          <div className={s.title}>
            All Pools {currentOption !== 'All' ? `- ${currentOption}` : ''}
          </div>
          <div className={s.control_panel}>
            <div className={s.input}>
              <Input
                value={inputValue}
                onChange={(str: string) => setInputValue(str)}
                placeholder="Search by Name, Token contract address, Token description"
              />
            </div>
            <div className={s.selector}>
              <Selector
                fn={setCurrentOption}
                defaultOption="All"
                othersOptions={['Ended', 'In Voting', 'Not Opened']}
              />
            </div>
          </div>
          <div className={s.cards}>
            {cardsExample.map((card) => (
              <TokenCard {...card} />
            ))}
            {cardsExample.map((card) => (
              <TokenCard {...card} />
            ))}
            {cardsExample.map((card) => (
              <TokenCard {...card} />
            ))}
          </div>
          <div className={s.pagination}>
            <Pagination />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AllPoolsPage;
