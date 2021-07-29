import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';

import bnbLogo from '../../../assets/img/icons/bnb-logo.svg';
import ethLogo from '../../../assets/img/icons/eth-logo.svg';
import Github from '../../../assets/img/icons/gh-icon.svg';
import Link from '../../../assets/img/icons/link-icon.svg';
import maticLogo from '../../../assets/img/icons/matic-logo.svg';
import Logo from '../../../assets/img/icons/project-logo.svg';
import Subscribe from '../../../assets/img/icons/subscribe.svg';
import Telegram from '../../../assets/img/icons/tg-icon.svg';
import Twitter from '../../../assets/img/icons/twitter-icon.svg';
import YourTier from '../../../components/YourTier/index';
import config from '../../../config';
import { useContractsContext } from '../../../contexts/ContractsContext';
import { addHttps } from '../../../utils/prettifiers';
import ParticipantsTable from '../ParticipantsTable';

import './index.scss';

const { chainSymbols, explorers }: any = config;

const chainsInfo: any = [
  { key: 'Ethereum', title: 'Ethereum', symbol: 'ETH', logo: ethLogo },
  { key: 'Binance-Smart-Chain', title: 'Binance Smart Chain', symbol: 'BNB', logo: bnbLogo },
  { key: 'Matic', title: 'Polygon (Matic)', symbol: 'MATIC', logo: maticLogo },
];

