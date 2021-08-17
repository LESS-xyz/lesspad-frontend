import React, { memo, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from '../../../components/Button';
import config from '../../../config';
import { useContractsContext } from '../../../contexts/ContractsContext';
import { libraryActions, modalActions } from '../../../redux/actions';
import { prettyNumber } from '../../../utils/prettifiers';
import Table from '../../PageVoting/Table';

import s from './PoolsInVoting.module.scss';

const { NOW } = config;

const PoolsiInVoting: React.FC = () => {
  const { ContractLessLibrary } = useContractsContext();

  const [presalesAddressesFiltered, setPresalesAddressesFiltered] = useState<any[]>([]);
  const [votingTime, setVotingTime] = useState<number>(0);

  const { pools } = useSelector(({ pool }: any) => pool);
  const { minVoterBalance } = useSelector(({ library }: any) => library);
  const { lessPerLp } = useSelector(({ library }: any) => library);

  const dispatch = useDispatch();
  const toggleModal = React.useCallback((params) => dispatch(modalActions.toggleModal(params)), [
    dispatch,
  ]);
  const setLibrary = React.useCallback((params) => dispatch(libraryActions.setLibrary(params)), [
    dispatch,
  ]);

  const getVotingTime = useCallback(async () => {
    try {
      const newInfo = await ContractLessLibrary.getVotingTime();
      console.log('TokenCard getVotingTime:', newInfo);
      setVotingTime(+newInfo);
    } catch (e) {
      console.error('TableRow getVotingTime:', e);
    }
  }, [ContractLessLibrary]);

  const compareOpenVotingTime = (a, b) => {
    return b.openVotingTime - a.openVotingTime;
  };
  const filterTable = useCallback(async () => {
    if (pools && pools.length !== 0) {
      try {
        const presalesInfoNew = pools
          .filter((item: any) => {
            const { openVotingTime = 0 } = item;
            if (!openVotingTime) return false;
            const isVoting = NOW > openVotingTime && NOW < openVotingTime + votingTime * 1000;
            // console.log(`${address} ended`, isVotingEnded);
            if (!isVoting) return false;
            return true;
          })
          .sort(compareOpenVotingTime);
        const presalesAddressesFilteredNew = presalesInfoNew.map((item: any) => item.address);
        setPresalesAddressesFiltered(presalesAddressesFilteredNew);
      } catch (e) {
        console.error(e);
      }
    }
  }, [pools, votingTime]);

  const getMinVoterBalance = useCallback(async () => {
    try {
      const resultGetMinVoterBalance = await ContractLessLibrary.getMinVoterBalance();
      setLibrary({ minVoterBalance: resultGetMinVoterBalance });
    } catch (e) {
      console.error(e);
    }
  }, [ContractLessLibrary, setLibrary]);

  const handleShowInfo = () => {
    try {
      toggleModal({
        open: true,
        text: (
          <div className={s.messageContainer}>
            You need at least {minVoterBalance} $LESS or{' '}
            {prettyNumber((+minVoterBalance / lessPerLp).toString())} ETH-LESS LP in stake to be
            able to vote
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
  }, [ContractLessLibrary, getVotingTime]);

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
  }, [ContractLessLibrary, getMinVoterBalance]);

  useEffect(() => {
    if (!pools || !pools.length) return;
    filterTable();
  }, [filterTable, pools, pools.length]);

  return (
    <section className={s.block}>
      <div className={s.container}>
        <div className={s.inner}>
          <div className={s.title}>Pools in Voting</div>
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

export default memo(PoolsiInVoting);
