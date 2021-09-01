import React, { memo, useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';
import useMedia from 'use-media';
import { v4 as uuid } from 'uuid';

import Pagination from '../../components/Pagination/index';
import Search from '../../components/Search/index';
import Selector from '../../components/Selector/index';
import TokenCard, { ITokenCardProps } from '../../components/TokenCard/index';
import config from '../../config';
import { useContractsContext } from '../../contexts/ContractsContext';

import s from './AllPools.module.scss';

const { NOW } = config;

const AllPoolsPage: React.FC = () => {
  const { ContractLessLibrary } = useContractsContext();
  const [search, setSearch] = useState<string>('');
  const [currentOption, setCurrentOption] = useState<string>('All');
  const [page, setPage] = useState<number>(0);
  const [votingTime, setVotingTime] = useState<number>(0);

  const [poolsFiltered, setPoolsFiltered] = useState<any[]>([]);
  const [poolsFilteredByPage, setPoolsFilteredByPage] = useState<any[]>([]);
  const [countOfPages, setCountOfPages] = useState<number>(1);

  const { pools } = useSelector(({ pool }: any) => pool);

  const isMobile = useMedia({ maxWidth: 768 });

  const itemsOnPage = 6;

  const setPagesCount = useCallback(() => {
    let count = Math.floor(+(poolsFiltered.length / itemsOnPage));
    const moduloOfPages = poolsFiltered.length % itemsOnPage;
    if (moduloOfPages > 0 && poolsFiltered.length > itemsOnPage) count += 1;
    setCountOfPages(count);
  }, [poolsFiltered]);

  const handleChangeFilter = useCallback((value: string) => {
    setCurrentOption(value);
    setPage(0);
  }, []);

  const handleChangePage = useCallback((p: number) => setPage(p), []);

  const getVotingTime = useCallback(async () => {
    try {
      const newInfo = await ContractLessLibrary.getVotingTime();
      console.log('PageAllPools getVotingTime:', newInfo);
      setVotingTime(+newInfo);
    } catch (e) {
      console.error('PageAllPools getVotingTime:', e);
    }
  }, [ContractLessLibrary]);

  const filterData = useCallback(async () => {
    try {
      const compareOpenVotingTime = (a, b) => b.openVotingTime - a.openVotingTime;
      const poolsInfoNew = pools
        .reverse()
        .filter((item: any) => {
          const {
            address = '',
            isCertified,
            description = '',
            title = '',
            openVotingTime = 0,
          } = item;
          let presaleStatus = '';
          if (isCertified) {
            presaleStatus = 'Certified';
            // if (openTimePresale > now) presaleStatus = 'Not opened';
            // if (openTimePresale < now) presaleStatus = 'Opened';
            // if (closeTimePresale < now) presaleStatus = 'Closed';
          } else {
            // if (openTimePresale > now) presaleStatus = 'Not opened';
            // if (openTimePresale < now) presaleStatus = 'Opened';
            if (openVotingTime < NOW && openVotingTime + votingTime * 1000 >= NOW)
              presaleStatus = 'In voting';
            // if (openVotingTime + votingTime * 1000 < now) presaleStatus = 'Voting ended';
            if (openVotingTime + votingTime * 1000 < NOW) presaleStatus = 'Ended';
          }
          if (currentOption && currentOption !== 'All' && currentOption !== presaleStatus)
            return false;
          if (search && search !== '') {
            const isAddressInSearch = address.toLowerCase().includes(search.toLowerCase());
            const isTitleInSearch = title.toLowerCase().includes(search.toLowerCase());
            const isDescriptionInSearch = description.toLowerCase().includes(search.toLowerCase());
            if (!isAddressInSearch && !isTitleInSearch && !isDescriptionInSearch) return false;
          }
          return true;
        })
        .sort(compareOpenVotingTime);
      console.log('PageAllPools filterData:', poolsInfoNew);
      setPoolsFiltered([...poolsInfoNew]);
    } catch (e) {
      console.error(e);
    }
  }, [currentOption, pools, search, votingTime]);

  const filterDataByPage = useCallback(async () => {
    try {
      const poolsInfoNew = poolsFiltered.filter((item: any, ii: number) => {
        if (ii < page * itemsOnPage || ii >= (page + 1) * itemsOnPage) return false;
        return true;
      });
      console.log('PageAllPools filterDataByPage:', poolsInfoNew);
      setPoolsFilteredByPage([...poolsInfoNew]);
    } catch (e) {
      console.error(e);
    }
  }, [page, poolsFiltered]);

  useEffect(() => {
    if (!ContractLessLibrary) return;
    getVotingTime();
  }, [ContractLessLibrary, getVotingTime]);

  useEffect(() => {
    if (!ContractLessLibrary) return;
    if (!votingTime) return;
    if (!pools || !pools.length) return;
    filterData();
  }, [ContractLessLibrary, search, pools, pools.length, currentOption, filterData, votingTime]);

  useEffect(() => {
    if (!poolsFiltered) return;
    filterDataByPage();
  }, [filterDataByPage, page, poolsFiltered]);

  useEffect(() => {
    if (!poolsFiltered || !poolsFiltered.length) return;
    setPagesCount();
  }, [poolsFiltered, poolsFiltered.length, setPagesCount]);

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
                fn={handleChangeFilter}
                defaultOption="All"
                othersOptions={['Ended', 'In voting', 'Not opened', 'Certified']}
              />
            </div>
          </div>

          {poolsFilteredByPage?.length ? (
            <div className={s.cards}>
              {poolsFilteredByPage.map((item: any) => {
                const { address = '', isCertified } = item;
                const props: ITokenCardProps = {
                  address,
                  isCertified,
                };
                return <TokenCard key={uuid()} {...props} />;
              })}
            </div>
          ) : (
            <div className={s.status}>No data</div>
          )}

          <div className={s.pagination}>
            <Pagination countOfPages={countOfPages} onChange={handleChangePage} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(AllPoolsPage);
