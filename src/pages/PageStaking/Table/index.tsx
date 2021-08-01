import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import useMedia from 'use-media';

import Pagination from '../../../components/Pagination';
import { useContractsContext } from '../../../contexts/ContractsContext';

// import { modalActions } from '../../../redux/actions';
import s from './Table.module.scss';

interface ITableRow {
  stakeId?: string;
}

interface ITableRowProps extends ITableRow {
  index: number;
}

const TableRow: React.FC<ITableRowProps> = (props) => {
  const { stakeId, index } = props;
  const { ContractStaking } = useContractsContext();

  const [info, setInfo] = useState<any>();

  // const { address: userAddress } = useSelector(({ user }: any) => user);

  // const dispatch = useDispatch();
  // const toggleModal = React.useCallback((params) => dispatch(modalActions.toggleModal(params)), [
  //   dispatch,
  // ]);

  const isMobile = useMedia({ maxWidth: 768 });

  const getInfo = async () => {
    try {
      const newInfo = await ContractStaking.stakes({ stakeId });
      if (newInfo) setInfo(newInfo);
      console.log('TableRow getInfo:', newInfo);
    } catch (e) {
      console.error('TableRow getInfo:', e);
    }
  };

  // const unstake = async () => {
  //   try {
  //     // const resultVote = await ContractPresalePublic.vote({
  //     //   userAddress,
  //     //   contractAddress: address,
  //     //   yes,
  //     // });
  //   } catch (e) {
  //     console.error('TableRow vote:', e);
  //   }
  // };

  useEffect(() => {
    if (!stakeId) return;
    if (!ContractStaking) return;
    getInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ContractStaking, stakeId]);

  // console.log('TableRow:', address, info);

  if (!stakeId) return null; // todo
  if (!info) return null; // todo

  const { stakedLess, stakedLp, startTime } = info;

  return (
    <div className={`${s.row} ${index % 2 === 1 && s.filled}`}>
      <div className={s.row_cell}>
        {isMobile && <div className={s.row_header}>#</div>}
        {index || '0.000'}
      </div>
      <div className={s.row_cell}>
        {isMobile && <div className={s.row_header}>Staked</div>}
        {dayjs(startTime).fromNow()}
      </div>
      <div className={s.row_cell}>
        {isMobile && <div className={s.row_header}>Staked $LESS</div>}
        {stakedLess || '0.000'}
      </div>
      <div className={s.row_cell}>
        {isMobile && <div className={s.row_header}>Staked $LESS LP</div>}
        {stakedLp || '0.000'}
      </div>
      {/*<div className={`${s.row_cell} ${s.opensIn}`}>*/}
      {/*  {isMobile && <div className={s.row_header}>Opens in</div>}*/}
      {/*</div>*/}
      {/*<div className={`${s.row_cell} ${s.likes}`}>*/}
      {/*  {isMobile && <div className={s.row_header}>Voting</div>}*/}
      {/*  <div className={s.likes}>*/}
      {/*    <div className={s.like}>*/}
      {/*      <div*/}
      {/*        className={s.likes_img}*/}
      {/*        role="button"*/}
      {/*        tabIndex={0}*/}
      {/*        onKeyDown={() => {}}*/}
      {/*        onClick={unstake}*/}
      {/*      >*/}
      {/*        <img src={thumbUpGreen} alt="thumbUpGreen" />*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</div>*/}
    </div>
  );
};

interface ITableProps {
  data: any[];
}

const Table: React.FC<ITableProps> = (props) => {
  const { data = [] } = props;

  const [page, setPage] = useState<number>(0);
  const [dataFiltered, setDataFiltrered] = useState<any[]>(data);

  const itemsOnPage = 12;
  let countOfPages = +(data.length / itemsOnPage).toFixed();
  const moduloOfPages = data.length % itemsOnPage;
  if (moduloOfPages > 0) countOfPages += 1;

  const isMobile = useMedia({ maxWidth: 768 });

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

  if (!data) return null;
  return (
    <div className={s.table}>
      <div className={s.inner}>
        {!isMobile && (
          <div className={s.table_header}>
            <div className={`${s.name} ${s.cell}`}>#</div>
            <div className={s.cell}>Staked</div>
            <div className={s.cell}>Staked $LESS</div>
            <div className={s.cell}>Staked $LESS LP</div>
          </div>
        )}
        <div className={s.table_body}>
          {dataFiltered.map((stakeId, index) => {
            return (
              // eslint-disable-next-line react/no-array-index-key
              <TableRow key={JSON.stringify(stakeId) + index} index={index + 1} stakeId={stakeId} />
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
