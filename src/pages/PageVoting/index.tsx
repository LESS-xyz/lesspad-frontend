import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';

import Button from '../../components/Button';
// import logo1 from '../../assets/img/sections/logos/logo1.png';
import Search from '../../components/Search/index';
import { useContractsContext } from '../../contexts/ContractsContext';
import { libraryActions, modalActions } from '../../redux/actions';
import { prettyNumber } from '../../utils/prettifiers';

import Table from './Table/index';

import s from './PageVoting.module.scss';

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
  const { ContractLessLibrary, ContractPresalePublic } = useContractsContext();
  //
  const [search, setSearch] = useState<string>('');
  const [presalesAddressesFiltered, setPresalesAddressesFiltered] = useState<any[]>([]);

  const { pools } = useSelector(({ pool }: any) => pool);
  const { minVoterBalance } = useSelector(({ library }: any) => library);

  const dispatch = useDispatch();
  const toggleModal = React.useCallback((params) => dispatch(modalActions.toggleModal(params)), [
    dispatch,
  ]);
  const setLibrary = React.useCallback((params) => dispatch(libraryActions.setLibrary(params)), [
    dispatch,
  ]);
  //
  // const getInfo = async (address) => {
  //   try {
  //     const newInfo = await ContractPresalePublic.getInfo({ contractAddress: address });
  //     if (newInfo) return newInfo;
  //   } catch (e) {
  //     console.error('TableRow getInfo:', e);
  //   }
  //   return null;
  // };
  const [info, setInfo] = useState<any[]>();

  useEffect(() => {
    for (let i = 0, newInfo: any[] = []; i < pools.length; i += 1) {
      if (!pools[i].isCertified) {
        ContractPresalePublic.getInfo({ contractAddress: pools[i].address }).then((data) => {
          newInfo.push({ ...data, address: pools[i].address });
        });
        setInfo(newInfo);
      }
    }
  }, [ContractPresalePublic, pools]);
  //
  const filterTable = useCallback(async () => {
    // const info = pools.map(async (pool: any) => {
    //   const newInfo = await getInfo(pool.address);
    //   return newInfo;
    // });
    //
    // console.log('only public presales', info);
    if (info && info.length !== 0) {
      try {
        const presalesInfoNew = info.filter((item: any) => {
          const { address = '', description = '' } = item;
          const { saleTitle = '', closeTimeVoting = 0 } = item;
          if (search && search !== '') {
            const isAddressInSearch = address.toLowerCase().includes(search.toLowerCase());
            const isTitleInSearch = saleTitle.toLowerCase().includes(search.toLowerCase());
            const isDescriptionInSearch = description.toLowerCase().includes(search.toLowerCase());
            const isVotingEnded = Date.now() > closeTimeVoting;
            if (!isAddressInSearch && !isTitleInSearch && !isDescriptionInSearch && isVotingEnded)
              return false;
            return true;
          }
          return true;
        });
        const presalesAddressesFilteredNew = presalesInfoNew.map((item: any) => item.address);
        setPresalesAddressesFiltered(presalesAddressesFilteredNew);
      } catch (e) {
        console.error(e);
      }
    }
  }, [info, search]);

  const getMinVoterBalance = async () => {
    try {
      const resultGetMinVoterBalance = await ContractLessLibrary.getMinVoterBalance();
      setLibrary({ minVoterBalance: resultGetMinVoterBalance });
    } catch (e) {
      console.error(e);
    }
  };

  const handleShowInfo = () => {
    try {
      toggleModal({
        open: true,
        text: (
          <div className={s.messageContainer}>
            You need at least {minVoterBalance} $LESS or{' '}
            {prettyNumber((+minVoterBalance / 300).toString())} ETH-LESS LP in stake to be able to
            vote
            <div className={s.messageContainerButtons}>
              <Button to="/staking">Go to Staking</Button>
            </div>
          </div>
        ),
      });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (!ContractLessLibrary) return;
    // console.log('PageVoting pools:', pools)
    getMinVoterBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ContractLessLibrary]);

  useEffect(() => {
    if (!pools || !pools.length) return;
    setPresalesAddressesFiltered(pools.map((item: any) => item.address));
    if (!info || !info.length) return;
    filterTable();
  }, [pools, search, info, filterTable]);
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
          <div className={s.subtitle}>
            <span role="button" tabIndex={0} onClick={handleShowInfo} onKeyDown={() => {}}>
              Info
            </span>
          </div>
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
