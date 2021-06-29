import s from './PagePresale.module.scss';
import Table from './Table/index';
// import logo1 from '../../assets/img/sections/logos/logo1.png';
import Search from '../../components/Search/index';
import { useEffect, useState } from 'react';
import { useContractsContext } from "../../contexts/ContractsContext";

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
  const { ContractLessLibrary } = useContractsContext();

  const [search, setSearch] = useState<string>('');
  const [presalesInfo, setPresalesInfo] = useState<any[]>([]);
  const [presalesAddressesFiltered, setPresalesAddressesFiltered] = useState<any[]>([]);

  const getArrForSearch = async () => {
    try {
      const arrForSearch = await ContractLessLibrary.getArrForSearch();
      if (arrForSearch) setPresalesInfo(arrForSearch);
      console.log('PageVoting getArrForSearch:', arrForSearch);
      const presalesAddressesFilteredNew = arrForSearch.map((item: any) => item.address);
      setPresalesAddressesFiltered(presalesAddressesFilteredNew);
    } catch (e) {
      console.error(e);
    }
  };

  const filterTable = async () => {
    try {
      const presalesInfoNew = presalesInfo.filter((item) => {
        const { address = '', title = '', description = '' } = item;
        if (search) {
          const isAddressInSearch = address.toLowerCase().includes(search.toLowerCase());
          const isTitleInSearch = title.toLowerCase().includes(search.toLowerCase());
          const isDescriptionInSearch = description.toLowerCase().includes(search.toLowerCase());
          if (!isAddressInSearch && !isTitleInSearch && !isDescriptionInSearch) return false;
        }
        return true;
      })
      const presalesAddressesFilteredNew = presalesInfoNew.map((item: any) => item.address);
      setPresalesAddressesFiltered(presalesAddressesFilteredNew);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (!ContractLessLibrary) return;
    getArrForSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ContractLessLibrary]);

  useEffect(() => {
    if (!ContractLessLibrary) return;
    if (!search) return;
    filterTable();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ContractLessLibrary, search]);

  return (
    <div className={s.page}>
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
