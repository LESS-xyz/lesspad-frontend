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

  const [inputValue, setInputValue] = useState<string>('');
  const [presalesAddresses, setPresalesAddresses] = useState<any[]>([]);

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
    <div className={s.page}>
      <div className={s.container}>
        <div className={s.inner}>
          <div className={s.title}>Presale Voting</div>
          <div className={s.input}>
            <Search
              big
              value={inputValue}
              onChange={(str: string) => setInputValue(str)}
              placeholder="Search by Name, Token contract address, Token description"
            />
          </div>
          <div className={s.table}>
            <Table data={presalesAddresses} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageVoting;
