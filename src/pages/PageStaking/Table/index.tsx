import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import useMedia from 'use-media';

import Pagination from '../../../components/Pagination';
import { useContractsContext } from '../../../contexts/ContractsContext';
import { prettyNumber } from '../../../utils/prettifiers';

// import { modalActions } from '../../../redux/actions';
import s from './Table.module.scss';

dayjs.extend(duration);

interface ITableRow {
  stakeId?: string;
  minStakeTime?: number;
}

interface ITableRowProps extends ITableRow {
  index: number;
}

const TableRow: React.FC<ITableRowProps> = (props) => {
  const { stakeId, index, minStakeTime = 0 } = props;
  const { ContractStaking } = useContractsContext();

  const [info, setInfo] = useState<any>();
  const [currentDay, setCurrentDay] = useState<number>(0);

  // const { address: userAddress } = useSelector(({ user }: any) => user);

  // const dispatch = useDispatch();
  // const toggleModal = React.useCallback((params) => dispatch(modalActions.toggleModal(params)), [
  //   dispatch,
  // ]);

  const isMobile = useMedia({ maxWidth: 768 });

  const getInfo = async () => {
    try {
      const lessReward = await ContractStaking.getLessRewardOnStake({ stakeId });
      const lpReward = await ContractStaking.getLpRewardOnStake({ stakeId });
      const newInfo = await ContractStaking.stakes({ stakeId });
      const resultCurrentDay = await ContractStaking.currentDay();
      setCurrentDay(resultCurrentDay);
      if (newInfo) setInfo({ ...newInfo, ...{ lessReward }, ...{ lpReward } });
      console.log('TableRow getInfo:', newInfo);
    } catch (e) {
      console.error('TableRow getInfo:', e);
    }
  };

  const unstake = async () => {
    try {
      const resultUnstake = await ContractStaking.unstake({ stakeId });
      console.log('TableRow unstake:', resultUnstake);
    } catch (e) {
      console.error('TableRow vote:', e);
    }
  };

  useEffect(() => {
    if (!stakeId) return;
    if (!ContractStaking) return;
    getInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ContractStaking, stakeId]);

  // console.log('TableRow:', address, info);

  if (!stakeId) return null; // todo
  if (!info) return null; // todo

  const { stakedLess, stakedLp, startTime, lessReward, lpReward } = info;
  const stakeDays = currentDay - startTime;
  const minDaysToStake = minStakeTime - stakeDays - 1; // в последний день награда уже приходит
  const isMinStakeTimePassed = stakeDays >= minStakeTime;

  return (
    <div className={`${s.row} ${index % 2 === 1 && s.filled}`}>
      <div className={s.row_cell}>
        {isMobile && <div className={s.row_header}>#</div>}
        {index || '0'}
      </div>
      <div className={s.row_cell}>
        {isMobile && <div className={s.row_header}>Staked</div>}
        {stakeDays}
      </div>
      <div className={s.row_cell}>
        {isMobile && <div className={s.row_header}>Staked $LESS</div>}
        {prettyNumber(stakedLess) || '0'}
      </div>
      <div className={s.row_cell}>
        {isMobile && <div className={s.row_header}>Staked ETH-LESS LP</div>}
        {prettyNumber(stakedLp) || '0'}
      </div>
      <div className={s.row_cell}>
        {isMobile && <div className={s.row_header}>Reward $LESS</div>}
        {prettyNumber(lessReward) || '0'}
      </div>
      <div className={s.row_cell}>
        {isMobile && <div className={s.row_header}>Reward ETH-LESS LP</div>}
        {prettyNumber(lpReward) || '0'}
      </div>
      <div className={s.row_cell}>
        {isMobile && <div className={s.row_header}>Min stake time ({minStakeTime} days)</div>}
        {isMinStakeTimePassed ? 'Passed' : minDaysToStake}
      </div>
      <div className={`${s.row_cell} ${isMobile && s.row_cell_allCells}`}>
        <div role="button" tabIndex={0} onKeyDown={() => {}} onClick={unstake} className={s.button}>
          Claim Rewards and Unstake
        </div>
      </div>
    </div>
  );
};

interface ITableProps {
  data: any[];
}

const Table: React.FC<ITableProps> = (props) => {
  let { data = [] } = props;
  if (!data) data = [];
  const { ContractStaking } = useContractsContext();

  const [page, setPage] = useState<number>(0);
  const [dataFiltered, setDataFiltrered] = useState<any[]>(data);

  const [minStakeTime, setMinStakeTime] = useState<number>(0);

  const itemsOnPage = 12;
  let countOfPages = +(data.length / itemsOnPage).toFixed();
  const moduloOfPages = data.length % itemsOnPage;
  if (moduloOfPages > 0) countOfPages += 1;

  const isMobile = useMedia({ maxWidth: 768 });

  const getMinStakeTime = async () => {
    try {
      const result = await ContractStaking.getMinStakeTime();
      setMinStakeTime(result);
    } catch (e) {
      console.error('StakingPage getMinStakeTime:', e);
    }
  };

  const handleChangePage = (p: number) => {
    setPage(p);
  };

  const filterData = () => {
    try {
      const newData = data.filter((item: any, index: number) => {
        if (index < page * itemsOnPage || index >= (page + 1) * itemsOnPage) return false;
        return true;
      });
      setDataFiltrered(newData);
      console.log('newData:', data, newData);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    filterData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, data]);

  useEffect(() => {
    if (!ContractStaking) return;
    getMinStakeTime();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ContractStaking]);

  if (!data.length)
    return (
      <div className={s.table}>
        <div className={s.table_body} style={{ textAlign: 'center' }}>
          No stakes yet
        </div>
      </div>
    );
  return (
    <div className={s.table}>
      <div className={s.inner}>
        {!isMobile && (
          <div className={s.table_header}>
            <div className={`${s.name} ${s.cell}`}>#</div>
            <div className={s.cell}>Staked</div>
            <div className={s.cell}>Staked $LESS</div>
            <div className={s.cell}>Staked ETH-LESS LP</div>
            <div className={s.cell}>Reward $LESS</div>
            <div className={s.cell}>Reward ETH-LESS LP</div>
            <div className={s.cell}>
              {/*Min stake time ({dayjs.duration(minStakeTime).asDays().toFixed()}*/}
              Min stake time ({minStakeTime} days)
            </div>
          </div>
        )}
        <div className={s.table_body}>
          {dataFiltered.map((stakeId, index) => {
            return (
              <TableRow
                // eslint-disable-next-line react/no-array-index-key
                key={JSON.stringify(stakeId) + index}
                index={index + 1}
                stakeId={stakeId}
                minStakeTime={minStakeTime}
              />
            );
          })}
        </div>
      </div>
      <div className={s.pagination}>
        <Pagination countOfPages={countOfPages} onChange={handleChangePage} />
      </div>
    </div>
  );
};

export default Table;
