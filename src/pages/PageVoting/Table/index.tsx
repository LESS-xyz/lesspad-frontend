import s from './Table.module.scss';
import thumbUpGreen from '../../../assets/img/icons/thumb-up-green.svg';
import thumbUpRed from '../../../assets/img/icons/thumb-up-red.svg';
import { useContractsContext } from "../../../contexts/ContractsContext";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { modalActions } from "../../../redux/actions";

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

type TypeModalParams = {
  open: boolean;
  text?: string | React.ReactElement;
  header?: string | React.ReactElement;
  delay?: number;
};

const TableRow: React.FC<ITableRowProps> = (props) => {
  const {
    address,
    index,
    // name,
    logo,
    // priceBNB,
    // softcap,
    // hardcap,
    daysBeforeOpen,
    likesPercent,
    dislikesPercent,
  } = props;
  const { ContractPresalePublic } = useContractsContext();

  const [info, setInfo] = useState<any>();

  const { address: userAddress } = useSelector(({ user }: any) => user);
  const { chainType } = useSelector(({ wallet }: any) => wallet);

  const dispatch = useDispatch();
  const toggleModal = React.useCallback(
    (params: TypeModalParams) => dispatch(modalActions.toggleModal(params)),
    [dispatch],
  );

  const isEthereum = chainType === 'Ethereum';
  const isBinanceSmartChain = chainType === 'Binance-Smart-Chain';
  const currency = isEthereum ? 'ETH' : isBinanceSmartChain ? 'BNB' : 'MATIC';

  const getInfo = async () => {
    try {
      const newInfo = await ContractPresalePublic.getInfo({ contractAddress: address });
      if (newInfo) setInfo(newInfo);
      console.log('TableRow getInfo:', newInfo);
    } catch (e) {
      console.error('TableRow getInfo:', e);
    }
  };

  const vote = async (yes: boolean) => {
    try {
      const resultVote = await ContractPresalePublic.vote({
        userAddress,
        contractAddress: address,
        yes,
      });
      let message = 'Voting succeded'
      if (!resultVote) {
        message = 'Voting not succeded'
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

  console.log('TableRow:', address, info);

  if (!address) return null; // todo
  if (!info) return null; // todo

  const { hardCap, softCap, saleTitle, listingPrice } = info;

  return (
    <div className={`${s.row} ${index % 2 === 1 && s.filled}`}>
      <div className={`${s.row_cell} ${s.img}`}>
        <img src={logo} alt="logo" />
      </div>
      <div className={`${s.row_cell} ${s.name}`}>{saleTitle}</div>
      <div className={`${s.row_cell} ${s.price}`}>{listingPrice}</div>
      <div className={s.row_cell}>{softCap} {currency}</div>
      <div className={s.row_cell}>{hardCap} {currency}</div>
      <div className={s.row_cell}>
        {daysBeforeOpen} {daysBeforeOpen && daysBeforeOpen > 1 ? 'days' : 'day'}
      </div>
      <div className={`${s.row_cell} ${s.likes}`}>
        <div className={s.likes}>
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
            {likesPercent && (likesPercent < 10 ? +`0${likesPercent}` : likesPercent).toFixed(2)}%
          </div>
        </div>
        <div className={s.likes}>
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
            {likesPercent && dislikesPercent && (likesPercent < 10 ? +`0${likesPercent}` : dislikesPercent).toFixed(2)}%
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

  const isEthereum = chainType === 'Ethereum';
  const isBinanceSmartChain = chainType === 'Binance-Smart-Chain';
  const currency = isEthereum ? 'ETH' : isBinanceSmartChain ? 'BNB' : 'MATIC';

  if (!data) return null;
  return (
    <div className={s.table}>
      <div className={s.inner}>
        <div className={s.table_header}>
          <div className={s.cell} />
          <div className={`${s.name} ${s.cell}`}>Name</div>
          <div className={s.cell}>Price ({currency})</div>
          <div className={s.cell}>Softcap</div>
          <div className={s.cell}>Hardcap</div>
          <div className={s.cell}>Opens in</div>
          <div className={`${s.voting} ${s.cell}`}>Voting</div>
        </div>
        <div className={s.table_body}>
          {data.map((address, index) => (
            <TableRow key={JSON.stringify(address)} index={index + 1} address={address} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Table;
