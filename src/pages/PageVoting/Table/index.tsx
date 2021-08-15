import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import useMedia from 'use-media';

import thumbUpGreen from '../../../assets/img/icons/thumb-up-green.svg';
import thumbUpRed from '../../../assets/img/icons/thumb-up-red.svg';
import Pagination from '../../../components/Pagination';
import { useContractsContext } from '../../../contexts/ContractsContext';
import { useWeb3ConnectorContext } from '../../../contexts/Web3Connector';
import { modalActions } from '../../../redux/actions';
import { BackendService } from '../../../services/Backend';
import { addHttps } from '../../../utils/prettifiers';

//
import s from './Table.module.scss';

const Backend = new BackendService();

interface ITableRow {
  address: string;
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
  const { web3 } = useWeb3ConnectorContext();
  const {
    ContractPresalePublic,
    ContractPresaleCertified,
    ContractPresalePublicWithMetamask,
    ContractLessLibrary,
  } = useContractsContext();
  const history = useHistory();

  const [info, setInfo] = useState<any>();
  const [votingTime, setVotingTime] = useState<number>();
  // const [registerResult, setRegisterResult] = useState<any>();

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

  const getVotingTime = async () => {
    try {
      const newInfo = await ContractLessLibrary.getVotingTime();
      console.log('TokenCard getVotingTime:', newInfo);
      setVotingTime(newInfo);
    } catch (e) {
      console.error('TableRow getVotingTime:', e);
    }
  };

