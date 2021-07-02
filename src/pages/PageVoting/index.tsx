import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';

// import logo1 from '../../assets/img/sections/logos/logo1.png';
import Search from '../../components/Search/index';

import Table from './Table/index';

import s from './PagePresale.module.scss';

// const tableDataExample = [
//   {
//     logo: logo1,
//     name: 'XOLO Finance',
//     priceBNB: 1.23,
//     softcap: 532,
//     hardcap: 116224,
//     daysBeforeOpen: 1,
//     likesPercent: 53.58,
//     dislikesPercent: 34,
//   },
//   {
//     logo: logo1,
//     name: 'Tease Fans',
//     priceBNB: 0.000023,
//     softcap: 123,
//     hardcap: 1124,
//     daysBeforeOpen: 43,
//     likesPercent: 87.58,
//     dislikesPercent: 2,
//   },
//   {
//     logo: logo1,
//     name: 'Tease Fans',
//     priceBNB: 0.000023,
//     softcap: 544,
//     hardcap: 65764,
//     daysBeforeOpen: 5,
//     likesPercent: 12.58,
//     dislikesPercent: 78,
//   },
// ];

const PageVoting: React.FC = () => {
  const [search, setSearch] = useState<string>('');
  const [presalesAddressesFiltered, setPresalesAddressesFiltered] = useState<any[]>([]);

  const { pools } = useSelector(({ pool }: any) => pool);

  const filterTable = async () => {
    try {
      const presalesInfoNew = pools.filter((item: any) => {
        const { address = '', title = '', description = '' } = item;
        if (search && search !== '') {
          const isAddressInSearch = address.toLowerCase().includes(search.toLowerCase());
          const isTitleInSearch = title.toLowerCase().includes(search.toLowerCase());
          const isDescriptionInSearch = description.toLowerCase().includes(search.toLowerCase());
          if (!isAddressInSearch && !isTitleInSearch && !isDescriptionInSearch) return false;
        }
        return true;
      });
      const presalesAddressesFilteredNew = presalesInfoNew.map((item: any) => item.address);
      setPresalesAddressesFiltered(presalesAddressesFilteredNew);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (!pools || !pools.length) return;
    // console.log('PageVoting pools:', pools)
    filterTable();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pools, search]);

  return (
    <div className={s.page}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Voting | Lesspad</title>
        <meta name="description" content="Voting" />
      </Helmet>

      <div className={s.container}>
        <div className={s.inner}>
          <div className={s.title}>Presale Voting</div>
          <div className={s.input}>
            <Search
              big
              value={search}
              onChange={setSearch}
              placeholder="Search by Name, Token contract address, Token description"
            />
          </div>
          <div className={s.table}>
            <Table data={presalesAddressesFiltered} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageVoting;
