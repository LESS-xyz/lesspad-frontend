import React, { useEffect, useState } from 'react';

import logo1 from '../../assets/img/sections/token-card/logo-1.png';
import Pagination from '../../components/Pagination/index';
import Search from '../../components/Search/index';
import Selector from '../../components/Selector/index';
import TokenCard from '../../components/TokenCard/index';
import { useContractsContext } from '../../contexts/ContractsContext';
import { CardConditions, cryptos } from '../../types/index';

import s from './AllPools.module.scss';

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
  const { ContractLessLibrary } = useContractsContext();

  const [inputValue, setInputValue] = useState<string>('');
  const [currentOption, setCurrentOption] = useState<string>('All');
  const [presalesAddresses, setPresalesAddresses] = useState<any>([]);

  const getPresalesAddresses = async () => {
    try {
      const addresses = await ContractLessLibrary.getPresalesAddresses();
      if (addresses) setPresalesAddresses(addresses);
      console.log('AllPoolsPage getPresalesAddresses:', addresses);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (!ContractLessLibrary) return;
    console.log('AllPoolsPage useEffect:');
    getPresalesAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ContractLessLibrary]);

  return (
    <section className={s.page}>
      <div className={s.container}>
        <div className={s.inner}>
          <div className={s.title}>
            All Pools {currentOption !== 'All' ? `- ${currentOption}` : ''}
          </div>
          <div className={s.control_panel}>
            <div className={s.input}>
              <Search
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
            {presalesAddresses.map((address: string) => {
              const props = {
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
              };
              return <TokenCard key={address} address={address} {...props} />;
            })}
            {cardsExample.map((card) => (
              <TokenCard address="address" {...card} />
            ))}
            {cardsExample.map((card) => (
              <TokenCard address="address" {...card} />
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
