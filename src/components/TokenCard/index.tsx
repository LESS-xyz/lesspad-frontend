import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import bnbLogo from '../../assets/img/icons/bnb-logo.svg';
import ethLogo from '../../assets/img/icons/eth-logo.svg';
import maticLogo from '../../assets/img/icons/matic-logo.svg';
import { useContractsContext } from '../../contexts/ContractsContext';
import { addHttps } from '../../utils/prettifiers';

import s from './TokenCard.module.scss';

dayjs.extend(relativeTime);

export interface ITokenCardProps {
  address: string;
  logo: string;
  daysTillOpen: number;
  name: string;
  subtitle: string;
  website: string;
  telegram: string;
  whitePaper: string;
  blockchainLogo: string;
  chain: string;
  type: 'public' | 'certified';
  fundingToken: string;
  status: 'ended' | 'in voting' | 'not opened' | 'all';
  isCertified: boolean;
  statusChoosenInFilter?: string;
}

const chainsInfo: any = [
  { key: 'Ethereum', title: 'Ethereum', symbol: 'ETH', logo: ethLogo },
  { key: 'Binance-Smart-Chain', title: 'Binance Smart Chain', symbol: 'BNB', logo: bnbLogo },
  { key: 'Matic', title: 'Polygon (Matic)', symbol: 'MATIC', logo: maticLogo },
];

const TokenCard: React.FC<ITokenCardProps> = (props: ITokenCardProps) => {
  const {
    address,
    logo,
    // daysTillOpen,
    // name,
    // subtitle,
    // website,
    // telegram,
    // whitePaper,
    // blockchainLogo,
    // chain,
    // type,
    // fundingToken,
    // status,
    isCertified,
    statusChoosenInFilter,
  } = props;
  const { ContractPresalePublic, ContractPresaleCertified } = useContractsContext();

  const [info, setInfo] = useState<any>();
  const [chainInfo, setChainInfo] = useState<any>();

  const { chainType } = useSelector(({ wallet }: any) => wallet);

  const getChainInfo = useCallback(() => {
    const chainInfoNew = chainsInfo.filter((item: any) => item.key === chainType);
    setChainInfo(chainInfoNew[0]);
  }, [chainType]);

  const getInfo = useCallback(async () => {
    try {
      let newInfo;
      if (isCertified) {
        newInfo = await ContractPresaleCertified.getInfo({ contractAddress: address });
        console.log('TokenCard getInfo certified:', newInfo);
      } else {
        newInfo = await ContractPresalePublic.getInfo({ contractAddress: address });
        console.log('TokenCard getInfo public:', newInfo);
      }
      if (newInfo) setInfo(newInfo);
    } catch (e) {
      console.error('TokenCard getInfo:', e);
    }
  }, [ContractPresaleCertified, ContractPresalePublic, address, isCertified]);

  useEffect(() => {
    if (!chainType) return;
    getChainInfo();
  }, [chainType, getChainInfo]);

  useEffect(() => {
    if (!address) return;
    if (!chainType) return;
    if (!ContractPresalePublic) return;
    if (!ContractPresaleCertified) return;
    getInfo();
  }, [ContractPresalePublic, ContractPresaleCertified, getInfo, address, chainType]);

  if (!address) return null; // todo: show loader
  if (!info) return null; // todo: show loader

  const {
    // #additional info
    tokenSymbol,
    // #general info
    // creator,
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
    // #uniswap info
    listingPrice,
    // lpTokensLockDurationInDays,
    liquidityPercentageAllocation,
    // liquidityAllocationTime,
    // unlockTime,
  } = info;

  const presaleType = isCertified ? 'Certified' : 'Public';

  const now = Date.now();
  let presaleStatus = '';
  if (isCertified) {
    if (openTimePresale > now) presaleStatus = 'Not opened';
    if (openTimePresale < now) presaleStatus = 'Opened';
    if (closeTimePresale < now) presaleStatus = 'Closed';
  } else {
    if (openTimePresale > now) presaleStatus = 'Not opened';
    if (openTimePresale < now) presaleStatus = 'Opened';
    if (openTimeVoting < now) presaleStatus = 'In voting';
    if (closeTimeVoting < now) presaleStatus = 'Voting ended';
    if (closeTimePresale < now) presaleStatus = 'Ended';
  }
  const isOpened = openTimePresale < now;

  if (
    statusChoosenInFilter &&
    statusChoosenInFilter !== 'All' &&
    statusChoosenInFilter !== presaleStatus
  )
    return null;
  return (
    <div className={s.card}>
      <Link to={`/pool/${address}`} className={s.card_header}>
        <div className={s.card_header__logo}>
          <img src={linkLogo ? addHttps(linkLogo) : logo} alt="token-logo" />
        </div>
        <div className={s.card_header__info}>
          {/*<div className={s.card_header__info_days}>*/}
          {/*  opens in {daysTillOpen} {daysTillOpen > 1 ? 'days' : 'day'}*/}
          {/*</div>*/}
          <div className={s.card_header__info_days}>
            {isOpened ? 'opened' : 'opens'} {dayjs(openTimePresale).fromNow()}
          </div>
          <div className={s.card_header__info_name}>{saleTitle}</div>
          {/*<div className={s.card_header__info_subtitle}>{subtitle}</div>*/}
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
            <div className={s.card_body__info_item__value}>{chainInfo.symbol} Network</div>
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

export default TokenCard;
