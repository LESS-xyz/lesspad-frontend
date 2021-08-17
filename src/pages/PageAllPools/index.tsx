import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import useMedia from 'use-media';
import { v4 as uuid } from 'uuid';

import Pagination from '../../components/Pagination/index';
import Search from '../../components/Search/index';
import Selector from '../../components/Selector/index';
import TokenCard, { ITokenCardProps } from '../../components/TokenCard/index';
import { useContractsContext } from '../../contexts/ContractsContext';

import s from './AllPools.module.scss';

const AllPoolsPage: React.FC = () => {
  const { ContractLessLibrary } = useContractsContext();
  const [search, setSearch] = useState<string>('');
  const [currentOption, setCurrentOption] = useState<string>('All');
  const [page, setPage] = useState<number>(0);
  const [votingTime, setVotingTime] = useState<number>(0);

  // const [info, setInfo] = useState<any[]>([]);
  const [poolsFiltered, setPoolsFiltered] = useState<any[]>([]);
  const [countOfPages, setCountOfPages] = useState<number>(1);

  const { pools } = useSelector(({ pool }: any) => pool);

  const isMobile = useMedia({ maxWidth: 768 });

  const itemsOnPage = 6;
  const setPagesCount = useCallback(() => {
    let count = Math.floor(+(poolsFiltered.length / itemsOnPage));
    const moduloOfPages = poolsFiltered.length % itemsOnPage;
    if (moduloOfPages > 0 && poolsFiltered.length > itemsOnPage) count += 1;
    setCountOfPages(count);
  }, [poolsFiltered.length]);

  const handleChangePage = useCallback((p: number) => setPage(p), []);

  const getVotingTime = useCallback(async () => {
    try {
      const newInfo = await ContractLessLibrary.getVotingTime();
      console.log('TokenCard getVotingTime:', newInfo);
      setVotingTime(+newInfo);
    } catch (e) {
      console.error('TableRow getVotingTime:', e);
    }
  }, [ContractLessLibrary]);

  const compareOpenVotingTime = (a, b) => b.openVotingTime - a.openVotingTime;

  const filterData = useCallback(async () => {
    // const info = pools.map(async (pool: any) => {
    //   const newInfo = await getInfo(pool.address);
    //   return newInfo;
    // });
    //
    // console.log('only public presales', info);
    if (pools && pools.length !== 0) {
      try {
        const poolsInfoNew = pools
          .filter((item: any) => {
            const {
              address = '',
              isCertified,
              description = '',
              title = '',
              openVotingTime = 0,
            } = item;
            let presaleStatus = '';
            const now = dayjs().valueOf();
            if (isCertified) {
              // if (openTimePresale > now) presaleStatus = 'Not opened';
              // if (openTimePresale < now) presaleStatus = 'Opened';
              // if (closeTimePresale < now) presaleStatus = 'Closed';
            } else {
              // if (openTimePresale > now) presaleStatus = 'Not opened';
              // if (openTimePresale < now) presaleStatus = 'Opened';
              if (openVotingTime < now) presaleStatus = 'In voting';
              // if (openVotingTime + votingTime * 1000 < now) presaleStatus = 'Voting ended';
              if (openVotingTime + votingTime * 1000 < now) presaleStatus = 'Ended';
            }
            if (currentOption && currentOption !== 'All' && currentOption !== presaleStatus)
              return false;
            if (search && search !== '') {
              const isAddressInSearch = address.toLowerCase().includes(search.toLowerCase());
              const isTitleInSearch = title.toLowerCase().includes(search.toLowerCase());
              const isDescriptionInSearch = description
                .toLowerCase()
                .includes(search.toLowerCase());
              if (!isAddressInSearch && !isTitleInSearch && !isDescriptionInSearch) return false;
            }
            return true;
          })
          .sort(compareOpenVotingTime);
        // const poolsAddressesFilteredNew = poolsInfoNew.map((item: any) => item.address);
        setPoolsFiltered(poolsInfoNew);
      } catch (e) {
        console.error(e);
      }
    }
  }, [currentOption, pools, search, votingTime]);

  /*  useEffect(() => {
      for (let i = 0, newInfo: any[] = []; i < pools.length; i += 1) {
        if (!pools[i].isCertified) {
          ContractPresalePublic.getInfo({ contractAddress: pools[i].address }).then((data) => {
            newInfo.push({ ...data, isCertified: pools[i].isCertified, address: pools[i].address });
            if (i === pools.length - 1) setInfo(newInfo);
          });
        }
      }
    }, [ContractPresalePublic, pools]); */

  useEffect(() => {
    if (!ContractLessLibrary) return;
    getVotingTime();
  }, [ContractLessLibrary, getVotingTime]);

  useEffect(() => {
    if (!pools || !pools.length) return;
    filterData();
  }, [search, pools, pools.length, currentOption, filterData]);

  useEffect(() => {
    setPagesCount();
  }, [poolsFiltered.length, setPagesCount]);

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
          {poolsFiltered?.length ? (
            <div className={s.cards}>
              {poolsFiltered.map((item: any, ii: number) => {
                const { address = '', /* title = '', description = '', */ isCertified } = item;
                if (ii < page * itemsOnPage || ii >= (page + 1) * itemsOnPage) return null;
                // if (search) {
                //   const isAddressInSearch = address.toLowerCase().includes(search.toLowerCase());
                //   const isTitleInSearch = title.toLowerCase().includes(search.toLowerCase());
                //   const isDescriptionInSearch = description
                //     .toLowerCase()
                //     .includes(search.toLowerCase());
                //   if (!isAddressInSearch && !isTitleInSearch && !isDescriptionInSearch) return null;
                // }
                const props: ITokenCardProps = {
                  address,
                  isCertified,
                };
                return <TokenCard key={uuid()} {...props} />;
              })}
            </div>
          ) : (
            <div className={s.status}>Loading...</div>
          )}
          <div className={s.pagination}>
            <Pagination countOfPages={countOfPages} onChange={handleChangePage} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AllPoolsPage;