const Pool: React.FC = () => {
  const { address }: any = useParams();

  const { ContractPresalePublic, ContractPresaleCertified } = useContractsContext();

  const [info, setInfo] = useState<any>();
  const [isCertified, setIsCertified] = useState<boolean>();
  const [chainInfo, setChainInfo] = useState<any>();

  const { pools } = useSelector(({ pool }: any) => pool);
  const { chainType } = useSelector(({ wallet }: any) => wallet);

  const getIsCertified = (presaleAddress: string) => {
    try {
      const isCertifiedNew = pools?.filter((item: any) => item.address === presaleAddress)[0]
        .isCertified;
      setIsCertified(isCertifiedNew);
    } catch (e) {
      console.error(e);
    }
  };

  const getChainInfo = () => {
    const chainInfoNew = chainsInfo.filter((item: any) => item.key === chainType);
    setChainInfo(chainInfoNew[0]);
  };

  const getInfo = async () => {
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
  };

  useEffect(() => {
    if (!chainType) return;
    getChainInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainType]);

  useEffect(() => {
    if (!pools || !pools.length) return;
    getIsCertified(address);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pools]);

  useEffect(() => {
    if (!ContractPresalePublic) return;
    if (!ContractPresaleCertified) return;
    if (isCertified === undefined) return;
    getInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ContractPresalePublic, ContractPresaleCertified, isCertified]);

  if (!address) return null; // todo: show loader
  if (!info) return null; // todo: show loader

  const {
    // #additional info
    tokenSymbol,
    // #general info
    // creator,
    token,
    tokenPrice,
    softCap,
    hardCap,
    // tokensForSaleLeft,
    // tokensForLiquidityLeft,
    openTimePresale,
    closeTimePresale,
    // openTimeVoting,
    // closeTimeVoting,
    // collectedFee,
    // #string info
    saleTitle,
    linkTelegram,
    linkGithub,
    linkTwitter,
    linkWebsite,
    // linkLogo,
    description,
    // whitepaper,
    // #uniswap info
    listingPrice,
    lpTokensLockDurationInDays,
    liquidityPercentageAllocation,
    liquidityAllocationTime,
    // unlockTime,
    // todo: native token
    approved,
    // beginingAmount,
    // cancelled,
    // liquidityAdded,
    participants,
    raisedAmount,
  } = info;
  console.log('Pool info:', info);

  const now = Date.now();
  // let presaleStatus = '';
  // if (isCertified) {
  //   if (openTimePresale > now) presaleStatus = 'Not opened';
  //   if (openTimePresale < now) presaleStatus = 'Opened';
  //   if (closeTimePresale < now) presaleStatus = 'Closed';
  // } else {
  //   if (openTimePresale > now) presaleStatus = 'Not opened';
  //   if (openTimePresale < now) presaleStatus = 'Opened';
  //   if (openTimeVoting < now) presaleStatus = 'In voting';
  //   if (closeTimeVoting < now) presaleStatus = 'Voting ended';
  //   if (closeTimePresale < now) presaleStatus = 'Ended';
  // }
  const isOpened = openTimePresale < now;

  const isEthereum = chainType === 'Ethereum';
  const isBinanceSmartChain = chainType === 'Binance-Smart-Chain';
  // const isMatic = chainType === 'Matic';

  const exchange = isEthereum ? 'Uniswap' : isBinanceSmartChain ? 'PancakeSwap' : 'SushiSwap';

  ////////////////////////////////////

  const currency = chainSymbols[chainType];
  const explorer = explorers[chainType];

  const row1 = [
    {
      header: 'Softcap',
      value: `${softCap} ${currency}`,
      gradient: true,
      less: false,
      last: false,
    },
    {
      header: 'Presale Rate',
      value: `${tokenPrice} ${currency}`,
      gradient: false,
      less: false,
      last: false,
    },
    {
      header: 'Liquidity Allocation',
      value: `${liquidityPercentageAllocation}%`,
      gradient: false,
      less: false,
      last: false,
    },
    {
      header: 'Open Time',
      value: dayjs(openTimePresale).format('MMMM DD, YYYY HH:mm A GMT'),
      gradient: false,
      less: false,
      last: true,
    },
  ];

  const row2 = [
    {
      header: 'Hardcap',
      value: `${hardCap} ${currency}`,
      gradient: true,
      less: false,
      last: false,
    },
    {
      header: `${exchange} Listing Rate`,
      value: `${listingPrice} ${currency}`,
      gradient: false,
      less: false,
      last: false,
    },
    {
      header: 'Liquidity Lock Duration',
      value: `${lpTokensLockDurationInDays} days`,
      gradient: true,
      less: false,
      last: false,
    },
    {
      header: 'Close Time',
      value: dayjs(closeTimePresale).format('MMMM DD, YYYY HH:mm A GMT'),
      gradient: false,
      less: false,
      last: true,
    },
  ];

  const row3 = [
    {
      header: 'Presale Type',
      value: `${isCertified ? 'Certified' : 'Public'} Presale`,
      gradient: false,
      less: false,
      last: false,
    },
    {
      header: isCertified ? '' : 'Yes Votes',
      value: isCertified ? '' : '125556',
      gradient: false,
      less: false,
      last: false,
    },
    {
      header: isCertified ? '' : 'No Votes',
      value: isCertified ? '' : '0',
      gradient: false,
      less: false,
      last: false,
    },
    {
      header: '',
      value: '',
      gradient: false,
      less: false,
      last: true,
    },
  ];

  const links = [
    {
      header: 'Token Contract Address',
      value: token,
      link: `${explorers[chainType]}/token/${token}`,
    },
    // {
    //   header: 'PancakeSwap Address',
    //   value: '0x19314Dfa75CfC1E5154f95daFaB217646bdb79AC',
    // },
    // {
    //   header: 'Locked Liquidity Address',
    //   value: '0x0e7b582003de0E541548cF02a1F00725Df6E6E6f',
    //   link: `${explorers[chainType]}/token/${token}`,
    // },
    // {
    //   header: 'PooCoin Address',
    //   value: '0x19314Dfa75CfC1E5154f95daFaB217646bdb79AC',
    // },
    {
      header: 'Presale Contract Address',
      value: address,
      link: `${explorers[chainType]}/address/${address}`,
    },
  ];

  const linksIcons = [
    { image: Telegram, link: linkTelegram },
    { image: Twitter, link: linkTwitter },
    { image: Link, link: linkWebsite },
    { image: Github, link: linkGithub },
  ];

  return (
    <div className="container">
      <Helmet>
        <meta charSet="utf-8" />
        <title>{saleTitle} | Lesspad</title>
        <meta name="description" content={`Presale Pool. ${saleTitle}. ${description}`} />
      </Helmet>

      <div className="preview">
        <div className="description">
          <div className="logo-center">
            <img className="icon-logo" src={Logo} alt="Logo" />
          </div>
          <div className="description-info">
            <div className="description-info-header">
              <span>{saleTitle}</span>
            </div>
            <div className="description-info-text">{description}</div>
            <div className="subscription">
              <a href={`${explorer}/token/${address}`} className="subscription-text">
                {address}
              </a>
              <img className="icon-subscribe" src={Subscribe} alt="Subscribe" />
            </div>
          </div>
        </div>
        <div className="preview-info">
          <div className="preview-info-days">
            <div className="preview-info-days-text">
              {isOpened ? 'opened' : 'opens'} {dayjs(openTimePresale).fromNow()}
            </div>
          </div>
          <div className="preview-info-date preview-info-date__text-opacity">
            Listing:{' '}
            {liquidityAllocationTime
              ? dayjs(liquidityAllocationTime).format('MMMM DD, YYYY HH:mm A GMT')
              : 'soon'}
          </div>
        </div>
      </div>
      <div className="grow">
        <div className="grow-text preview-info-date__text-opacity">
          {tokenPrice} {currency} per {tokenSymbol}
        </div>
        <div className="grow-progress">
          <div>
            {raisedAmount} {chainInfo.symbol} Raised
          </div>
          <div>{participants} Participants</div>
        </div>
        <div className="grow-scale">
          <div className="grow-scale-progress">
            <div className="grow-scale-progress-value" />
          </div>
        </div>
        <div className="grow-info">
          <div className="grow-min">0.000% (Min 44.931%)</div>
          <div className="grow-max">0.000 / 1164.000 {currency}</div>
        </div>
      </div>

      <div className="box">
        <div className="row row-items">
          {row1.map((item, i) => (
            <div className={`${item.last ? 'item last' : 'item'} ${i % 2 !== 0 && 'cell'}`}>
              {item.header}
              {item.gradient ? (
                <div className="gradient-text">{item.value}</div>
              ) : (
                <div className="item-text">
                  {item.value}
                  {item.less ? <div className="item-text-gradient">LESS</div> : null}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="row row-items">
          {row2.map((item, i) => (
            <div className={`${item.last ? 'item last' : 'item'} ${i % 2 !== 0 && 'cell'}`}>
              {item.header}
              {item.gradient ? (
                <div className="gradient-text">{item.value}</div>
              ) : (
                <div className="item-text">
                  {item.value}
                  {item.less ? <div className="item-text-gradient">LESS</div> : null}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="row row-items last">
          {row3.map((item, i) => (
            <div className={`${item.last ? 'item last' : 'item'} ${i % 2 !== 0 && 'cell'}`}>
              {item.header}
              {item.gradient ? (
                <div className="gradient-text">{item.value}</div>
              ) : (
                <div className="item-text">
                  {item.value}
                  {item.less ? <div className="item-text-gradient">LESS</div> : null}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/*Your Tier*/}
      <YourTier tier="king" className="tier-block" />

      {/*Your Investment*/}
      <div className="container-header">Your Investment</div>
      <div className="box box-bg">
        <div className="row last">
          <div className="item">
            VOTE
            <div className="item-text">
              <div className="item-text-bold">0.000</div>
              <div className="item-text-gradient">LESS</div>
            </div>
            <div className="item-count">$0.0 USD</div>
            <div className="button-border">
              <div className="button">
                <div className="gradient-button-text">Vote</div>
              </div>
            </div>
          </div>
          <div className="item">
            Your Tokens
            <div className="item-text">
              <div className="item-text-bold">1,000,000</div>
              <div className="item-text-gradient">LESS</div>
            </div>
            <div className="item-count">$13,780,000 USD</div>
            <div className="button-border">
              <div className="button">
                <div className="gradient-button-text">Claim Token</div>
              </div>
            </div>
          </div>
          <div className="item">
            Your BNB Investment
            <div className="item-text">
              <div className="item-text-bold">0.0 BNB</div>
            </div>
            <div className="item-count">$0.0 USD</div>
            <div className="button-border">
              <div className="button">
                <div className="gradient-button-text">Get Refund</div>
              </div>
            </div>
          </div>
          <div className="item last">
            Buy Tokens
            <div className="item-text">
              <div className="item-text-bold">
                1 {tokenSymbol} = {tokenPrice} {currency}
              </div>
            </div>
            <div className="button-border">
              <div className="button">
                <div className="gradient-button-text">Get Refund</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*Participants*/}
      <ParticipantsTable />

      {/*Important Links*/}
      <div className="container-header">Important Links</div>
      <div className="box">
        <div className="box-links">
          {links.map((item) => (
            <a href={item.link} className="box-links-link">
              <div className="box-links-link-content">
                <div className="box-links-link-content-header">{item.header}</div>
                <div>{item.value}</div>
              </div>
              <div className="box-links-link-button">
                <img src={Subscribe} alt="Subscribe icon" />
              </div>
            </a>
          ))}
          <div className="box-links-list">
            <div className="box-links-list-header">Connect</div>
            <div className="box-links-list-links">
              {linksIcons.map((item) => (
                <a href={addHttps(item.link)} className="box-links-list-links-item">
                  <img src={item.image} alt={`${item.image} icon`} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container-header">Audit</div>
      <div className="box box-bg">
        <div className="box-text">{approved ? 'Audited' : 'Not audited yet.'}</div>
      </div>
    </div>
  );
};

export default Pool;