  const loginToBackend = async () => {
    try {
      const resultGetMetamaskMessage = await Backend.getMetamaskMessage();
      console.log('PageVote loginToBackend resultGetMetamaskMessage:', resultGetMetamaskMessage);
      if (!resultGetMetamaskMessage.data) throw new Error('getMetamaskMessage unsuccesful');
      const msg = resultGetMetamaskMessage.data;
      const signedMsg = await web3.signMessage({ userAddress, message: msg });
      console.log('PageVote loginToBackend signedMsg:', signedMsg);
      if (!signedMsg) throw new Error('signMessage unsuccesful');
      const resultMetamaskLogin = await Backend.metamaskLogin({
        address: userAddress,
        msg,
        signedMsg,
      });
      console.log('PageVote loginToBackend resultMetamaskLogin:', resultMetamaskLogin);
      if (!resultMetamaskLogin.data) throw new Error('metamaskLogin unsuccesful');
      const { key } = resultMetamaskLogin.data;
      return { success: true, data: { key } };
    } catch (e) {
      console.error('PageVote vote:', e);
      return { success: false, data: null };
    }
  };
  const vote = async (yes: boolean) => {
    try {
      const resultLoginToBackend = await loginToBackend();
      if (!resultLoginToBackend.success) throw new Error('Not logged to backend');
      const { key }: any = resultLoginToBackend.data;
      const resultGetPoolSignature = await Backend.getVotingSignature({
        token: key,
        pool: address,
      });
      console.log('PageVote vote resultGetPoolSignature:', resultGetPoolSignature);
      if (!resultGetPoolSignature.data) throw new Error('Cannot get pool signature');
      const {
        date,
        signature,
        user_balance: stakingAmount,
        stakedAmount: totalStakedAmount,
      } = resultGetPoolSignature.data;
      // const totalStakedAmountInEth = new BN(`${stakedAmount}`).toString(10);
      // const stakingAmountInEth = new BN(`${user_balance}`).toString(10);
      const resultVote = await ContractPresalePublicWithMetamask.vote({
        contractAddress: address,
        stakingAmount,
        userAddress,
        date,
        signature,
        yes,
        totalStakedAmount,
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
  const handleGetIn = () => {
    history.push(`/pool/${address}`);
  };

  /* const register = async () => {
     try {
       // login to backend
       let tokenAmount;
       let date;
       let tier;
       let signature;
       let stakedAmount;
       const resultGetMetamaskMessage = await Backend.getMetamaskMessage();
       console.log('TableRow resultGetMetamaskMessage:', resultGetMetamaskMessage);
       if (resultGetMetamaskMessage.data) {
         const msg = resultGetMetamaskMessage.data;
         const signedMsg = await web3.signMessage({ userAddress, message: msg });
         console.log('TableRow signedMsg:', signedMsg);
         if (signedMsg) {
           const resultMetamaskLogin = await Backend.metamaskLogin({
             address: userAddress,
             msg,
             signedMsg,
           });
           console.log('TableRow resultMetamaskLogin:', resultMetamaskLogin);
           if (!resultMetamaskLogin.data) return;
           const { key: token } = resultMetamaskLogin.data;
           const resultGetWhitelistSignature = await Backend.getWhitelistSignature({
             token,
             pool: address,
           });
           console.log('TableRow resultGetWhitelistSignature:', resultGetWhitelistSignature);
           if (!resultGetWhitelistSignature.data) return;
           tokenAmount = resultGetWhitelistSignature.data.user_balance;
           signature = resultGetWhitelistSignature.data.signature;
           stakedAmount = resultGetWhitelistSignature.data.stakedAmount;
           const resultGetTierSignature = await Backend.getTierSignature({
             token,
             presale: address,
           });
           console.log('TableRow resultGetTierSignature:', resultGetTierSignature);
           if (!resultGetTierSignature.data) return;
           date = resultGetTierSignature.data.date;
           tier = resultGetTierSignature.data.type_tier;
           const resultRegister = await ContractPresalePublic.register({
             userAddress,
             tokenAmount,
             signature,
             tier,
             timestamp: date,
           });
           //
           console.log('TableRow resultRegister:', resultRegister);
         }
       }
     } catch (e) {
       console.error('TableRow register:', e);
     }
   };

   const handleRegister = async () => {
     try {
       await register();
     } catch (e) {
       console.error('TableRow handleRegister:', e);
     }
   }; */

  useEffect(() => {
    if (!address) return;
    if (!ContractPresalePublic) return;
    getInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ContractPresalePublic, address]);

  useEffect(() => {
    if (!ContractLessLibrary) return;
    getVotingTime();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ContractLessLibrary]);

  // console.log('TableRow:', address, info);

  if (!address) return null; // todo
  if (!info) return null; // todo

  const {
    hardCap,
    softCap,
    saleTitle,
    listingPrice,
    linkLogo,
    yesVotes = 1,
    noVotes = 0,
    openVotingTime = 0, // todo: remove 0
  } = info;

  const yesVotesPercent = yesVotes ? ((yesVotes / (yesVotes + noVotes)) * 100).toFixed(2) : 0;
  const noVotesPercent = noVotes === 0 ? 0 : 100 - +yesVotesPercent;
  const isYesVotesMore = yesVotes > noVotes;
  const isVotingEnded = Date.now() > openVotingTime + votingTime; // todo: check work

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

      <div className={s.row_cell}>
        {isVotingEnded && isYesVotesMore && (
          <div className={s.button_border}>
            <div
              className={`${s.button} ${index % 2 === 1 && s.buttonDarkBg}`}
              role="button"
              tabIndex={0}
              onClick={handleGetIn}
              onKeyDown={() => {}}
            >
              <div className="gradient-button-text">Get in presale</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface ITableProps {
  data: string[];
}

const Table: React.FC<ITableProps> = (props) => {
  const { data } = props;

  const { chainType } = useSelector(({ wallet }: any) => wallet);

  const [page, setPage] = useState<number>(0);
  const [dataFiltered, setDataFiltrered] = useState<any[]>(data);

  const itemsOnPage = 12;
  let countOfPages = +(data.length / itemsOnPage).toFixed();
  const moduloOfPages = data.length % itemsOnPage;
  if (moduloOfPages > 0 && data.length > itemsOnPage) countOfPages += 1;

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
