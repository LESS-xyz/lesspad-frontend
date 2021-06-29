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

  const [search, setSearch] = useState<string>('');
  const [currentOption, setCurrentOption] = useState<string>('All');
  // const [presalesAddresses, setPresalesAddresses] = useState<any>([]);
  const [presalesInfo, setPresalesInfo] = useState<any>([]);

  // const getPresalesAddresses = async () => {
  //   try {
  //     const addresses = await ContractLessLibrary.getPresalesAddresses();
  //     if (addresses) setPresalesAddresses(addresses);
  //     console.log('AllPoolsPage getPresalesAddresses:', addresses);
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };

  const getArrForSearch = async () => {
    try {
      const arrForSearch = await ContractLessLibrary.getArrForSearch();
      if (arrForSearch) setPresalesInfo(arrForSearch);
      console.log('AllPoolsPage getArrForSearch:', arrForSearch);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (!ContractLessLibrary) return;
    console.log('AllPoolsPage useEffect:');
    // getPresalesAddresses();
    getArrForSearch();
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
                value={search}
                onChange={(str: string) => setSearch(str)}
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
            {presalesInfo.map((item: any) => {
              const { address = '', title = '', description = '' } = item;
              if (search) {
                const isAddressInSearch = address.toLowerCase().includes(search.toLowerCase());
                const isTitleInSearch = title.toLowerCase().includes(search.toLowerCase());
                const isDescriptionInSearch = description.toLowerCase().includes(search.toLowerCase());
                if (!isAddressInSearch && !isTitleInSearch && !isDescriptionInSearch) return null;
              };
              const props = {
                name: 'Pool',
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
              return <TokenCard key={address} address={address} {...props} />;
            })}
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
