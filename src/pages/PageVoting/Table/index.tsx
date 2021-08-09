import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import useMedia from 'use-media';

import thumbUpGreen from '../../../assets/img/icons/thumb-up-green.svg';
import thumbUpRed from '../../../assets/img/icons/thumb-up-red.svg';
import Pagination from '../../../components/Pagination';
import { useContractsContext } from '../../../contexts/ContractsContext';
import { modalActions } from '../../../redux/actions';
import { addHttps } from '../../../utils/prettifiers';

import s from './Table.module.scss';

interface ITableRow {
  address?: string;
  logo?: string;
  name?: string;
  priceBNB?: number;
  softcap?: number;
  hardcap?: number;
  daysBeforeOpen?: number;
  likesPercent?: number;
  dislikesPercent?: number;
}

interface ITableRowProps extends ITableRow {
  index: number;
}

const TableRow: React.FC<ITableRowProps> = (props) => {
  const {
    address,
    index,
    // name,
    // logo,
    // priceBNB,
    // softcap,
    // hardcap,
    daysBeforeOpen,
    // likesPercent,
    // dislikesPercent,
  } = props;
  const { ContractPresalePublic, ContractPresaleCertified } = useContractsContext();

  const [info, setInfo] = useState<any>();

  const { address: userAddress } = useSelector(({ user }: any) => user);
  const { chainType } = useSelector(({ wallet }: any) => wallet);

  const dispatch = useDispatch();
  const toggleModal = React.useCallback((params) => dispatch(modalActions.toggleModal(params)), [
    dispatch,
  ]);

  const isMobile = useMedia({ maxWidth: 768 });

  const isEthereum = chainType === 'Ethereum';
  const isBinanceSmartChain = chainType === 'Binance-Smart-Chain';
  const currency = isEthereum ? 'ETH' : isBinanceSmartChain ? 'BNB' : 'MATIC';

  const getInfo = async () => {
    try {
      const newInfo = await ContractPresaleCertified.getInfo({ contractAddress: address });
      console.log('TokenCard getInfo certified:', newInfo);
      if (newInfo) setInfo(newInfo);
    } catch (e) {
      console.error('TableRow getInfo:', e);
      const newInfo = await ContractPresalePublic.getInfo({ contractAddress: address });
      console.log('TokenCard getInfo public:', newInfo);
      if (newInfo) setInfo(newInfo);
    }
  };

  const vote = async (yes: boolean) => {
    try {
      const resultVote = await ContractPresalePublic.vote({
        userAddress,
        contractAddress: address,
        yes,
      });
      let message = 'Voting succeded';
      if (!resultVote) {
        message = 'Voting not succeded';
      }
      toggleModal({
        open: true,
        text: (
          <div className={s.messageContainer}>
            <div>{message}</div>
          </div>
        ),
      });
    } catch (e) {
      console.error('TableRow vote:', e);
    }
  };

  useEffect(() => {
    if (!address) return;
    if (!ContractPresalePublic) return;
    getInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ContractPresalePublic, address]);

  // console.log('TableRow:', address, info);

  if (!address) return null; // todo
  if (!info) return null; // todo

  const { hardCap, softCap, saleTitle, listingPrice, linkLogo, yesVotes = 0, noVotes = 0 } = info;

  const yesVotesPercent = yesVotes ? ((yesVotes / (yesVotes + noVotes)) * 100).toFixed(2) : 0;
  const noVotesPercent = noVotes === 0 ? 0 : 100 - +yesVotesPercent;

  return (
    <div className={`${s.row} ${index % 2 === 1 && s.filled}`}>
      {isMobile ? (
        <Link className={`${s.row_cell} ${s.title}`} to={`/pool/${address}`}>
          <div className={`${s.img}`}>
            <img src={addHttps(linkLogo)} alt="logo" />
          </div>
          <div className={`${s.name}`}>
            <div>{saleTitle || 'Name'}</div>
          </div>
        </Link>
      ) : (
        <>
          <Link className={`${s.row_cell} ${s.img}`} to={`/pool/${address}`}>
            {linkLogo ? <img src={addHttps(linkLogo)} alt="logo" /> : null}
          </Link>
          <Link className={`${s.row_cell} ${s.name}`} to={`/pool/${address}`}>
            <div>{saleTitle || 'Name'}</div>
          </Link>
        </>
      )}
      <div className={`${s.row_cell} ${s.price}`}>
        {isMobile && <div className={s.row_header}>Price (ETH)</div>}
        {listingPrice || '0.000'}
      </div>
      <div className={s.row_cell}>
        {isMobile && <div className={s.row_header}>Soft cap</div>}
        {softCap} {currency}
      </div>
      <div className={s.row_cell}>
        {isMobile && <div className={s.row_header}>Hard cap</div>}
        {hardCap} {currency}
      </div>
      <div className={`${s.row_cell} ${s.opensIn}`}>
        {isMobile && <div className={s.row_header}>Opens in</div>}
        {daysBeforeOpen} {daysBeforeOpen && daysBeforeOpen > 1 ? 'days' : 'day'}
      </div>
      <div className={`${s.row_cell} ${s.likes}`}>
        {isMobile && <div className={s.row_header}>Voting</div>}
        <div className={s.likes}>
          <div className={s.like}>
            <div
              className={s.likes_img}
              role="button"
              tabIndex={0}
              onKeyDown={() => {}}
              onClick={() => vote(true)}
            >
              <img src={thumbUpGreen} alt="thumbUpGreen" />
            </div>
            <div className={s.likes_data}>
              {yesVotesPercent &&
                (+yesVotesPercent < 10 ? +`0${yesVotesPercent}` : yesVotesPercent)}
              %
            </div>
          </div>
          <div className={s.like}>
            <div
              className={s.likes_img}
              role="button"
              tabIndex={0}
              onKeyDown={() => {}}
              onClick={() => vote(false)}
            >
              <img src={thumbUpRed} alt="thumbUpRed" />
            </div>
            <div className={s.likes_data}>
              {noVotesPercent &&
                noVotesPercent &&
                (noVotesPercent < 10 ? +`0${noVotesPercent}` : noVotesPercent)}
              %
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ITableProps {
  data: string[];
}

const Table: React.FC<ITableProps> = ({ data }) => {
  const { chainType } = useSelector(({ wallet }: any) => wallet);

  const [page, setPage] = useState<number>(0);
  const [dataFiltered, setDataFiltrered] = useState<any[]>(data);

  const itemsOnPage = 12;
  let countOfPages = +(data.length / itemsOnPage).toFixed();
  const moduloOfPages = data.length % itemsOnPage;
  if (moduloOfPages > 0) countOfPages += 1;

  const isMobile = useMedia({ maxWidth: 768 });

  const isEthereum = chainType === 'Ethereum';
  const isBinanceSmartChain = chainType === 'Binance-Smart-Chain';
  const currency = isEthereum ? 'ETH' : isBinanceSmartChain ? 'BNB' : 'MATIC';

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
      console.log('TableVoting newData:', data, newData);
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
            <div className={s.cell} />
            <div className={`${s.name} ${s.cell}`}>Name</div>
            <div className={s.cell}>Price ({currency})</div>
            <div className={s.cell}>Softcap</div>
            <div className={s.cell}>Hardcap</div>
            <div className={s.cell}>Opens in</div>
            <div className={`${s.voting} ${s.cell}`}>Voting</div>
          </div>
        )}
        <div className={s.table_body}>
          {dataFiltered.map((address, index) => {
            return (
              // eslint-disable-next-line react/no-array-index-key
              <TableRow key={JSON.stringify(address) + index} index={index + 1} address={address} />
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
