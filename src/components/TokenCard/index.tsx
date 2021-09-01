import React, { memo, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import bnbLogo from '../../assets/img/icons/bnb-logo.svg';
import ethLogo from '../../assets/img/icons/eth-logo.svg';
import maticLogo from '../../assets/img/icons/matic-logo.svg';
import projectLogo from '../../assets/img/sections/token-card/logo-1.png';
import config from '../../config';
import { useContractsContext } from '../../contexts/ContractsContext';
import { addHttps } from '../../utils/prettifiers';

import s from './TokenCard.module.scss';

dayjs.extend(relativeTime);

const defaultInfo = {
  // #additional info
  tokenSymbol: '...',
  // #general info
  creator: '...',
  token: '...',
  tokenPrice: '0',
  softCap: '0',
  hardCap: '0',
  tokensForSaleLeft: '0',
  tokensForLiquidityLeft: '0',
  openTimePresale: '0',
  closeTimePresale: '0',
  openTimeVoting: '0',
  closeTimeVoting: '0',
  collectedFee: '0',
  // #string info
  saleTitle: '...',
  linkTelegram: '...',
  linkGithub: '...',
  linkTwitter: '...',
  linkWebsite: '...',
  linkLogo: '...',
  description: '...',
  whitepaper: '...',
  // #uniswap info
  listingPrice: '0',
  lpTokensLockDurationInDays: '0',
  liquidityPercentageAllocation: '0',
  liquidityAllocationTime: '0',
  // #additional
  approved: false,
  beginingAmount: '0',
  cancelled: false,
  liquidityAdded: '0',
  participants: '',
  raisedAmount: '0',
  yesVotes: '0',
  noVotes: '0',
  lastTotalStakedAmount: '0',
};

export interface ITokenCardProps {
  address: string;
  isCertified: boolean;
  statusChoosenInFilter?: string;
}

const chainsInfo: any = [
  { key: 'Ethereum', title: 'Ethereum', symbol: 'ETH', logo: ethLogo },
  { key: 'Binance-Smart-Chain', title: 'Binance Smart Chain', symbol: 'BNB', logo: bnbLogo },
  { key: 'Matic', title: 'Polygon (Matic)', symbol: 'MATIC', logo: maticLogo },
];

const { IS_MAINNET_OR_TESTNET, NOW, CERTIFIED_PRESALE_CURRENCIES } = config;

const TokenCard: React.FC<ITokenCardProps> = (props: ITokenCardProps) => {
  const { address, isCertified, statusChoosenInFilter } = props;
  const {
    ContractPresalePublic,
    ContractPresaleCertified,
    ContractPresalePublicWithMetamask,
    ContractPresaleCertifiedWithMetamask,
  } = useContractsContext();

  const [info, setInfo] = useState<any>(defaultInfo);
  const [logo, setLogo] = useState<string>('');
  const [chainInfo, setChainInfo] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [whitelist, setWhitelist] = useState<string[]>([]);

  const { chainType } = useSelector(({ wallet }: any) => wallet);
  const { address: userAddress } = useSelector(({ user }: any) => user);
  const { owner } = useSelector(({ library }: any) => library);

  const {
    // #additional info
    tokenSymbol,
    // #general info
    creator,
    // token,
    // tokenPrice,
    // softCap,
    // hardCap,
    // tokensForSaleLeft,
    // tokensForLiquidityLeft,
    openTimePresale,
    closeTimePresale,
    openTimeVoting,
    closeTimeVoting,
    // collectedFee,
    // #string info
    saleTitle,
    linkTelegram,
    // linkGithub,
    // linkTwitter,
    linkWebsite,
    linkLogo,
    // description,
    whitepaper,
    // ### uniswap info
    listingPrice,
    // lpTokensLockDurationInDays,
    liquidityPercentageAllocation,
    // liquidityAllocationTime,
    // unlockTime,
    // ### certifiedAddition
    // liquidity,
    // automatically,
    // vesting,
    nativeToken,
    privatePresale,
  } = info;

  const presaleType = isCertified ? 'Certified' : 'Public';

  let presaleStatus = '';
  if (isCertified) {
    if (openTimePresale > NOW) presaleStatus = 'Not opened';
    if (openTimePresale < NOW) presaleStatus = 'Opened';
    if (closeTimePresale < NOW) presaleStatus = 'Closed';
  } else {
    if (openTimePresale > NOW) presaleStatus = 'Not opened';
    if (openTimePresale < NOW) presaleStatus = 'Opened';
    if (openTimeVoting < NOW) presaleStatus = 'In voting';
    if (closeTimeVoting < NOW) presaleStatus = 'Voting ended';
    if (closeTimePresale < NOW) presaleStatus = 'Ended';
  }
  const isOpened = openTimePresale < NOW;
  const isWhitelist = privatePresale;
  const isUserInWhitelist =
    whitelist && whitelist.length && userAddress && whitelist.includes(userAddress.toLowerCase());
  const isUserCreator = userAddress ? creator.toLowerCase() === userAddress.toLowerCase() : false;
  const isUserOwner = userAddress ? owner.toLowerCase() === userAddress.toLowerCase() : false;

  const getImage = useCallback(async () => {
    try {
      const checkImage = (path: string) =>
        new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve(linkLogo);
          img.onerror = () => resolve(projectLogo);
          img.src = path;
        });
      const src: any = await checkImage(linkLogo);
      setLogo(src);
      return;
    } catch (e) {
      console.error('Pool getImage:', e);
      setLogo(projectLogo);
    }
  }, [linkLogo]);

  const getChainInfo = useCallback(() => {
    let chainInfoNew = chainsInfo.find((item: any) => item.key === chainType);
    if (isCertified && nativeToken) {
      const symbols = CERTIFIED_PRESALE_CURRENCIES[IS_MAINNET_OR_TESTNET][chainType] || {};
      const newSymbol = Object.keys(symbols).find((key) => {
        return symbols[key].address === nativeToken.toLowerCase();
      });
      chainInfoNew = {
        ...chainInfoNew,
        symbol: newSymbol,
      };
    }

    setChainInfo(chainInfoNew);
  }, [isCertified, chainType, nativeToken]);

  const getInfo = useCallback(async () => {
    try {
      if (!address) return;
      if (!chainType) return;
      if (!ContractPresalePublic) return;
      if (!ContractPresaleCertified) return;
      let newInfo;
      if (userAddress) {
        if (isCertified) {
          newInfo = await ContractPresaleCertifiedWithMetamask.getInfo({
            contractAddress: address,
          });
          console.log('TokenCard getInfo certified:', newInfo);
        } else {
          newInfo = await ContractPresalePublicWithMetamask.getInfo({ contractAddress: address });
          console.log('TokenCard getInfo public:', newInfo);
        }
      } else if (isCertified) {
        newInfo = await ContractPresaleCertified.getInfo({ contractAddress: address });
        console.log('TokenCard getInfo certified:', newInfo);
      } else {
        newInfo = await ContractPresalePublic.getInfo({ contractAddress: address });
        console.log('TokenCard getInfo public:', newInfo);
      }
      if (newInfo) setInfo(newInfo);
      setLoading(false);
    } catch (e) {
      console.error('TokenCard getInfo:', e);
    }
  }, [
    ContractPresaleCertified,
    ContractPresalePublic,
    ContractPresaleCertifiedWithMetamask,
    ContractPresalePublicWithMetamask,
    address,
    userAddress,
    isCertified,
    chainType,
  ]);

  const getWhitelist = useCallback(async () => {
    try {
      const resultWhitelist = await ContractPresaleCertified.getWhitelistFull({
        contractAddress: address,
      });
      setWhitelist(resultWhitelist);
      // console.log('Pool getWhitelist:', resultWhitelist);
      return;
    } catch (e) {
      console.error('Pool getWhitelist:', e);
    }
  }, [ContractPresaleCertified, address]);

  useEffect(() => {
    if (!info) return;
    getImage();
  }, [info, getImage]);

  useEffect(() => {
    if (!info) return;
    if (!ContractPresaleCertified) return;
    getWhitelist();
  }, [info, ContractPresaleCertified, getWhitelist]);

  useEffect(() => {
    if (!chainType) return;
    getChainInfo();
  }, [chainType, getChainInfo]);

  useEffect(() => {
    if (!address) return;
    if (!chainType) return;
    if (!ContractPresalePublic) return;
    if (!ContractPresaleCertified) return;
    if (userAddress && !ContractPresalePublicWithMetamask) return;
    if (userAddress && !ContractPresaleCertifiedWithMetamask) return;
    getInfo();
  }, [
    ContractPresalePublic,
    ContractPresaleCertified,
    ContractPresaleCertifiedWithMetamask,
    ContractPresalePublicWithMetamask,
    getInfo,
    address,
    userAddress,
    chainType,
  ]);

  if (
    statusChoosenInFilter &&
    statusChoosenInFilter !== 'All' &&
    statusChoosenInFilter !== presaleStatus
  )
    return null;

  if (isCertified && !isUserCreator && !isUserOwner && isWhitelist && !userAddress) return null;
  if (isCertified && !isUserCreator && !isUserOwner && isWhitelist && !isUserInWhitelist)
    return null;
  if (loading) return <div className={s.cardLoading}>Loading...</div>;

  return (
    <div className={s.card}>
      <Link to={`/pool/${address}`} className={s.card_header}>
        <div className={s.card_header__logo}>
          <img src={logo || projectLogo} alt="token-logo" />
        </div>
        <div className={s.card_header__info}>
          <div className={s.card_header__info_days}>
            {isOpened ? 'opened' : 'opens'} {dayjs(openTimePresale).fromNow()}
          </div>
          <div className={s.card_header__info_name}>{saleTitle}</div>
        </div>
      </Link>
      <div className={s.card_links}>
        <a
          href={addHttps(linkWebsite)}
          target="_blank"
          rel="noreferrer"
          className={s.card_links__link}
        >
          <span>Website</span>
        </a>
        <a
          href={addHttps(linkTelegram)}
          target="_blank"
          rel="noreferrer"
          className={s.card_links__link}
        >
          <span>Telegram</span>
        </a>
        <a
          href={addHttps(whitepaper)}
          target="_blank"
          rel="noreferrer"
          className={s.card_links__link}
        >
          <span>White Paper</span>
        </a>
      </div>
      <div className={s.card_body}>
        <div className={s.card_body__logo}>
          <img src={chainInfo.logo} alt="blockchainLogo" />
        </div>
        <div className={s.card_body__info}>
          <div className={s.card_body__info_item}>
            <div className={s.card_body__info_item__title}>Chain</div>
            <div className={s.card_body__info_item__value}>{chainInfo.title} Network</div>
          </div>
          <div className={s.card_body__info_item}>
            <div className={s.card_body__info_item__title}>Type</div>
            <div className={s.card_body__info_item__value}>{presaleType}</div>
          </div>
          <div className={s.card_body__info_item}>
            <div className={s.card_body__info_item__title}>Funding token</div>
            <div className={s.card_body__info_item__value}>{chainInfo.symbol}</div>
          </div>
          <div className={s.card_body__info_item}>
            <div className={s.card_body__info_item__title}>Status</div>
            <div className={s.card_body__info_item__value}>{presaleStatus}</div>
          </div>
        </div>
      </div>
      <div className={s.card_footer__wrap}>
        <div className={s.card_footer}>
          <div className={s.card_footer__top}>
            <div className={s.card_footer__top_liquidity}>Liquidity Allocation</div>
            <div className={s.card_footer_gradient}>
              <span>{liquidityPercentageAllocation} %</span>
            </div>
          </div>
          <div className={s.card_footer_gradient}>
            <span>
              1 {tokenSymbol} = {listingPrice} {chainInfo.symbol}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(TokenCard);
