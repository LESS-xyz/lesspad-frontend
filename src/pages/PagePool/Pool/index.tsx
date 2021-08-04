import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { BigNumber as BN } from 'bignumber.js/bignumber';
import dayjs from 'dayjs';

import bnbLogo from '../../../assets/img/icons/bnb-logo.svg';
import ethLogo from '../../../assets/img/icons/eth-logo.svg';
import Github from '../../../assets/img/icons/gh-icon.svg';
import Link from '../../../assets/img/icons/link-icon.svg';
import maticLogo from '../../../assets/img/icons/matic-logo.svg';
import Subscribe from '../../../assets/img/icons/subscribe.svg';
import Telegram from '../../../assets/img/icons/tg-icon.svg';
import Twitter from '../../../assets/img/icons/twitter-icon.svg';
import Input from '../../../components/Input';
import YourTier from '../../../components/YourTier/index';
import config from '../../../config';
import { useContractsContext } from '../../../contexts/ContractsContext';
import { useWeb3ConnectorContext } from '../../../contexts/Web3Connector';
import { modalActions } from '../../../redux/actions';
import { BackendService } from '../../../services/Backend';
import { addHttps } from '../../../utils/prettifiers';
import ParticipantsTable from '../ParticipantsTable';

import './index.scss';

const { chainSymbols, explorers }: any = config;
const Backend = new BackendService();

const chainsInfo: any = [
  { key: 'Ethereum', title: 'Ethereum', symbol: 'ETH', logo: ethLogo },
  { key: 'Binance-Smart-Chain', title: 'Binance Smart Chain', symbol: 'BNB', logo: bnbLogo },
  { key: 'Matic', title: 'Polygon (Matic)', symbol: 'MATIC', logo: maticLogo },
];

