import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';

import Button from '../../../components/Button';
import { useContractsContext } from '../../../contexts/ContractsContext';
import { libraryActions, modalActions } from '../../../redux/actions';
import { prettyNumber } from '../../../utils/prettifiers';
import Table from '../../PageVoting/Table';

import s from './PoolsInVoting.module.scss';

const PoolsiInVoting: React.FC = () => {
  const { ContractLessLibrary } = useContractsContext();
  //
  const [presalesAddressesFiltered, setPresalesAddressesFiltered] = useState<any[]>([]);
  const [votingTime, setVotingTime] = useState<number>();

  const { pools } = useSelector(({ pool }: any) => pool);
  const { minVoterBalance } = useSelector(({ library }: any) => library);

  const dispatch = useDispatch();
  const toggleModal = React.useCallback((params) => dispatch(modalActions.toggleModal(params)), [
    dispatch,
  ]);
  const setLibrary = React.useCallback((params) => dispatch(libraryActions.setLibrary(params)), [
    dispatch,
  ]);
  // const [info, setInfo] = useState<any[]>([]);

  const getVotingTime = async () => {
    try {
      const newInfo = await ContractLessLibrary.getVotingTime();
      console.log('TokenCard getVotingTime:', newInfo);
      setVotingTime(+newInfo);
    } catch (e) {
      console.error('TableRow getVotingTime:', e);
    }
  };

  const compareOpenVotingTime = (a, b) => {
    return b.openVotingTime - a.openVotingTime;
  };
  const filterTable = async () => {
    // const info = pools.map(async (pool: any) => {
    //   const newInfo = await getInfo(pool.address);
    //   return newInfo;
    // });
    //
    // console.log('only public presales', info);
    if (pools && pools.length !== 0) {
      try {
        const presalesInfoNew = pools
          .filter((item: any) => {
            const { openVotingTime = 0 } = item;
            const now = dayjs().valueOf();
            const isVotingEnded = now > openVotingTime + (votingTime ?? 0) * 1000;
            // console.log(`${address} ended`, isVotingEnded);
            if (isVotingEnded) return false;
            return true;
          })
          .sort(compareOpenVotingTime);
        const presalesAddressesFilteredNew = presalesInfoNew.map((item: any) => item.address);
        setPresalesAddressesFiltered(presalesAddressesFilteredNew);
      } catch (e) {
        console.error(e);
      }
    }
  };

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
    getVotingTime();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ContractLessLibrary]);

  /*  useEffect(() => {
      for (let i = 0, newInfo: any[] = []; i < pools.length; i += 1) {
        if (!pools[i].isCertified) {
          ContractPresalePublic.getInfo({ contractAddress: pools[i].address }).then((data) => {
            newInfo.push({ ...data, address: pools[i].address });
            if (i === pools.length - 1) setInfo(newInfo);
          });
        }
      }
    }, [ContractPresalePublic, pools]); */

  useEffect(() => {
    if (!ContractLessLibrary) return;
    // console.log('PageVoting pools:', pools)
    getMinVoterBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ContractLessLibrary]);

  useEffect(() => {
    if (!pools || !pools.length) return;
    filterTable();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pools, pools.length]);

  return (
    <section className={s.block}>
      <div className={s.container}>
        <div className={s.inner}>
          <div className={s.title}>Pools in Voting</div>
          {/* <div className={s.cards}>
            {pools.slice(0, 3).map((item: any) => {
              const { address = '', title = '', isCertified } = item;
              const props: ITokenCardProps = {
                address,
                logo: logo1,
                daysTillOpen: 3,
                name: title,
                subtitle: 'Participant',
                website: 'https://github.com/',
                telegram: 'https://t.me/durov',
                whitePaper: 'https://bitcoin.org/ru/bitcoin-paper',
                blockchainLogo: bnbLogo,
                chain: 'BNB',
                type: 'public',
                fundingToken: 'BNB',
                status: 'not opened',
                isCertified,
              };
              return <TokenCard key={uuid()} {...props} />;
            })}
          </div> */}
          <div className={s.subtitle}>
            <span role="button" tabIndex={0} onClick={handleShowInfo} onKeyDown={() => {}}>
              Info
            </span>
          </div>
          <div className={s.table}>
            <Table data={presalesAddressesFiltered} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PoolsiInVoting;
