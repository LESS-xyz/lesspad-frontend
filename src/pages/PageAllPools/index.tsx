import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';
import useMedia from 'use-media';
import { v4 as uuid } from 'uuid';

import bnbLogo from '../../assets/img/icons/bnb-logo.svg';
import logo1 from '../../assets/img/sections/token-card/logo-1.png';
import Pagination from '../../components/Pagination/index';
import Search from '../../components/Search/index';
import Selector from '../../components/Selector/index';
import TokenCard, { ITokenCardProps } from '../../components/TokenCard/index';

import s from './AllPools.module.scss';

const AllPoolsPage: React.FC = () => {
  const [search, setSearch] = useState<string>('');
  const [currentOption, setCurrentOption] = useState<string>('All');
  const [page, setPage] = useState<number>(0);

  const { pools } = useSelector(({ pool }: any) => pool);
  console.log('AllPoolsPage pools:', pools);

  const isMobile = useMedia({ maxWidth: 768 });

  const itemsOnPage = 6;
  let countOfPages = Math.floor(+(pools.length / itemsOnPage));
  const moduloOfPages = pools.length % itemsOnPage;
  if (countOfPages > 0 && moduloOfPages > 0) countOfPages += 1;

  const handleChangePage = (p: number) => setPage(p);

  return (
    <section className={s.page}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>All pools | Lesspad</title>
        <meta
          name="description"
          content="Multi-Chain Decentralized
Fundraising Capital"
        />
      </Helmet>

      <div className={s.container}>
        <div className={s.inner}>
          <div className={s.title}>
            All Pools {currentOption !== 'All' ? `- ${currentOption}` : ''}
          </div>
          <div className={s.control_panel}>
            <div className={s.input}>
              <Search
                big={isMobile}
                value={search}
                onChange={(str: string) => setSearch(str)}
                placeholder="Search by Name, Token contract address, Token description"
              />
            </div>
            <div className={s.selector}>
              <Selector
                fn={setCurrentOption}
                defaultOption="All"
                othersOptions={['Ended', 'In voting', 'Not opened']}
              />
            </div>
          </div>
          <div className={s.cards}>
            {pools.map((item: any, ii: number) => {
              const { address = '', title = '', description = '', isCertified } = item;
              // todo: fix pagination
              if (ii < page * itemsOnPage || ii >= (page + 1) * itemsOnPage) return null;
              if (search) {
                const isAddressInSearch = address.toLowerCase().includes(search.toLowerCase());
                const isTitleInSearch = title.toLowerCase().includes(search.toLowerCase());
                const isDescriptionInSearch = description
                  .toLowerCase()
                  .includes(search.toLowerCase());
                if (!isAddressInSearch && !isTitleInSearch && !isDescriptionInSearch) return null;
              }
              const props: ITokenCardProps = {
                address,
                logo: logo1,
                daysTillOpen: 3,
                name: 'XOLO Finance',
                subtitle: 'Participant',
                website: 'https://github.com/',
                telegram: 'https://t.me/durov',
                whitePaper: 'https://bitcoin.org/ru/bitcoin-paper',
                blockchainLogo: bnbLogo,
                chain: 'BNB',
                type: 'public',
                fundingToken: 'BNB',
                status: 'all',
                isCertified,
              };
              return <TokenCard key={uuid()} {...props} statusChoosenInFilter={currentOption} />;
            })}
          </div>
          <div className={s.pagination}>
            <Pagination countOfPages={countOfPages} onChange={handleChangePage} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AllPoolsPage;