const Pool: React.FC = () => {
  const { address }: any = useParams();

  const { web3 } = useWeb3ConnectorContext();
  const {
    ContractERC20,
    ContractPresalePublicWithMetamask,
    ContractPresalePublic,
    ContractPresaleCertified,
    ContractLessToken,
  } = useContractsContext();

  const [info, setInfo] = useState<any>();
  const [isCertified, setIsCertified] = useState<boolean>();
  const [chainInfo, setChainInfo] = useState<any>();

  // const [lessDecimals, setLessDecimals] = useState<number>();
  // const [lpDecimals, setLpDecimals] = useState<number>();
  const [tokenDecimals, setTokenDecimals] = useState<number>(0);

  const [investments, setInvestments] = useState<any>({ amountEth: 0, amountTokens: 0 });
  const [amountToInvest, setAmountToInvest] = useState<string>('');

  const { pools } = useSelector(({ pool }: any) => pool);
  const { chainType } = useSelector(({ wallet }: any) => wallet);
  const { address: userAddress } = useSelector(({ user }: any) => user);

  const dispatch = useDispatch();
  const toggleModal = React.useCallback((params) => dispatch(modalActions.toggleModal(params)), [
    dispatch,
  ]);

  const { amountEth, amountTokens } = investments;

  // const getDecimals = async () => {
  //   try {
  //     // const resultLessDecimals = await ContractLessToken.decimals();
  //     // setLessDecimals(resultLessDecimals);
  //     // const resultLpDecimals = await ContractLPToken.decimals();
  //     // setLpDecimals(resultLpDecimals);
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };

  const getTokenDecimals = async () => {
    try {
      const { token } = info;
      const resultTokenDecimals = await ContractERC20.decimals({ contractAddress: token });
      setTokenDecimals(resultTokenDecimals);
    } catch (e) {
      console.error(e);
    }
  };

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
        console.log('PagePool getInfo certified:', newInfo);
      } else {
        newInfo = await ContractPresalePublic.getInfo({ contractAddress: address });
        console.log('PagePool getInfo public:', newInfo);
      }
      if (newInfo) setInfo(newInfo);
    } catch (e) {
      console.error('PagePool getInfo:', e);
    }
  };

  const getInvestments = async () => {
    try {
      const resultInvestments = await ContractPresaleCertified.investments({
        contractAddress: address,
        userAddress,
        tokenDecimals,
      });
      console.log('PagePool getRefund certified:', resultInvestments);
      if (resultInvestments) setInvestments(resultInvestments);
    } catch (e) {
      console.error('PagePool getRefund:', e);
    }
  };

  const loginToBackend = async () => {
    try {
      const resultGetMetamaskMessage = await Backend.getMetamaskMessage();
      console.log('PagePool loginToBackend resultGetMetamaskMessage:', resultGetMetamaskMessage);
      if (!resultGetMetamaskMessage.data) throw new Error('getMetamaskMessage unsuccesful');
      const msg = resultGetMetamaskMessage.data;
      const signedMsg = await web3.signMessage({ userAddress, message: msg });
      console.log('PagePool loginToBackend signedMsg:', signedMsg);
      if (!signedMsg) throw new Error('signMessage unsuccesful');
      const resultMetamaskLogin = await Backend.metamaskLogin({
        address: userAddress,
        msg,
        signedMsg,
      });
      console.log('PagePool loginToBackend resultMetamaskLogin:', resultMetamaskLogin);
      if (!resultMetamaskLogin.data) throw new Error('metamaskLogin unsuccesful');
      const { key } = resultMetamaskLogin.data;
      return { success: true, data: { key } };
    } catch (e) {
      console.error('PagePool vote:', e);
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
      console.log('PagePool vote resultGetPoolSignature:', resultGetPoolSignature);
      if (!resultGetPoolSignature.data) throw new Error('Cannot get pool signature');
      const { timestamp, signature, user_balance } = resultGetPoolSignature.data;
      const stakingAmountInEth = new BN(`${user_balance}`).toString(10);
      const resultVote = await ContractPresalePublicWithMetamask.vote({
        contractAddress: address,
        stakingAmount: stakingAmountInEth,
        userAddress,
        timestamp,
        signature,
        yes,
      });
      console.log('PagePool vote:', resultVote);
    } catch (e) {
      console.error('PagePool vote:', e);
    }
  };

  // todo: сделать для сертифицированного
  const invest = async (amount: string) => {
    try {
      const resultLoginToBackend = await loginToBackend();
      if (!resultLoginToBackend.success) throw new Error('Not logged to backend');
      const { key }: any = resultLoginToBackend.data;
      const resultGetPoolSignature = await Backend.getInvestSignature({
        token: key,
        pool: address,
      });
      console.log('PagePool vote resultGetPoolSignature:', resultGetPoolSignature);
      if (!resultGetPoolSignature.data) throw new Error('Cannot get invest signature');
      const {
        timestamp,
        signature,
        totalStakedAmount,
        poolPercentages,
        stakingTiers,
      } = resultGetPoolSignature.data;
      const tokenAmount = new BN(amount)
        .multipliedBy(new BN(10).pow(new BN(tokenDecimals)))
        .toString(10);
      const stakedAmount = new BN(`${totalStakedAmount}`).toString(10);
      const resultVote = await ContractPresalePublicWithMetamask.invest({
        userAddress,
        contractAddress: address,
        tokenAmount,
        signature,
        stakedAmount,
        timestamp,
        poolPercentages,
        stakingTiers,
      });
      console.log('PagePool vote:', resultVote);
    } catch (e) {
      console.error('PagePool vote:', e);
    }
  };

  const getRefund = async () => {
    try {
      let newInfo;
      if (isCertified) {
        newInfo = await ContractPresaleCertified.collectFundsRaised({
          contractAddress: address,
          userAddress,
        });
        console.log('PagePool getRefund certified:', newInfo);
      } else {
        newInfo = await ContractPresalePublic.collectFundsRaised({
          contractAddress: address,
          userAddress,
        });
        console.log('PagePool getRefund public:', newInfo);
      }
      if (newInfo) setInfo(newInfo);
    } catch (e) {
      console.error('PagePool getRefund:', e);
    }
  };

  const handleVote = async (yes: boolean) => {
    try {
      await vote(yes);
    } catch (e) {
      console.error('PagePool handleVote:', e);
    }
  };

  const handleInvest = async () => {
    try {
      toggleModal({
        open: true,
        text: (
          <div className="messageContainer">
            <p>Please, enter amount to invest (in ether)</p>
            <Input title="" value={amountToInvest} onChange={setAmountToInvest} />
            <div className="button-border" style={{ margin: '5px 0' }}>
              <div
                className="button"
                role="button"
                tabIndex={0}
                onClick={() => invest(amountToInvest)}
                onKeyDown={() => {}}
              >
                <div className="gradient-button-text">Submit</div>
              </div>
            </div>
          </div>
        ),
      });
    } catch (e) {
      console.error('PagePool handleInvest:', e);
    }
  };

  useEffect(() => {
    if (!info) return;
    if (!userAddress) return;
    if (!ContractLessToken) return;
    if (!ContractERC20) return;
    // getDecimals();
    getTokenDecimals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ContractLessToken, userAddress, info]);

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
    getInvestments();
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
    tokensForSaleLeft,
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
    linkLogo,
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
    beginingAmount,
    // cancelled,
    // liquidityAdded,
    participants,
    raisedAmount,
  } = info;
  console.log('Pool info:', info);

  const now = Date.now();
  const isOpened = openTimePresale < now;

  const isEthereum = chainType === 'Ethereum';
  const isBinanceSmartChain = chainType === 'Binance-Smart-Chain';

  const exchange = isEthereum ? 'Uniswap' : isBinanceSmartChain ? 'PancakeSwap' : 'SushiSwap';

  const tokensSoldInNativeCurrency = (beginingAmount - tokensForSaleLeft) * tokenPrice;
  const hardCapInNativeCurrency = hardCap * tokenPrice;
  const percentOfTokensSold = ((beginingAmount - tokensForSaleLeft) / beginingAmount) * 100;
  const percentOfSoftCap = (softCap / hardCap) * 100;

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
            <img src={addHttps(linkLogo)} alt="token-logo" />
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
            <div
              className="grow-scale-progress-value"
              style={{ width: `${percentOfTokensSold}%` }}
            />
          </div>
        </div>

        <div className="grow-info">
          <div className="grow-min">
            {percentOfTokensSold}% (Min {percentOfSoftCap}%)
          </div>
          <div className="grow-max">
            {tokensSoldInNativeCurrency} / {hardCapInNativeCurrency} {currency}
          </div>
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
          {!isCertified && (
            <div className="item">
              VOTE
              <div className="item-text">
                <div className="item-text-bold">0.000</div>
                <div className="item-text-gradient">LESS</div>
              </div>
              {/*<div className="item-count">$0.0 USD</div>*/}
              <div className="button-border" style={{ marginBottom: 5 }}>
                <div
                  className="button"
                  role="button"
                  tabIndex={0}
                  onClick={() => handleVote(true)}
                  onKeyDown={() => {}}
                >
                  <div className="gradient-button-text">Vote Yes</div>
                </div>
              </div>
              <div className="button-border" style={{ marginTop: 5 }}>
                <div
                  className="button"
                  role="button"
                  tabIndex={0}
                  onClick={() => handleVote(false)}
                  onKeyDown={() => {}}
                >
                  <div className="gradient-button-text">Vote No</div>
                </div>
              </div>
            </div>
          )}
          <div className="item">
            Your Tokens
            <div className="item-text">
              <div className="item-text-bold">{amountTokens}</div>
              <div className="item-text-gradient">{tokenSymbol}</div>
            </div>
            {/*<div className="item-count">$13,780,000 USD</div>*/}
            <div className="button-border">
              <div
                className="button"
                role="button"
                tabIndex={0}
                onClick={() => {}}
                onKeyDown={() => {}}
              >
                <div className="gradient-button-text">Claim Token</div>
              </div>
            </div>
          </div>
          <div className="item">
            Your {currency} Investment
            <div className="item-text">
              <div className="item-text-bold">
                {amountEth} {currency}
              </div>
            </div>
            {/*<div className="item-count">$0.0 USD</div>*/}
            <div className="button-border">
              <div
                className="button"
                role="button"
                tabIndex={0}
                onClick={getRefund}
                onKeyDown={() => {}}
              >
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
              <div
                className="button"
                role="button"
                tabIndex={0}
                onClick={handleInvest}
                onKeyDown={() => {}}
              >
                <div className="gradient-button-text">Invest</div>
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
