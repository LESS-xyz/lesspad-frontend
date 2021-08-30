import { setInterval } from 'timers';

import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { BigNumber as BN } from 'bignumber.js/bignumber';
import dayjs from 'dayjs';
import { v4 as uuid } from 'uuid';

import Github from '../../../assets/img/icons/gh-icon.svg';
import Link from '../../../assets/img/icons/link-icon.svg';
import RegisterImg from '../../../assets/img/icons/register.svg';
import Subscribe from '../../../assets/img/icons/subscribe.svg';
import Telegram from '../../../assets/img/icons/tg-icon.svg';
import Twitter from '../../../assets/img/icons/twitter-icon.svg';
import projectLogo from '../../../assets/img/sections/token-card/logo-1.png';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import YourTier from '../../../components/YourTier/index';
import config from '../../../config';
import { useContractsContext } from '../../../contexts/ContractsContext';
import { useWeb3ConnectorContext } from '../../../contexts/Web3Connector';
import { modalActions } from '../../../redux/actions';
import { BackendService } from '../../../services/Backend';
import { convertFromWei, convertToWei, useTransactionHash } from '../../../utils/ethereum';
import { addHttps, prettyNumber } from '../../../utils/prettifiers';
import ParticipantsTable from '../ParticipantsTable';

import './index.scss';
import s from '../../PageCreatePool/CreatePool.module.scss';

const {
  CHAIN_SYMBOLS,
  CERTIFIED_PRESALE_CURRENCIES,
  IS_MAINNET_OR_TESTNET,
  EXPLORERS,
  NOW,
  REGISTRATION_DURATION,
  TIER_DURATION,
  TIER_PERCENTAGES,
  ZERO_ADDRESS,
  PRESALE_DURATION_ON_CERTIFIED,
}: any = config;
const Backend = new BackendService();

declare global {
  interface Window {
    dayjs: any;
  }
}

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
  cancelled: false,
  liquidityAdded: '0',
  beginingAmount: '0',
  raisedAmount: '0',
  raisedAmountBeforeLiquidity: '0',
  participants: '',
  yesVotes: '0',
  noVotes: '0',
  lastTotalStakedAmount: '0',
  // #certifiedAddition
  liquidity: false,
  automatically: false,
  privatePresale: false,
  vesting: 0,
  nativeToken: '',
  // # intermediate certified
  approved: false,
  withdrawedFunds: false,
};
const tiers = ['Pawn', 'Bishop', 'Rook', 'Queen', 'King'];

const Pool: React.FC = () => {
  const { address }: any = useParams();
  const history = useHistory();
  const { handleTransactionHash } = useTransactionHash();
  const { web3 } = useWeb3ConnectorContext();
  const {
    ContractERC20,
    ContractPresalePublic,
    ContractPresalePublicWithMetamask,
    ContractPresaleCertified,
    ContractPresaleCertifiedWithMetamask,
    ContractLessToken,
    ContractStaking,
  } = useContractsContext();

  const [info, setInfo] = useState<any>(defaultInfo);
  const [intermediateInfo, setIntermediateInfo] = useState<any>(defaultInfo);

  const [isCertified, setIsCertified] = useState<boolean>(false);
  const [tier, setTier] = React.useState<string>('');
  const [isMyTierTime, setIsMyTierTime] = useState<boolean>(false);

  const [logo, setLogo] = React.useState<string>(projectLogo);

  const [lessDecimals, setLessDecimals] = useState<number>();
  const [tokenDecimals, setTokenDecimals] = useState<number>(0);

  const [nativeTokenDecimals, setNativeTokenDecimals] = useState<string>('');
  const [nativeTokenSymbol, setNativeTokenSymbol] = useState<string>('');

  const [investments, setInvestments] = useState<any>({ amountEth: 0, amountTokens: 0 });
  const [amountToInvest, setAmountToInvest] = useState<string>('');
  const [myVote, setMyVote] = useState<number>(0);
  const [presaleContractBalance, setPresaleContractBalance] = useState<string>('0');

  const [isInvestStart, setInvestStart] = useState<boolean>(false);
  const [isUserRegister, setUserRegister] = useState<boolean>(false);

  const [whitelist, setWhitelist] = useState<string[]>([]);
  const [currentTier, setCurrentTier] = useState<number>(0);
  // const [
  //   percentageOfTokensSoldInCurrentTier,
  //   setPercentageOfTokensSoldInCurrentTier,
  // ] = useState<number>(0);
  const [tokensSoldInCurrentTier, setTokensSoldInCurrentTier] = useState<number>(0);

  const [winners, setWinners] = useState<string[]>([]);

  const [timeBeforeVoting, setTimeBeforeVoting] = useState<string>('');
  const [timeBeforeAuditEnd, setTimeBeforeAuditEnd] = useState<string>('');
  const [timeBeforeRegistration, setTimeBeforeRegistration] = useState<string>('');
  const [timeBeforeInvestmentEnd, setTimeBeforeInvestmentEnd] = useState<string>('');
  const [timeBeforeMyTier, setTimeBeforeMyTier] = useState<string>('');
  const [timeBeforePresaleStart, setTimeBeforePresaleStart] = useState<string>('');

  const { pools } = useSelector(({ pool }: any) => pool);
  const { chainType } = useSelector(({ wallet }: any) => wallet);
  const { address: userAddress } = useSelector(({ user }: any) => user);
  const { stakedLess, stakedLp, lessPerLp, owner, minVoterBalance } = useSelector(
    ({ library }: any) => library,
  );

  const dispatch = useDispatch();
  const toggleModal = useCallback((params) => dispatch(modalActions.toggleModal(params)), [
    dispatch,
  ]);

  const {
    // #additional info
    tokenSymbol,
    // #general info
    creator,
    token,
    tokenPrice,
    softCap,
    hardCap,
    // tokensForSaleLeft,
    // tokensForLiquidityLeft,
    openTimePresale,
    closeTimePresale,
    openTimeVoting,
    closeTimeVoting,
    collectedFee,
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
    // # certifiedAddition
    liquidity,
    // automatically,
    // vesting,
    nativeToken,
    privatePresale,
  } = info;

  const {
    withdrawedFunds,
    approved,
    // beginingAmount,
    cancelled,
    liquidityAdded,
    participants,
    raisedAmount,
    yesVotes,
    noVotes,
    lastTotalStakedAmount,
  } = intermediateInfo;
  const { amountEth: investedEthByUser } = investments;

  const [tokensShouldBeSold, setTokensShouldBeSold] = useState<number>(hardCap);
  // console.log('Pool:', { percentageOfTokensSoldInCurrentTier, tokensShouldBeSold });

  const isInfo = token !== '...';
  const isPresaleWithLiquidity = liquidity;

  const isBeforeVotimgTime = openTimeVoting > NOW;
  const isVotingTime = openTimeVoting <= NOW && closeTimeVoting > NOW;
  const isBeforeRegistrationTime =
    openTimeVoting <= NOW && openTimePresale - REGISTRATION_DURATION > NOW;
  const isRegistrationTime =
    openTimePresale - REGISTRATION_DURATION <= NOW && openTimePresale > NOW;
  const isInvestmentTime = openTimePresale <= NOW && closeTimePresale > NOW;
  const isInvestmentForEverybodyTime =
    openTimePresale + PRESALE_DURATION_ON_CERTIFIED <= NOW && closeTimePresale > NOW;
  const isOpened = openTimePresale <= NOW;
  const isPresaleClosed = closeTimePresale <= NOW;

  const didCreatorCollectFee = +collectedFee === 0;
  const didCreatorCollectFunds = isCertified
    ? withdrawedFunds
    : +presaleContractBalance <= +collectedFee;
  const didUserInvest = +investedEthByUser > 0;
  const isWhitelist = privatePresale;
  const isUserInWhitelist =
    whitelist && whitelist.length && userAddress && whitelist.includes(userAddress.toLowerCase());
  const isUserWinner = winners.includes(userAddress);
  const stakedSum = +stakedLess + +stakedLp * +lessPerLp;
  const isUserBalanceLtNeededToVote = stakedSum < minVoterBalance;
  console.log('Pool:', { presaleContractBalance, collectedFee, withdrawedFunds });

  const isEthereum = chainType === 'Ethereum';
  const isBinanceSmartChain = chainType === 'Binance-Smart-Chain';

  const exchange = isEthereum ? 'Uniswap' : isBinanceSmartChain ? 'PancakeSwap' : 'SushiSwap';

  const stakedLessAndLp = useMemo(() => {
    if (!lessPerLp) return 0;
    return +stakedLess + +stakedLp * +lessPerLp;
  }, [stakedLess, stakedLp, lessPerLp]);

  const minVotingCompletion = useMemo(
    () => new BN(lastTotalStakedAmount).multipliedBy(new BN(0.1)),
    [lastTotalStakedAmount],
  );
  let votingCompletion = useMemo(
    () => new BN(yesVotes).div(minVotingCompletion).multipliedBy(new BN(100)).toString(10),
    [yesVotes, minVotingCompletion],
  );
  if (+votingCompletion > 100) votingCompletion = '100';
  const isVotingSuccessful = +votingCompletion === 100 && +yesVotes >= +noVotes;

  const hardCapInTokens = useMemo(() => {
    const result = new BN(hardCap).dividedBy(tokenPrice);
    return result.toString(10);
  }, [hardCap, tokenPrice]);

  const raisedAmountInTokens = useMemo(() => {
    const result = new BN(raisedAmount).dividedBy(tokenPrice);
    return result.toString(10);
  }, [raisedAmount, tokenPrice]);

  // const tokensSold = useMemo(() => {
  //   const tokensSoldNew = new BN(beginingAmount).minus(tokensForSaleLeft);
  //   // const pow = new BN(10).pow(tokenDecimals);
  //   // const result = tokensSoldNew.div(pow);
  //   return tokensSoldNew.toString(10);
  // }, [beginingAmount, tokensForSaleLeft]);

  // const tokensSoldInNativeCurrency = useMemo(() => {
  //   const tokensSoldNew = new BN(beginingAmount).minus(tokensForSaleLeft);
  //   const tokenPriceBN = new BN(tokenPrice);
  //   // const pow = new BN(10).pow(tokenDecimals);
  //   const result = tokensSoldNew.multipliedBy(tokenPriceBN);
  //   return result.toString(10);
  // }, [beginingAmount, tokensForSaleLeft, tokenPrice]);

  const percentOfTokensSold = useMemo(() => {
    // const minus = new BN(beginingAmount).minus(tokensForSaleLeft);
    return new BN(raisedAmount).div(hardCap).multipliedBy(100).toString(10);
  }, [hardCap, raisedAmount]);

  const percentageOfTokensSoldInCurrentTier = useMemo(() => {
    const percentagesShouldBeSold: any = [];
    TIER_PERCENTAGES.map((percentage, i) => {
      percentagesShouldBeSold[i] = TIER_PERCENTAGES.reduce((percentages, percent, ir) => {
        return ir <= i ? percentages + percent : percentages;
      });
      return null;
    });
    percentagesShouldBeSold.reverse();
    // let currentTierNew = 0;
    // for (let i = 1; i <= 5; i += 1) {
    //   const tierTimeStart = +openTimePresale + TIER_DURATION * (5 - i);
    //   const tierTimeEnd = +openTimePresale + TIER_DURATION * (5 - i + 1);
    //   if (tierTimeStart <= NOW && tierTimeEnd > NOW) {
    //     currentTierNew = i;
    //   }
    // }
    const tokensShouldBeSoldNew = +new BN(hardCapInTokens).multipliedBy(
      new BN(percentagesShouldBeSold[currentTier - 1] || 100).dividedBy(100),
    );
    return +new BN(raisedAmountInTokens)
      .dividedBy(tokensShouldBeSoldNew)
      .multipliedBy(100)
      .toFixed(2);
  }, [currentTier, hardCapInTokens, raisedAmountInTokens]);

  const percentOfSoftCap = useMemo(() => {
    return new BN(softCap).div(hardCap).multipliedBy(new BN(100)).toString(10);
  }, [softCap, hardCap]);

  const isPresaleSuccessful = +percentOfTokensSold >= +percentOfSoftCap;

  const currency = CHAIN_SYMBOLS[chainType];
  const explorer = EXPLORERS[chainType];

  const getWhitelist = useCallback(async () => {
    try {
      if (!address) return;
      const resultWhitelist = await ContractPresaleCertified.getWhitelistFull({
        contractAddress: address,
      });
      setWhitelist(resultWhitelist);
      console.log('Pool getWhitelist:', resultWhitelist);
      return;
    } catch (e) {
      console.error('Pool getWhitelist:', e);
    }
  }, [ContractPresaleCertified, address]);

  const getPresaleContractBalance = useCallback(async () => {
    try {
      if (!web3) return;
      if (!address) return;
      if (!chainType) return;
      const chainSymbol = CHAIN_SYMBOLS[chainType];
      const decimalsEth =
        CERTIFIED_PRESALE_CURRENCIES[IS_MAINNET_OR_TESTNET][chainType][chainSymbol].decimals;
      const result = await web3.getBalance(address);
      const resultInWei = convertToWei(result, decimalsEth) || '0';
      setPresaleContractBalance(resultInWei);
      console.log('Pool getPresaleContractBalance:', resultInWei);
      return;
    } catch (e) {
      console.error('Pool getPresaleContractBalance:', e);
    }
  }, [address, web3, chainType]);

  const getWinners = useCallback(async () => {
    try {
      const resultGetTiersAndWinners = await Backend.getTiersAndWinners({
        pool: address,
      });
      if (!resultGetTiersAndWinners.data) throw new Error('Pool getWinners Backend error');
      const { winners: newWinners } = resultGetTiersAndWinners.data;
      const { winners_1, winners_2 } = newWinners;
      const winnersNew = winners_1.concat(winners_2);
      const winnersNewFormatted = winnersNew.map((item: string) => item.toLowerCase());
      console.log('Pool getWinners:', winnersNewFormatted);
      setWinners(winnersNewFormatted);
    } catch (e) {
      console.error('Pool:', e);
    }
  }, [address]);

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

  const updateTimer = useCallback(() => {
    try {
      if (openTimeVoting === '0') return;
      if (openTimePresale === '0') return;
      const newTimeBeforeVoting = dayjs(openTimeVoting).fromNow();
      setTimeBeforeVoting(newTimeBeforeVoting);
      const openRegistrationTime = openTimePresale - REGISTRATION_DURATION;
      const newTimeBeforeRegistration = dayjs(openRegistrationTime).fromNow();
      setTimeBeforeRegistration(newTimeBeforeRegistration);
      if (closeTimePresale === '0') return;
      const newTimeBeforeInvestmentEnd = dayjs(closeTimePresale).fromNow();
      setTimeBeforeInvestmentEnd(newTimeBeforeInvestmentEnd);
      const timeBeforeAuditEndNew = dayjs(openRegistrationTime).fromNow();
      setTimeBeforeAuditEnd(timeBeforeAuditEndNew);
      const timeBeforePresaleStartNew = dayjs(openTimePresale).fromNow();
      setTimeBeforePresaleStart(timeBeforePresaleStartNew);
    } catch (e) {
      console.error(e);
    }
  }, [openTimeVoting, openTimePresale, closeTimePresale]);

  const getTokenDecimals = useCallback(async () => {
    try {
      if (!isInfo) return;
      const resultTokenDecimals = await ContractERC20.decimals({ contractAddress: token });
      setTokenDecimals(resultTokenDecimals);
    } catch (e) {
      console.error(e);
    }
  }, [isInfo, ContractERC20, token]);

  const getNativeTokenInfo = useCallback(async () => {
    try {
      if (!nativeToken) return;
      const resultDecimals = await ContractERC20.decimals({
        contractAddress: nativeToken,
      });
      const resultSymbol = await ContractERC20.symbol({
        contractAddress: nativeToken,
      });
      setNativeTokenDecimals(resultDecimals);
      setNativeTokenSymbol(resultSymbol);
    } catch (e) {
      console.error(e);
    }
  }, [nativeToken, ContractERC20]);

  const getIsCertified = useCallback(
    (presaleAddress: string) => {
      try {
        const isCertifiedNew = pools?.filter((item: any) => item.address === presaleAddress)[0]
          .isCertified;
        setIsCertified(isCertifiedNew);
      } catch (e) {
        console.error(e);
      }
    },
    [pools],
  );

  const getInfo = useCallback(async () => {
    try {
      if (!address) return;
      let newInfo;
      if (userAddress) {
        if (isCertified) {
          if (!ContractPresaleCertifiedWithMetamask) return;
          newInfo = await ContractPresaleCertifiedWithMetamask.getInfo({
            contractAddress: address,
          });
          console.log('PagePool getInfo certified:', newInfo);
        } else {
          if (!ContractPresalePublicWithMetamask) return;
          newInfo = await ContractPresalePublicWithMetamask.getInfo({ contractAddress: address });
          console.log('PagePool getInfo public:', newInfo);
        }
      } else if (isCertified) {
        if (!ContractPresaleCertified) return;
        newInfo = await ContractPresaleCertified.getInfo({ contractAddress: address });
        console.log('PagePool getInfo certified:', newInfo);
      } else {
        if (!ContractPresalePublic) return;
        newInfo = await ContractPresalePublic.getInfo({ contractAddress: address });
        console.log('PagePool getInfo public:', newInfo);
      }
      if (newInfo) setInfo(newInfo);
    } catch (e) {
      console.error('PagePool getInfo:', e);
    }
  }, [
    ContractPresaleCertified,
    ContractPresaleCertifiedWithMetamask,
    ContractPresalePublicWithMetamask,
    ContractPresalePublic,
    userAddress,
    address,
    isCertified,
  ]);

  const getIntermediateInfo = useCallback(async () => {
    try {
      if (!token || token === '...') return;
      if (!address) return;
      let newInfo;
      if (userAddress) {
        if (isCertified) {
          if (!ContractPresaleCertifiedWithMetamask) return;
          newInfo = await ContractPresaleCertifiedWithMetamask.getIntermediateInfo({
            contractAddress: address,
            tokenAddress: token,
          });
          console.log('PagePool getIntermediateInfo certified:', newInfo);
        } else {
          if (!ContractPresalePublicWithMetamask) return;
          newInfo = await ContractPresalePublicWithMetamask.getIntermediateInfo({
            contractAddress: address,
            tokenAddress: token,
          });
          console.log('PagePool getIntermediateInfo public:', newInfo);
        }
      } else if (isCertified) {
        if (!ContractPresaleCertified) return;
        newInfo = await ContractPresaleCertified.getIntermediateInfo({
          contractAddress: address,
          tokenAddress: token,
        });
        console.log('PagePool getIntermediateInfo certified:', newInfo);
      } else {
        if (!ContractPresalePublic) return;
        newInfo = await ContractPresalePublic.getIntermediateInfo({
          contractAddress: address,
          tokenAddress: token,
        });
        console.log('PagePool getIntermediateInfo public:', newInfo);
      }
      if (newInfo) setIntermediateInfo(newInfo);
    } catch (e) {
      console.error('PagePool getIntermediateInfo:', e);
    }
  }, [
    ContractPresaleCertified,
    ContractPresaleCertifiedWithMetamask,
    ContractPresalePublicWithMetamask,
    ContractPresalePublic,
    userAddress,
    address,
    isCertified,
    token,
  ]);

  const getMyVote = useCallback(async () => {
    try {
      if (!address) return;
      if (!ContractPresalePublic) return;
      const resultVote = await ContractPresalePublic.getMyVote(address, userAddress);
      setMyVote(+resultVote);
    } catch (e) {
      console.error(e);
    }
  }, [address, userAddress, ContractPresalePublic]);

  const getInvestments = useCallback(async () => {
    try {
      if (!ContractPresalePublic) return;
      if (!userAddress) return;
      if (!tokenDecimals) return;
      const resultInvestments = await ContractPresalePublic.investments({
        contractAddress: address,
        userAddress,
        tokenDecimals,
      });
      console.log('PagePool getRefund certified:', resultInvestments);
      if (resultInvestments) setInvestments(resultInvestments);
    } catch (e) {
      console.error('PagePool getRefund:', e);
    }
  }, [ContractPresalePublic, address, tokenDecimals, userAddress]);

  const loginToBackend = useCallback(async () => {
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
  }, [userAddress, web3]);

  const handleTransactionWentWrong = useCallback(() => {
    toggleModal({
      open: true,
      text: (
        <div className={s.messageContainer}>
          <p>Something went wrong</p>
        </div>
      ),
    });
  }, [toggleModal]);

  const vote = useCallback(
    async (yes: boolean) => {
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
        const {
          date,
          signature,
          user_balance: stakingAmount,
          stakedAmount: totalStakedAmount,
        } = resultGetPoolSignature.data;
        const result = ContractPresalePublicWithMetamask.vote({
          contractAddress: address,
          stakingAmount,
          userAddress,
          date,
          signature,
          yes,
          totalStakedAmount,
        })
          .on('transactionHash', (txHash: string) => {
            handleTransactionHash(txHash);
            getInfo();
          })
          .on('error', (e) => {
            console.error(e);
            handleTransactionWentWrong();
          })
          .then((res) => {
            console.log('PagePool cancelPresale', res);
            getInfo();
          });
        console.log('PagePool vote:', result);
        await getMyVote();
        await getInfo();
      } catch (e) {
        console.error('PagePool vote:', e);
      }
    },
    [
      ContractPresalePublicWithMetamask,
      address,
      getInfo,
      getMyVote,
      loginToBackend,
      userAddress,
      handleTransactionHash,
      handleTransactionWentWrong,
    ],
  );

  const approveNativeTokens = useCallback(async () => {
    try {
      const totalSupply = await ContractERC20.totalSupply({ contractAddress: nativeToken });
      // const { addresses }: any = config;
      // const spender = addresses[config.IS_MAINNET_OR_TESTNET][chainType].PresaleCertified;
      const spender = address;
      const allowance = await ContractERC20.allowance({
        contractAddress: nativeToken,
        userAddress,
        spender,
      });
      console.log('Pool approveTokens:', { totalSupply, spender, allowance });
      if (allowance < totalSupply) {
        const resultApprove = await ContractERC20.approve({
          contractAddress: nativeToken,
          userAddress,
          spender,
          amount: totalSupply,
        });
        console.log('Pool approveTokens resultApprove:', resultApprove);
        return true;
      }
      return true;
    } catch (e) {
      console.error('Pool approveTokens:', e);
      return false;
    }
  }, [ContractERC20, address, nativeToken, userAddress]);

  const invest = useCallback(async () => {
    try {
      const resultLoginToBackend = await loginToBackend();
      if (!resultLoginToBackend.success) throw new Error('Not logged to backend');
      const { key }: any = resultLoginToBackend.data;
      const resultGetInvestSignature = await Backend.getInvestSignature({
        token: key,
        pool: address,
      });
      console.log('PagePool invest resultGetInvestSignature:', resultGetInvestSignature);
      if (!resultGetInvestSignature.data) throw new Error('Cannot get invest signature');
      const { user_balance: userBalance } = resultGetInvestSignature.data;
      const {
        date: timestamp,
        signature,
        poolPercentages,
        stakingTiers,
      } = resultGetInvestSignature.data;
      console.log('PagePool invest:', { amountToInvest, tokenDecimals });
      const resultGetTierSignature = await Backend.getTierSignature({
        token: key,
        presale: address,
      });
      console.log('PagePool resultGetTierSignature:', resultGetTierSignature);
      if (!resultGetTierSignature.data) return;
      let resultInvest;
      if (isCertified) {
        let amountToInvestInWei = '0'; // вввод в эфирах
        let nativeTokenAmount; // вввод в нативных токенах
        if (nativeToken === ZERO_ADDRESS) {
          amountToInvestInWei = new BN(amountToInvest)
            .multipliedBy(new BN(10).pow(new BN(18)))
            .toString(10);
          nativeTokenAmount = '0';
        } else {
          const resultApprove = await approveNativeTokens();
          if (!resultApprove) return;
          nativeTokenAmount = new BN(amountToInvest)
            .multipliedBy(new BN(10).pow(new BN(nativeTokenDecimals)))
            .toString(10);
        }
        resultInvest = await ContractPresaleCertifiedWithMetamask.invest({
          userAddress,
          contractAddress: address,
          amount: amountToInvestInWei,
          nativeTokenAmount,
          userBalance,
          signature,
          timestamp,
          poolPercentages,
          stakingTiers,
        }).on('transactionHash', (txHash: string) => {
          handleTransactionHash(txHash);
        });
      } else {
        const amountToInvestInWei = new BN(amountToInvest)
          .multipliedBy(new BN(10).pow(new BN(tokenDecimals)))
          .toString(10);
        resultInvest = await ContractPresalePublicWithMetamask.invest({
          userAddress,
          contractAddress: address,
          amount: amountToInvestInWei,
          userBalance,
          signature,
          timestamp,
          poolPercentages,
          stakingTiers,
        })
          .on('transactionHash', (txHash: string) => {
            handleTransactionHash(txHash);
          })
          .then(() => {
            getInvestments();
          });
      }
      console.log('PagePool invest:', resultInvest);
    } catch (e) {
      console.error('PagePool invest:', e);
    }
  }, [
    loginToBackend,
    address,
    amountToInvest,
    tokenDecimals,
    isCertified,
    nativeToken,
    ContractPresaleCertifiedWithMetamask,
    userAddress,
    approveNativeTokens,
    nativeTokenDecimals,
    handleTransactionHash,
    ContractPresalePublicWithMetamask,
    getInvestments,
  ]);

  const getUserRegister = useCallback(async () => {
    try {
      if (!address) return;
      if (!userAddress) return;
      let ContractPresale = ContractPresalePublic;
      if (isCertified) ContractPresale = ContractPresaleCertified;
      const resultRegister = await ContractPresale.getUserRegister(address, userAddress);
      setUserRegister(resultRegister);
    } catch (e) {
      console.error(e);
    }
  }, [isCertified, userAddress, ContractPresalePublic, ContractPresaleCertified, address]);

  const register = useCallback(async () => {
    try {
      // login to backend
      const resultGetMetamaskMessage = await Backend.getMetamaskMessage();
      console.log('PagePool resultGetMetamaskMessage:', resultGetMetamaskMessage);
      if (!resultGetMetamaskMessage.data)
        throw new Error('PagePool: getMetamaskMessage unsuccesful');
      const msg = resultGetMetamaskMessage.data;
      const signedMsg = await web3.signMessage({ userAddress, message: msg });
      console.log('PagePool signedMsg:', signedMsg);
      if (!signedMsg) throw new Error('PagePool: signMessage unsuccesful');
      const resultMetamaskLogin = await Backend.metamaskLogin({
        address: userAddress,
        msg,
        signedMsg,
      });
      console.log('PagePool resultMetamaskLogin:', resultMetamaskLogin);
      if (!resultMetamaskLogin.data) throw new Error('PagePool: metamaskLogin unsuccesful');
      const { key } = resultMetamaskLogin.data;
      const resultGetWhitelistSignature = await Backend.getWhitelistSignature({
        token: key,
        pool: address,
      });
      console.log('PagePool resultGetWhitelistSignature:', resultGetWhitelistSignature);
      if (!resultGetWhitelistSignature.data)
        throw new Error('PagePool: getWhitelistSignature unsuccesful');
      const {
        signature,
        date: timestamp,
        user_balance: userBalance,
      } = resultGetWhitelistSignature.data;
      const userTier = await ContractStaking.getUserTier({
        userAddress,
      });
      if (!userTier)
        toggleModal({
          open: true,
          text: (
            <div className="messageContainer">
              <p>You are not in a tier. Please, stake minimum 1000 $LESS or 3.4 ETH-LESS LP</p>
            </div>
          ),
        });
      let ContractPresale = ContractPresalePublicWithMetamask;
      if (isCertified) ContractPresale = ContractPresaleCertifiedWithMetamask;
      const resultVote = ContractPresale.register({
        userAddress,
        contractAddress: address,
        tier: userTier,
        signature,
        stakedAmount: userBalance,
        timestamp,
      }).on('transactionHash', (txHash: string) => {
        handleTransactionHash(txHash);
      });
      console.log('PagePool resultVote:', resultVote);
    } catch (e) {
      console.error('PagePool register:', e);
    }
  }, [
    handleTransactionHash,
    isCertified,
    ContractPresalePublicWithMetamask,
    ContractPresaleCertifiedWithMetamask,
    ContractStaking,
    address,
    userAddress,
    toggleModal,
    web3,
  ]);

  const getDecimals = useCallback(async () => {
    try {
      if (!ContractLessToken) return;
      const resultLessDecimals = await ContractLessToken.decimals();
      setLessDecimals(resultLessDecimals);
    } catch (e) {
      console.error(e);
    }
  }, [ContractLessToken]);

  const getTier = useCallback(async () => {
    try {
      const userTier = await ContractStaking.getUserTier({ userAddress });
      setTier(userTier);
    } catch (e) {
      console.error(e);
    }
  }, [ContractStaking, userAddress]);

  const getTierTime = useCallback(() => {
    try {
      if (!isInfo) return;
      if (!tier) return;
      const tierTimeNew = +openTimePresale + TIER_DURATION * (5 - +tier);
      const isMyTierTimeNew =
        isInvestmentTime && (isCertified && isWhitelist ? openTimePresale : tierTimeNew) <= NOW;
      const timeBeforeMyTierNew =
        isCertified && isWhitelist
          ? dayjs(openTimePresale).fromNow()
          : dayjs(tierTimeNew).fromNow();
      setIsMyTierTime(isMyTierTimeNew);
      setTimeBeforeMyTier(timeBeforeMyTierNew);
      // percentage should be sold in current tier
      const percentagesShouldBeSold: any = [];
      TIER_PERCENTAGES.map((percentage, i) => {
        percentagesShouldBeSold[i] = TIER_PERCENTAGES.reduce((percentages, percent, ir) => {
          return ir <= i ? percentages + percent : percentages;
        });
        return null;
      });
      percentagesShouldBeSold.reverse();
      // current tier 5 >>> 1
      let currentTierNew = 0;
      for (let i = 1; i <= 5; i += 1) {
        const tierTimeStart = +openTimePresale + TIER_DURATION * (5 - i);
        const tierTimeEnd = +openTimePresale + TIER_DURATION * (5 - i + 1);
        if (tierTimeStart <= NOW && tierTimeEnd > NOW) {
          currentTierNew = i;
        }
      }
      setCurrentTier(currentTierNew);
      // tokens should be sold in current tier
      // const tokensShouldBeSoldNew = +new BN(hardCapInTokens)
      //   .multipliedBy(percentagesShouldBeSold[currentTierNew - 1])
      //   .dividedBy(100)
      //   .minus(new BN(hardCapInTokens).minus(tokensForSaleLeft))
      //   .toString(10);
      const tokensShouldBeSoldNew = +new BN(hardCapInTokens).multipliedBy(
        new BN(percentagesShouldBeSold[currentTierNew - 1] || 100).dividedBy(100),
      );
      // const tokensSoldNew = +new BN(hardCap-tokensSold)
      const tokensSoldNew = +raisedAmountInTokens;
      // const tokensSoldNew = +new BN(hardCapInTokens).minus(tokensForSaleLeft).toString(10);
      // const tokensSoldNew = +new BN(hardCapInTokens)
      //   .multipliedBy(new BN(percentagesShouldBeSold[currentTierNew - 1]))
      //   .dividedBy(100)
      //   .minus(tokensShouldBeSoldNew)
      //   .minus(tokensSold)
      //   .toString(10);
      // if (currentTierNew) {
      //   tokensShouldBeSoldNew = +new BN(hardCapInTokens)
      //     .multipliedBy(percentagesShouldBeSold[currentTierNew - 1])
      //     .dividedBy(100)
      //     .minus(tokensSold)
      //     .toString(10);
      //   // (+hardCapInTokens * percentagesShouldBeSold[currentTierNew - 1]) / 100;
      // }
      // const percentageOfTokensSoldInCurrentTierNew = (+tokensSold / +tokensShouldBeSoldNew) * 100;
      // const percentageOfTokensSoldInCurrentTierNew = +new BN(tokensSold)
      //   .dividedBy(tokensShouldBeSoldNew)
      //   .multipliedBy(100)
      //   .toFixed(2);
      // const percentageOfTokensSoldInCurrentTierNew = +new BN(tokensSoldNew)
      //   .dividedBy(tokensShouldBeSoldNew)
      //   .multipliedBy(100)
      //   .toFixed(2);
      // setPercentageOfTokensSoldInCurrentTier(percentageOfTokensSoldInCurrentTierNew);
      setTokensShouldBeSold(tokensShouldBeSoldNew);
      setTokensSoldInCurrentTier(tokensSoldNew);
      // console.log('PagePool getTierTime:', {
      //   currentTierNew,
      //   hardCap,
      //   tokensForSaleLeft,
      //   tokensShouldBeSoldNew,
      //   tokensSold,
      //   percentagesShouldBeSold,
      //   percentageOfTokensSoldInCurrentTierNew,
      // });
    } catch (e) {
      console.error(e);
    }
  }, [
    isInfo,
    tier,
    openTimePresale,
    isInvestmentTime,
    isCertified,
    isWhitelist,
    hardCapInTokens,
    raisedAmountInTokens,
  ]);
  // console.log('Pool currentTier:', currentTier);

  const getPoolStatus = useCallback(async () => {
    try {
      if (closeTimeVoting < NOW) {
        const { data } = await Backend.getPoolStatus(address);
        console.log('Pool getPoolStatus:', data);
        setInvestStart(data.investment);
      }
    } catch (e) {
      console.error(e);
    }
  }, [address, closeTimeVoting]);

  // не набрался софтап, время инвестирования закончилось. В этом случае овнер пресейла может забрать свои токены
  const cancelPresale = useCallback(async () => {
    try {
      let ContractPresale = ContractPresalePublicWithMetamask;
      if (isCertified) ContractPresale = ContractPresaleCertifiedWithMetamask;
      const result = ContractPresale.cancelPresale({
        userAddress,
        contractAddress: address,
      });
      result
        .on('transactionHash', (txHash: string) => {
          handleTransactionHash(txHash);
        })
        .on('error', (e) => {
          console.error(e);
          handleTransactionWentWrong();
        })
        .then((res) => {
          console.log('PagePool cancelPresale', res);
          getInfo();
        });
      console.log('PagePool cancelPresale:', result);
    } catch (e) {
      console.error(e);
    }
  }, [
    getInfo,
    isCertified,
    ContractPresalePublicWithMetamask,
    ContractPresaleCertifiedWithMetamask,
    address,
    userAddress,
    handleTransactionHash,
    handleTransactionWentWrong,
  ]);

  // для создателя забрать собранные средства после добавления ликвидности или без нее, если такой пресейл
  const collectFunds = useCallback(async () => {
    try {
      let ContractPresale = ContractPresalePublicWithMetamask;
      if (isCertified) ContractPresale = ContractPresaleCertifiedWithMetamask;
      const result = ContractPresale.collectFundsRaised({
        userAddress,
        contractAddress: address,
      });
      result
        .on('transactionHash', (txHash: string) => {
          handleTransactionHash(txHash);
        })
        .on('error', (e) => {
          console.error(e);
          handleTransactionWentWrong();
        })
        .then((res) => {
          console.log('PagePool collectFunds', res);
          getInfo();
        });
      console.log('PagePool collectFunds:', result);
    } catch (e) {
      console.error(e);
    }
  }, [
    getInfo,
    isCertified,
    ContractPresalePublicWithMetamask,
    ContractPresaleCertifiedWithMetamask,
    address,
    userAddress,
    handleTransactionHash,
    handleTransactionWentWrong,
  ]);

  // когда не набралось голосов, создатель пресейла может потребовать обратно свои 1000$ в эфирах и токены, которые были на продаже
  const collectFee = useCallback(async () => {
    try {
      let ContractPresale = ContractPresalePublicWithMetamask;
      if (isCertified) ContractPresale = ContractPresaleCertifiedWithMetamask;
      const result = ContractPresale.collectFee({
        userAddress,
        contractAddress: address,
      });
      result
        .on('transactionHash', (txHash: string) => {
          handleTransactionHash(txHash);
        })
        .on('error', (e) => {
          console.error(e);
          handleTransactionWentWrong();
        })
        .then((res) => {
          console.log('PagePool collectFee', res);
          getInfo();
        });
      console.log('PagePool collectFee:', result);
    } catch (e) {
      console.error(e);
    }
  }, [
    getInfo,
    isCertified,
    ContractPresalePublicWithMetamask,
    ContractPresaleCertifiedWithMetamask,
    address,
    userAddress,
    handleTransactionHash,
    handleTransactionWentWrong,
  ]);

  const handleGoToStaking = useCallback(async () => {
    try {
      toggleModal({ open: false });
      history.push('/staking');
    } catch (e) {
      console.error(e);
    }
  }, [toggleModal, history]);

  const handleVote = useCallback(
    async (yes: boolean) => {
      try {
        await vote(yes);
      } catch (e) {
        console.error('PagePool handleVote:', e);
      }
    },
    [vote],
  );

  // забрать токены после окончания пресейла и добавления ликвидности (если она есть)
  const handleClaimTokens = useCallback(async () => {
    try {
      let ContractPresale = ContractPresalePublicWithMetamask;
      if (isCertified) ContractPresale = ContractPresaleCertifiedWithMetamask;
      const result = ContractPresale.claimTokens({
        userAddress,
        contractAddress: address,
      });
      result
        .on('transactionHash', (txHash: string) => {
          handleTransactionHash(txHash);
        })
        .on('error', (e) => {
          console.error(e);
          handleTransactionWentWrong();
        })
        .then((res) => {
          console.log('PagePool resultClaimTokens', res);
          getInfo();
        });
      console.log('PagePool resultClaimTokens:', result);
    } catch (e) {
      console.error('PagePool resultClaimTokens:', e);
    }
  }, [
    isCertified,
    ContractPresalePublicWithMetamask,
    ContractPresaleCertifiedWithMetamask,
    userAddress,
    address,
    handleTransactionHash,
    handleTransactionWentWrong,
    getInfo,
  ]);

  // возможность отозвать инвестиции до набора софткапа
  const withdrawInvestment = useCallback(async () => {
    try {
      let ContractPresale = ContractPresalePublicWithMetamask;
      if (isCertified) ContractPresale = ContractPresaleCertifiedWithMetamask;
      const result = ContractPresale.withdrawInvestment({
        userAddress,
        contractAddress: address,
      });
      result
        .on('transactionHash', (txHash: string) => {
          handleTransactionHash(txHash);
        })
        .on('error', (e) => {
          console.error(e);
          handleTransactionWentWrong();
        })
        .then((res) => {
          console.log('PagePool withdrawInvestment', res);
          getInfo();
          getInvestments();
        });
      console.log('PagePool withdrawInvestment:', result);
    } catch (e) {
      console.error('PagePool withdrawInvestment:', e);
    }
  }, [
    isCertified,
    ContractPresalePublicWithMetamask,
    ContractPresaleCertifiedWithMetamask,
    userAddress,
    address,
    handleTransactionHash,
    handleTransactionWentWrong,
    getInfo,
    getInvestments,
  ]);

  // модальное окно с формой инвестирования
  // const handleInvest = useCallback(async () => {
  //   try {
  //     toggleModal({
  //       open: true,
  //       text: (
  //         <div className="messageContainer">
  //           <p>Please, enter amount to invest (in ether)</p>
  //           <Input
  //             title=""
  //             value={amountToInvest}
  //             onChange={setAmountToInvest}
  //             style={{ marginBottom: 10 }}
  //           />
  //           <div className="button-border" style={{ margin: '5px 0' }}>
  //             <div
  //               className="button"
  //               role="button"
  //               tabIndex={0}
  //               onClick={invest}
  //               onKeyDown={() => {}}
  //             >
  //               <div className="gradient-button-text">Submit</div>
  //             </div>
  //           </div>
  //         </div>
  //       ),
  //     });
  //   } catch (e) {
  //     console.error('PagePool handleInvest:', e);
  //   }
  // }, [toggleModal, amountToInvest, invest]);

  useEffect(() => {
    if (!address) history.push('/');
  }, [address, history]);

  useEffect(() => {
    if (!info) return;
    getImage();
  }, [info, getImage]);

  useEffect(() => {
    if (!info) return () => {};
    updateTimer();
    const interval = setInterval(() => updateTimer(), 3000);
    return () => {
      clearInterval(interval);
    };
  }, [info, updateTimer]);

  useEffect(() => {
    if (!token || token === '...') return;
    if (!userAddress) return;
    if (!ContractLessToken) return;
    if (!ContractERC20) return;
    // getDecimals();
    getTokenDecimals();
  }, [ContractLessToken, userAddress, token, getTokenDecimals, ContractERC20]);

  useEffect(() => {
    if (!nativeToken || nativeToken === '...' || nativeToken === ZERO_ADDRESS) return;
    if (!userAddress) return;
    if (!ContractERC20) return;
    getNativeTokenInfo();
  }, [userAddress, nativeToken, getNativeTokenInfo, ContractERC20]);

  useEffect(() => {
    if (!pools || !pools.length) return;
    getIsCertified(address);
  }, [pools, address, getIsCertified]);

  useEffect(() => {
    if (!ContractPresalePublic) return () => {};
    if (!ContractPresaleCertified) return () => {};
    if (isCertified === undefined) return () => {};
    getInfo();
    return () => {};
    // const interval = setInterval(() => getInfo(), 60000);
    // return () => {
    //   clearInterval(interval);
    // };
  }, [ContractPresalePublic, ContractPresaleCertified, isCertified, getInfo]);

  useEffect(() => {
    if (!ContractPresalePublic) return () => {};
    if (!ContractPresaleCertified) return () => {};
    if (isCertified === undefined) return () => {};
    getIntermediateInfo();
    return () => {};
    // const interval = setInterval(() => getIntermediateInfo(), 10000);
    // return () => {
    //   clearInterval(interval);
    // };
  }, [ContractPresalePublic, ContractPresaleCertified, isCertified, getIntermediateInfo]);

  useEffect(() => {
    if (!ContractLessToken) return;
    if (!ContractPresalePublic) return;
    if (!ContractPresaleCertified) return;
    if (isCertified === undefined) return;
    getDecimals();
  }, [
    ContractPresalePublic,
    ContractPresaleCertified,
    ContractLessToken,
    getDecimals,
    isCertified,
  ]);

  useEffect(() => {
    if (!ContractPresalePublic) return;
    if (!address) return;
    if (!userAddress) return;
    if (!tokenDecimals) return;
    getInvestments();
  }, [address, userAddress, tokenDecimals, ContractPresalePublic, getInvestments]);

  useEffect(() => {
    if (isCertified !== undefined && ContractPresalePublicWithMetamask && userAddress && address) {
      if (!isCertified) getMyVote();
    }
  }, [getMyVote, isCertified, ContractPresalePublicWithMetamask, userAddress, address]);

  useEffect(() => {
    if (userAddress && ContractStaking) {
      getTier();
    }
  }, [getTier, userAddress, ContractStaking]);

  useEffect(() => {
    getTierTime();
    const interval = setInterval(() => {
      getTierTime();
    }, 3000);
    return () => clearInterval(interval);
  }, [getTierTime]);

  useEffect(() => {
    if (!closeTimeVoting) return () => {};
    getPoolStatus();
    const interval = setInterval(() => {
      getPoolStatus();
    }, 10000);
    return () => clearInterval(interval);
  }, [getPoolStatus, closeTimeVoting]);

  useEffect(() => {
    if (ContractPresalePublic && address && userAddress) {
      getUserRegister();
    }
  }, [getUserRegister, ContractPresalePublic, address, userAddress]);

  useEffect(() => {
    if (!info) return;
    if (!ContractPresaleCertified) return;
    getWhitelist();
    getPresaleContractBalance();
    getWinners();
  }, [info, ContractPresaleCertified, getWhitelist, getWinners, getPresaleContractBalance]);

  const row1 = [
    {
      header: 'Softcap',
      value: `${softCap} ${nativeTokenSymbol || currency}`,
      gradient: true,
      less: false,
    },
    {
      header: 'Presale Rate',
      value: `${tokenPrice} ${nativeTokenSymbol || currency}`,
      gradient: false,
      less: false,
    },
    {
      header: 'Liquidity Allocation',
      value: `${liquidityPercentageAllocation}%`,
      gradient: false,
      less: false,
    },
    {
      header: 'Open Time',
      value: dayjs(openTimePresale).format('MMMM DD, YYYY HH:mm A GMT'),
      gradient: false,
      less: false,
    },
  ];

  const row2 = [
    {
      header: 'Hardcap',
      value: `${hardCap} ${nativeTokenSymbol || currency}`,
      gradient: true,
      less: false,
    },
    {
      header: `${exchange} Listing Rate`,
      value: `${listingPrice} ETH` /* ${nativeTokenSymbol || currency} */,
      gradient: false,
      less: false,
    },
    {
      header: 'Liquidity Lock Duration',
      value: `${lpTokensLockDurationInDays} days`,
      gradient: true,
      less: false,
    },
    {
      header: 'Close Time',
      value: dayjs(closeTimePresale).format('MMMM DD, YYYY HH:mm A GMT'),
      gradient: false,
      less: false,
    },
  ];

  const yesVotesFormatted = convertFromWei(yesVotes, lessDecimals || 18) || 0;
  const noVotesFormatted = convertFromWei(noVotes, lessDecimals || 18) || 0;

  const row3 = [
    {
      header: 'Presale Type',
      value: `${isCertified ? 'Certified' : 'Public'} Presale`,
      gradient: false,
      less: false,
    },
    {
      header: isCertified ? '' : 'Yes Votes',
      value: isCertified ? '' : prettyNumber(yesVotesFormatted.toString()),
      gradient: false,
      less: false,
    },
    {
      header: isCertified ? '' : 'No Votes',
      value: isCertified ? '' : prettyNumber(noVotesFormatted.toString()),
      gradient: false,
      less: false,
    },
    {
      header: !isCertified ? 'Voting completion' : '',
      value: !isCertified
        ? lastTotalStakedAmount === '0'
          ? '0%'
          : `${prettyNumber(votingCompletion)}%`
        : '',
      gradient: +votingCompletion === 100,
      less: false,
    },
  ];

  const links = [
    {
      header: 'Token Contract Address',
      value: token,
      link: `${EXPLORERS[chainType]}/token/${token}`,
    },
    // {
    //   header: 'PancakeSwap Address',
    //   value: '0x19314Dfa75CfC1E5154f95daFaB217646bdb79AC',
    // },
    // {
    //   header: 'Locked Liquidity Address',
    //   value: '0x0e7b582003de0E541548cF02a1F00725Df6E6E6f',
    //   link: `${EXPLORERS[chainType]}/token/${token}`,
    // },
    {
      header: 'Presale Contract Address',
      value: address,
      link: `${EXPLORERS[chainType]}/address/${address}`,
    },
  ];

  const linksIcons = [
    { image: Telegram, link: linkTelegram },
    { image: Twitter, link: linkTwitter },
    { image: Link, link: linkWebsite },
    { image: Github, link: linkGithub },
  ];

  // ======================= Messages =========================

  // Voting
  const htmlVotingWillStart = (
    <div className="container-presale-status">
      <div className="container-presale-status-inner">
        <div className="gradient-header">Voting will start</div>
        <div className="presale-status-text">{timeBeforeVoting}</div>
      </div>
    </div>
  );

  const htmlVotingStarted = (
    <div className="container-presale-status">
      <div className="container-presale-status-inner">
        <div className="gradient-header">Voting started</div>
        <div className="presale-status-text">{timeBeforeVoting}</div>
      </div>
    </div>
  );

  const htmlVotingIsNotSuccessfulForUser = (
    <div className="container-presale-status">
      <div className="container-presale-status-inner">
        <div className="gradient-header">Voting is not successful</div>
        <div className="presale-status-text">Presale closed</div>
      </div>
    </div>
  );

  const htmlVotingIsNotSuccessfulAndPresaleIsClosedForCreator = (
    <div className="container-presale-status">
      <div className="container-presale-status-inner">
        <div className="gradient-header">Voting is not successful</div>
        <div className="presale-status-text">Presale closed</div>
      </div>
    </div>
  );

  // Audit
  const htmlAuditApprovedPresaleWillStartIn = (
    <div className="container-presale-status">
      <div className="container-presale-status-inner">
        <div className="gradient-header">Audit is successful</div>
        <div className="presale-status-text">Presale will start {timeBeforePresaleStart}</div>
      </div>
    </div>
  );

  const htmlAuditApprovedRegistrationWillStartIn = (
    <div className="container-presale-status">
      <div className="container-presale-status-inner">
        <div className="gradient-header">Audit is successful</div>
        <div className="presale-status-text">Registration will start {timeBeforeRegistration}</div>
      </div>
    </div>
  );

  const htmlAuditWillBeFinishedIn = (
    <div className="container-presale-status">
      <div className="container-presale-status-inner">
        <div className="gradient-header">Presale is currently being audited</div>
        <div className="presale-status-text">Audit will be finished {timeBeforeAuditEnd}</div>
      </div>
    </div>
  );

  // Registration
  const htmlRegistrationWillStart = (
    <div className="container-presale-status">
      <div className="container-presale-status-inner">
        <div className="gradient-header">Registration will start</div>
        <div className="presale-status-text">{timeBeforeRegistration}</div>
      </div>
    </div>
  );

  const htmlRegistrationStarted = (
    <div className="container-presale-status">
      <div className="container-presale-status-inner">
        <div className="gradient-header">Registration started</div>
        <div className="presale-status-text">{timeBeforeRegistration}</div>
      </div>
    </div>
  );

  // Softcap not reached
  const htmlPresaleIsNotSuccessfulAndIsClosedForUser = (
    <div className="container-presale-status">
      <div className="container-presale-status-inner">
        <div className="gradient-header">Softcap limit not reached</div>
        <div className="presale-status-text">Presale closed</div>
      </div>
    </div>
  );

  const htmlPresaleIsNotSuccessfulAndIsClosedForCreator = (
    <div className="container-presale-status">
      <div className="container-presale-status-inner">
        <div className="gradient-header">Softcap limit not reached</div>
        <div className="presale-status-text">Presale is closed</div>
      </div>
    </div>
  );

  // Audit is not approved
  const htmlAuditIsNotApprovedForUserOnCertified = (
    <div className="container-presale-status">
      <div className="container-presale-status-inner">
        <div className="gradient-header">Audit is not successful</div>
        <div className="presale-status-text">Presale closed</div>
      </div>
    </div>
  );

  const htmlAuditIsNotApprovedAndPresaleIsClosedForCreatorOnCertified = (
    <div className="container-presale-status">
      <div className="container-presale-status-inner">
        <div className="gradient-header">Audit is not successful</div>
        <div className="presale-status-text">Presale closed</div>
      </div>
    </div>
  );

  // Investment
  const htmlInvestmentEnds = (
    <div className="container-presale-status">
      <div className="container-presale-status-inner">
        <div className="gradient-header">Investment ends</div>
        <div className="presale-status-text">{timeBeforeInvestmentEnd}</div>
      </div>
    </div>
  );

  // ======================= Buttons =========================

  // Voting
  const htmlYouNeed500LessToVote = (
    <div className="item">
      <div className="item-text-gradient" style={{ fontSize: 35, lineHeight: '45px' }}>
        Voting
      </div>
      <div className="item-text">
        You need at least {minVoterBalance} $LESS or{' '}
        {prettyNumber((+minVoterBalance / lessPerLp).toString())} {currency}-LESS LP in stake to be
        able to vote
      </div>
      <div className="item-text">
        <Button onClick={handleGoToStaking}>Go to Staking</Button>
      </div>
    </div>
  );

  const htmlVoting = (
    <div className="item">
      <div className="item-text-gradient" style={{ fontSize: 35, lineHeight: '45px' }}>
        Voting
      </div>
      <div className="item-text">
        <div className="item-text-bold">{prettyNumber(stakedLessAndLp.toString())}</div>
        <div className="item-text-gradient">LESS</div>
      </div>
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
  );

  const htmlYouVoted = (
    <div className="item">
      <div className="item-text-gradient" style={{ fontSize: 35, lineHeight: '45px' }}>
        Voting
      </div>
      <div className="item-text">You voted</div>
    </div>
  );

  // Voting is not successful
  const htmlCollectFeeWhenVotingNotSuccessful = (
    <div className="item">
      <div className="item-text-gradient" style={{ fontSize: 35, lineHeight: '45px' }}>
        Claim refund
      </div>
      <div className="item-text-bold">Voting is not successful</div>
      <div className="button-border">
        <div
          className="button"
          role="button"
          tabIndex={0}
          onClick={collectFee}
          onKeyDown={() => {}}
        >
          <div className="gradient-button-text">Claim refund</div>
        </div>
      </div>
    </div>
  );

  // Approve is not successful
  const htmlCollectFeeWhenNotApproved = (
    <div className="item">
      <div className="item-text-gradient" style={{ fontSize: 35, lineHeight: '45px' }}>
        Claim refund
      </div>
      <div className="item-text-bold">Audit is not successful</div>
      <div className="button-border">
        <div
          className="button"
          role="button"
          tabIndex={0}
          onClick={collectFee}
          onKeyDown={() => {}}
        >
          <div className="gradient-button-text">Claim refund</div>
        </div>
      </div>
    </div>
  );

  // Registration
  const htmlYouAreRegistered = (
    <div className="item">
      <div className="item-text-gradient" style={{ fontSize: 35, lineHeight: '45px' }}>
        Registration
      </div>
      <div className="item-text">You are registered</div>
    </div>
  );

  const htmlRegistration = (
    <>
      <div className="item">
        <div className="item-text-gradient" style={{ fontSize: 35, lineHeight: '45px' }}>
          Registration
        </div>
        <img src={RegisterImg} alt="" />
        <div className="button-border">
          <div
            className="button"
            role="button"
            tabIndex={0}
            onClick={register}
            onKeyDown={() => {}}
          >
            <div className="gradient-button-text">Register</div>
          </div>
        </div>
      </div>
    </>
  );

  // Investment
  const htmlYouNeedToBeRegisteredToInvest = (
    <div className="item">
      <div className="item-text-gradient" style={{ fontSize: 35, lineHeight: '45px' }}>
        Investment
      </div>
      <div className="item-text">You need to be registered on presale to invest</div>
    </div>
  );

  const htmlYouNeedToBeInTier4or5ToInvestOnCertified = (
    <div className="item">
      <div className="item-text-gradient" style={{ fontSize: 35, lineHeight: '45px' }}>
        Investment
      </div>
      <div className="item-text">You need to be in tier Queen or King to invest</div>
      <div className="item-text">
        <Button onClick={handleGoToStaking}>Go to Staking</Button>
      </div>
    </div>
  );

  const htmlYourInvestment = (
    <div className="item">
      <div className="item-text-gradient" style={{ fontSize: 35, lineHeight: '45px' }}>
        Your {nativeTokenSymbol || currency} Investment
      </div>
      <div className="item-text">
        <div className="item-text-bold">
          {investments.amountEth} {nativeTokenSymbol || currency}
        </div>
      </div>
    </div>
  );

  const htmlInvestmentBuyTokens = (
    <div className="item">
      <div className="item-text-gradient" style={{ fontSize: 35, lineHeight: '45px' }}>
        Buy tokens
      </div>
      <div className="item-text">
        <div className="item-text-bold">
          1 {tokenSymbol} = {tokenPrice} {nativeTokenSymbol || nativeTokenSymbol || currency}
        </div>
      </div>
      <p>
        Please, enter amount to invest (in {nativeTokenSymbol || nativeTokenSymbol || currency})
      </p>
      <Input
        title=""
        value={amountToInvest}
        onChange={setAmountToInvest}
        style={{ marginBottom: 10 }}
      />
      <div className="button-border" style={{ margin: '5px 0' }}>
        <div className="button" role="button" tabIndex={0} onClick={invest} onKeyDown={() => {}}>
          <div className="gradient-button-text">Invest</div>
        </div>
      </div>
    </div>
  );

  const htmlInvestmentYourTierStarts = (
    <div className="item">
      <div className="item-text-gradient" style={{ fontSize: 35, lineHeight: '45px' }}>
        Buy tokens
      </div>
      <div className="item-text">
        <div className="item-text-bold">Your tier invest time starts {timeBeforeMyTier}</div>
      </div>
    </div>
  );

  // Presale is successful
  const htmlClaimTokens = (
    <>
      <div className="item">
        <div className="item-text-gradient" style={{ fontSize: 35, lineHeight: '45px' }}>
          Your tokens
        </div>
        <div className="item-text">
          <div className="item-text-bold">{investments.amountTokens}</div>
          <div className="item-text-gradient">{tokenSymbol}</div>
        </div>
        <div className="button-border">
          <div
            className="button"
            role="button"
            tabIndex={0}
            onClick={handleClaimTokens}
            onKeyDown={() => {}}
          >
            <div className="gradient-button-text">Claim Tokens</div>
          </div>
        </div>
      </div>
    </>
  );

  const htmlWithdrawInvestment = (
    <>
      <div className="item">
        <div className="item-text-gradient" style={{ fontSize: 35, lineHeight: '45px' }}>
          Withdraw
        </div>
        {isPresaleClosed && !isPresaleSuccessful && (
          <div className="item-text-bold">Softcap limit not reached. Presale closed.</div>
        )}
        <div className="button-border">
          <div
            className="button"
            role="button"
            tabIndex={0}
            onClick={withdrawInvestment}
            onKeyDown={() => {}}
          >
            <div className="gradient-button-text">Withdraw investment</div>
          </div>
        </div>
      </div>
    </>
  );

  const htmlCancelPresale = (
    <>
      <div className="item">
        <div className="item-text-gradient" style={{ fontSize: 35, lineHeight: '45px' }}>
          Cancel presale
        </div>
        <div className="item-text-bold">Softcap limit not reached</div>
        <div className="button-border">
          <div
            className="button"
            role="button"
            tabIndex={0}
            onClick={cancelPresale}
            onKeyDown={() => {}}
          >
            <div className="gradient-button-text">Cancel</div>
          </div>
        </div>
      </div>
    </>
  );

  const htmlCollectFunds = (
    <>
      <div className="item">
        <div className="item-text-gradient" style={{ fontSize: 35, lineHeight: '45px' }}>
          Collect funds
        </div>
        <div className="button-border">
          <div
            className="button"
            role="button"
            tabIndex={0}
            onClick={collectFunds}
            onKeyDown={() => {}}
          >
            <div className="gradient-button-text">Collect</div>
          </div>
        </div>
      </div>
    </>
  );

  const htmlPresaleEnded = (
    <div className="container-presale-status">
      <div className="container-presale-status-inner">
        <div className="gradient-header">Presale ended</div>
      </div>
    </div>
  );

  const isUserCreator =
    userAddress && creator && creator.toLowerCase() === userAddress.toLowerCase();
  const isUserOwner = userAddress && owner && owner.toLowerCase() === userAddress.toLowerCase();
  const isUserTier = tier && tier !== '0';

  // ===================== Public presale ============================

  // Voting
  // console.log('Pool:', { myVote, isUserBalanceLtNeededToVote });
  const showHtmlVotingWillStart = !isCertified && isBeforeVotimgTime;
  const showHtmlVotingStarted = !isCertified && isVotingTime;
  const showHtmlYouNeed500LessToVote =
    !isCertified && isVotingTime && !isUserCreator && !myVote && isUserBalanceLtNeededToVote;
  const showHtmlVoting =
    !isCertified &&
    isVotingTime &&
    timeBeforeVoting &&
    !isUserCreator &&
    !myVote &&
    !isUserBalanceLtNeededToVote;
  const showHtmlYouVoted =
    !isCertified && isVotingTime && timeBeforeVoting && !isUserCreator && myVote;
  const showHtmlVotingIsNotSuccessfulForUser =
    !isCertified &&
    !isUserCreator &&
    (isRegistrationTime || isInvestmentTime || isPresaleClosed) &&
    !isVotingSuccessful;
  const showHtmlVotingIsNotSuccessfulAndPresaleIsClosedForCreator =
    !isCertified &&
    isUserCreator &&
    (isRegistrationTime || isInvestmentTime || isPresaleClosed) &&
    !isVotingSuccessful &&
    didCreatorCollectFee;
  // Collect fee (Claim refund)
  // Не набралось нужное количество голосов за или нет голосов вообще, создатель может забрать свои 1000$ и токены
  const showHtmlCollectFee =
    !isCertified &&
    isUserCreator &&
    !didCreatorCollectFee &&
    (isRegistrationTime || isInvestmentTime || isPresaleClosed) &&
    !isVotingSuccessful;
  // Softcap is not reached
  // This happens only when voting is successful
  const showHtmlPresaleIsNotSuccessfulAndIsClosedForUser =
    !isCertified &&
    !isUserCreator &&
    isPresaleClosed &&
    isVotingSuccessful &&
    !isPresaleSuccessful &&
    !didUserInvest;
  const showHtmlPresaleIsNotSuccessfulAndIsClosedForCreator =
    !isCertified &&
    isUserCreator &&
    isPresaleClosed &&
    isVotingSuccessful &&
    !isPresaleSuccessful &&
    cancelled;

  // Registration
  const showHtmlRegistrationWillStart = isBeforeRegistrationTime;
  const showHtmlRegistrationStarted = isRegistrationTime && isVotingSuccessful;
  const showHtmlRegistration =
    !isCertified &&
    tier &&
    !isUserCreator &&
    isUserTier &&
    isRegistrationTime &&
    timeBeforeRegistration &&
    isVotingSuccessful &&
    !isUserRegister;
  const showHtmlYouAreRegistered =
    !isCertified &&
    !isUserCreator &&
    isRegistrationTime &&
    timeBeforeRegistration &&
    isVotingSuccessful &&
    isUserRegister;

  // Investment
  const showHtmlYouNeedToBeRegisteredToInvest =
    !isCertified &&
    !isUserCreator &&
    isInvestmentTime &&
    isInvestStart &&
    isVotingSuccessful &&
    timeBeforeMyTier &&
    !isUserRegister;
  const showHtmlYourInvestment =
    !isCertified &&
    !isUserCreator &&
    (isInvestmentTime || isPresaleClosed) &&
    isInvestStart &&
    isVotingSuccessful &&
    isUserRegister &&
    !cancelled &&
    didUserInvest;
  const showHtmlInvestmentYourTierStarts =
    !isCertified &&
    !isUserCreator &&
    isInvestmentTime &&
    isInvestStart &&
    isVotingSuccessful &&
    isUserRegister &&
    !cancelled &&
    !isMyTierTime;
  const showHtmlInvestmentBuyTokens =
    !isCertified &&
    !isUserCreator &&
    isInvestmentTime &&
    isInvestStart &&
    isVotingSuccessful &&
    isUserRegister &&
    !cancelled &&
    isMyTierTime;
  const showHtmlInvestmentEndsForCreator =
    !isCertified && isUserCreator && isInvestmentTime && isVotingSuccessful;
  // Withdraw investment
  const showHtmlWithdrawInvestment =
    !isCertified && !isUserCreator && (isInvestmentTime || isPresaleClosed) && didUserInvest;
  // Cancel presale (Close presale)
  //   Создателем пресейла Cancel presale может использоваться в случае, если не набран софткап.
  //   В случае  ненабора голосов используется метод collect fee для того чтоб овнер пресейла мог вывести не только бабло в токенах, но и свои 1000$
  // Создатель может отменять ТОЛЬКО свой пресейл и ТОЛЬКО после инвеста, если не набран софткап
  const showHtmlCancelPresale =
    !isCertified && isUserCreator && isPresaleClosed && !isPresaleSuccessful && !cancelled;
  // Claim tokens
  // инвестор может (создатель не может) забрать токены после окончания пресейла и добавления ликвидности (если она есть)
  const showHtmlClaimTokens =
    !isCertified &&
    !isUserCreator &&
    isPresaleClosed &&
    !cancelled &&
    isPresaleSuccessful &&
    liquidityAdded; // todo: && didUserInvest ?
  // Collect funds raised
  // функция для создателя чтобы забрать заработанные средства (опять же после ликвидности и окончания пресейла)
  const showHtmlCollectFunds =
    !isCertified &&
    isUserCreator &&
    isPresaleClosed &&
    !cancelled &&
    isPresaleSuccessful &&
    liquidityAdded &&
    !didCreatorCollectFunds;

  // ===================== Certified presale ============================

  // Audit
  const showHtmlAuditApprovedPresaleWillStartIn =
    isCertified &&
    isWhitelist &&
    !isRegistrationTime &&
    !isInvestmentTime &&
    !isPresaleClosed &&
    approved &&
    timeBeforePresaleStart;
  const showHtmlAuditApprovedRegistrationWillStartIn =
    isCertified &&
    !isWhitelist &&
    !isRegistrationTime &&
    !isInvestmentTime &&
    !isPresaleClosed &&
    approved &&
    timeBeforeRegistration;
  const showHtmlAuditWillBeFinishedIn =
    isCertified &&
    !isRegistrationTime &&
    !isInvestmentTime &&
    !isPresaleClosed &&
    !approved &&
    timeBeforeAuditEnd;
  // Audit is not approved
  const showHtmlAuditIsNotApprovedForUserOnCertified =
    isCertified &&
    !isUserCreator &&
    (isRegistrationTime || isInvestmentTime || isPresaleClosed) &&
    !approved;
  const showHtmlAuditIsNotApprovedAndPresaleIsClosedForCreatorOnCertified =
    isCertified &&
    isUserCreator &&
    (isRegistrationTime || isInvestmentTime || isPresaleClosed) &&
    !approved &&
    didCreatorCollectFee;
  // Collect fee (Claim refund) when not approved
  // Сертифицированный пресейл не прошел аудит (то есть, не был аппрувнут админом платформы). Cоздатель может забрать свои 1000$ и токены
  const showHtmlCollectFeeOnCertified =
    isCertified &&
    isUserCreator &&
    !didCreatorCollectFee &&
    (isRegistrationTime || isInvestmentTime || isPresaleClosed) &&
    !approved;
  // Registration
  const showHtmlRegistrationOnCertified =
    isCertified &&
    tier &&
    !isUserCreator &&
    isUserTier &&
    isRegistrationTime &&
    timeBeforeRegistration &&
    approved &&
    !isWhitelist &&
    !isUserRegister;
  const showHtmlYouAreRegisteredOnCertified =
    isCertified &&
    !isUserCreator &&
    isRegistrationTime &&
    timeBeforeRegistration &&
    approved &&
    !isWhitelist &&
    isUserRegister;
  // Investment
  const showHtmlYouNeedToBeInTier4or5ToInvestOnCertified =
    isCertified &&
    !isUserCreator &&
    isInvestmentTime &&
    isInvestStart &&
    approved &&
    isWhitelist &&
    timeBeforeMyTier &&
    tier !== '4' &&
    tier !== '5';
  // console.log('Pool:', { isMyTierTime, isWhitelist, tier });
  const showHtmlInvestmentEndsForCreatorOnCertified =
    isCertified && isUserCreator && isInvestmentTime && approved;
  const showHtmlYouNeedToBeRegisteredToInvestOnCertified =
    isCertified &&
    !isUserCreator &&
    isInvestmentTime &&
    isInvestStart &&
    approved &&
    !isWhitelist &&
    timeBeforeMyTier &&
    !isUserRegister;
  const showHtmlInvestmentBuyTokensOnCertified =
    isCertified &&
    !isUserCreator &&
    isInvestmentTime &&
    isInvestStart &&
    approved &&
    !cancelled &&
    !isWhitelist &&
    isUserRegister &&
    isMyTierTime &&
    (isInvestmentForEverybodyTime ? true : tier === '1' || tier === '2' ? isUserWinner : true);
  // console.log('Pool:', { tier, isInvestmentTime });
  const showHtmlInvestmentBuyTokensOnCertifiedPrivate =
    isCertified &&
    !isUserCreator &&
    isInvestmentTime &&
    isInvestStart &&
    approved &&
    !cancelled &&
    isWhitelist &&
    isUserInWhitelist &&
    (tier === '5' || tier === '4');
  const showHtmlInvestmentYourTierStartsOnCertified =
    isCertified &&
    !isUserCreator &&
    isInvestmentTime &&
    isInvestStart &&
    approved &&
    !cancelled &&
    !isWhitelist &&
    isUserRegister &&
    !isMyTierTime;
  const showHtmlYourInvestmentOnCertified =
    isCertified &&
    !isUserCreator &&
    (isInvestmentTime || isPresaleClosed) &&
    isInvestStart &&
    approved &&
    isUserRegister &&
    // !cancelled && // убрано для случая, когда создатель нажал cancel, а инвестор еще не нажал withdraw
    didUserInvest;
  // Softcap is not reached
  // This happens only when audit is approved
  const showHtmlPresaleIsNotSuccessfulAndIsClosedForUserOnCertified =
    isCertified &&
    !isUserCreator &&
    approved &&
    isPresaleClosed &&
    !isPresaleSuccessful &&
    !didUserInvest;
  const showHtmlPresaleIsNotSuccessfulAndIsClosedForCreatorOnCertified =
    isCertified &&
    isUserCreator &&
    approved &&
    isPresaleClosed &&
    !isPresaleSuccessful &&
    cancelled;
  // Cancel presale (Close presale)
  // админом платформы может использоваться в любой момент.
  //   Овнером пресейла он может использоваться в случае, если не набран софткап.
  //   В случае  ненабора голосов используется метод collect fee для того чтоб овнер пресейла мог вывести не только бабло в токенах, но и свои 1000$
  // Создатель может отменять ТОЛЬКО свой пресейл и ТОЛЬКО после инвеста, если не набран софткап
  const showHtmlCancelPresaleOnCertified =
    isCertified && isUserCreator && isPresaleClosed && !isPresaleSuccessful && !cancelled;
  // Withdraw investment
  // Если пресейл завершился и не набрал софткап
  const showHtmlWithdrawInvestmentOnCertified =
    isCertified &&
    !isUserCreator &&
    (isInvestmentTime || isPresaleClosed) &&
    !isPresaleSuccessful &&
    didUserInvest;
  // Claim tokens
  // при успешном пресейле
  // Кнопка НЕ должна появляться у не-инвесторов и овнера пресейла
  const showHtmlClaimTokensOnCertified =
    isCertified &&
    !isUserCreator &&
    isPresaleClosed &&
    !cancelled &&
    isPresaleSuccessful &&
    didUserInvest &&
    isPresaleWithLiquidity &&
    liquidityAdded;
  // Кнопка НЕ должна появляться у не-инвесторов и овнера пресейла
  const showHtmlClaimTokensOnCertifiedWithLiquidity =
    isCertified &&
    !isUserCreator &&
    isPresaleClosed &&
    !cancelled &&
    isPresaleSuccessful &&
    didUserInvest &&
    !isPresaleWithLiquidity;
  // Collect funds raised
  // функция для создателя чтобы забрать заработанные средства (опять же после ликвидности и окончания пресейла) или (после окончания пресейла, который без добавлнеия ликвидности)
  const showHtmlCollectFundsOnCertified =
    isCertified &&
    isUserCreator &&
    isPresaleClosed &&
    !cancelled &&
    isPresaleSuccessful &&
    (liquidity ? liquidityAdded : true) &&
    !didCreatorCollectFunds;
  // Presale ended
  // Для всех. Для овнера - когда он сделал collect funds, для инвестора когда он сделал claim tokens, для всех кто не участвовал - показываем сразу после окончания пресейла
  const showHtmlPresaleEndedOnCertifiedForCreator =
    isCertified &&
    isUserCreator &&
    isPresaleClosed &&
    !cancelled &&
    isPresaleSuccessful &&
    (liquidity ? liquidityAdded : true) &&
    didCreatorCollectFunds;
  const showHtmlPresaleEndedOnCertifiedForInvestor =
    isCertified &&
    !isUserCreator &&
    isPresaleClosed &&
    !cancelled &&
    isPresaleSuccessful &&
    (liquidity ? liquidityAdded : true) &&
    didUserInvest;
  const showHtmlPresaleEndedOnCertifiedForUser =
    isCertified &&
    !isUserCreator &&
    isPresaleClosed &&
    !cancelled &&
    isPresaleSuccessful &&
    !didUserInvest;

  // Presale is private
  if (!isUserOwner && !isUserCreator && isCertified && isWhitelist && !userAddress)
    return (
      <div className="container" style={{ marginTop: 100, marginBottom: 200 }}>
        <div className="container-presale-status">
          <div className="container-presale-status-inner">
            <div className="gradient-header">This presale is private</div>
          </div>
        </div>
      </div>
    );
  if (!isUserOwner && !isUserCreator && isCertified && isWhitelist && !isUserInWhitelist)
    return (
      <div className="container" style={{ marginTop: 100, marginBottom: 200 }}>
        <div className="container-presale-status">
          <div className="container-presale-status-inner">
            <div className="gradient-header">This presale is private</div>
          </div>
        </div>
      </div>
    );

  if (token === '...')
    return (
      <div className="container" style={{ marginTop: 100, marginBottom: 200 }}>
        <div className="container-presale-status">
          <div className="container-presale-status-inner">
            <div className="gradient-header">Loading...</div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="container">
      <Helmet>
        <meta charSet="utf-8" />
        <title>{saleTitle || 'Pool'} | Lesspad</title>
        <meta name="description" content={`Presale Pool. ${saleTitle}. ${description}`} />
      </Helmet>

      {/*Title*/}
      <div className="preview">
        <div className="description">
          <div className="logo-center">
            <img src={logo || projectLogo} alt="token-logo" />
          </div>
          <div className="description-info">
            <div className="description-info-header">
              <span>{saleTitle}</span>
            </div>
            <div className="description-info-text">{description}</div>
            <div className="subscription">
              <a
                href={`${explorer}/address/${address}`}
                className="subscription-text"
                target="_blank"
                rel="noreferrer"
              >
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
            {+liquidityAllocationTime > 0
              ? dayjs(liquidityAllocationTime).format('MMMM DD, YYYY HH:mm A GMT')
              : 'soon'}
          </div>
        </div>
      </div>

      {/*Scale*/}
      <div className="grow">
        <div className="grow-text preview-info-date__text-opacity">
          {tokenPrice} {nativeTokenSymbol || currency} per {tokenSymbol}
        </div>
        <div className="grow-progress">
          <div>
            {raisedAmount || 0} {nativeTokenSymbol || currency} Raised
          </div>
          <div>{participants} Participants</div>
        </div>
        <div className="grow-scale">
          <div className="grow-scale-progress">
            <div
              className="grow-scale-progress-value"
              style={{
                width: `${
                  isCertified && isWhitelist
                    ? percentOfTokensSold
                    : percentageOfTokensSoldInCurrentTier
                }%`,
              }}
            />
          </div>
        </div>
        <div className="grow-info">
          <div className="grow-min">
            {((!isCertified && +hardCapInTokens !== tokensShouldBeSold) ||
              (isCertified && !isWhitelist && +hardCapInTokens !== tokensShouldBeSold)) && (
              <div>
                {tiers[+currentTier - 1] || 'Current'} stage completion{' '}
                {prettyNumber(percentageOfTokensSoldInCurrentTier.toString()) || 0}%
              </div>
            )}
            <div className="grow-total">
              Total completion {prettyNumber(percentOfTokensSold.toString()) || 0}%
            </div>
          </div>
          <div className="grow-max">
            {((!isCertified && +hardCapInTokens !== tokensShouldBeSold) ||
              (isCertified && !isWhitelist && +hardCapInTokens !== tokensShouldBeSold)) && (
              <div>
                {tokensSoldInCurrentTier || 0} /{' '}
                {prettyNumber(`${tokensShouldBeSold}`) || prettyNumber(hardCapInTokens)}{' '}
                {tokenSymbol}
              </div>
            )}
            <div className="grow-total">
              {raisedAmountInTokens || 0} / {prettyNumber(hardCapInTokens) || 0} {tokenSymbol}
            </div>
          </div>
        </div>
      </div>

      {/*Table*/}
      <div className="box">
        <div className="row row-items">
          {row1.map((item, i) => (
            <div key={uuid()} className={`${'item'} ${i % 2 !== 0 && 'cell'}`}>
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
            <div key={uuid()} className={`${'item'} ${i % 2 !== 0 && 'cell'}`}>
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
          {row3.map((item, i) => (
            <div key={uuid()} className={`${'item'} ${i % 2 !== 0 && 'cell'}`}>
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
      <YourTier tier={tier} className="tier-block" />

      {/*Your Investment*/}
      {isInfo && (
        <>
          <div className="container-header">Your Investment</div>
          {/*=============== Messages ===============*/}

          {/*=============== Public presale ================*/}

          {/*Voting*/}
          {showHtmlVotingWillStart && htmlVotingWillStart}
          {showHtmlVotingStarted && htmlVotingStarted}
          {showHtmlVotingIsNotSuccessfulForUser && htmlVotingIsNotSuccessfulForUser}
          {showHtmlVotingIsNotSuccessfulAndPresaleIsClosedForCreator &&
            htmlVotingIsNotSuccessfulAndPresaleIsClosedForCreator}
          {/*Registration*/}
          {showHtmlRegistrationWillStart && htmlRegistrationWillStart}
          {showHtmlRegistrationStarted && htmlRegistrationStarted}
          {/*Softcap is not reached*/}
          {showHtmlPresaleIsNotSuccessfulAndIsClosedForUser &&
            htmlPresaleIsNotSuccessfulAndIsClosedForUser}
          {showHtmlPresaleIsNotSuccessfulAndIsClosedForCreator &&
            htmlPresaleIsNotSuccessfulAndIsClosedForCreator}
          {/*Investment ends*/}
          {showHtmlInvestmentEndsForCreator && htmlInvestmentEnds}

          {/*=============== Certified presale ================*/}

          {/*Audit*/}
          {showHtmlAuditApprovedPresaleWillStartIn && htmlAuditApprovedPresaleWillStartIn}
          {showHtmlAuditApprovedRegistrationWillStartIn && htmlAuditApprovedRegistrationWillStartIn}
          {showHtmlAuditWillBeFinishedIn && htmlAuditWillBeFinishedIn}
          {/*Audit is not approved*/}
          {showHtmlAuditIsNotApprovedForUserOnCertified && htmlAuditIsNotApprovedForUserOnCertified}
          {showHtmlAuditIsNotApprovedAndPresaleIsClosedForCreatorOnCertified &&
            htmlAuditIsNotApprovedAndPresaleIsClosedForCreatorOnCertified}
          {/*Softcap is not reached*/}
          {showHtmlPresaleIsNotSuccessfulAndIsClosedForUserOnCertified &&
            htmlPresaleIsNotSuccessfulAndIsClosedForUser}
          {showHtmlPresaleIsNotSuccessfulAndIsClosedForCreatorOnCertified &&
            htmlPresaleIsNotSuccessfulAndIsClosedForCreator}
          {/*Investment ends*/}
          {showHtmlInvestmentEndsForCreatorOnCertified && htmlInvestmentEnds}
          {/*Presale ended*/}
          {showHtmlPresaleEndedOnCertifiedForCreator && htmlPresaleEnded}
          {showHtmlPresaleEndedOnCertifiedForInvestor && htmlPresaleEnded}
          {showHtmlPresaleEndedOnCertifiedForUser && htmlPresaleEnded}

          {/*=============== Buttons ===============*/}

          {openTimePresale !== '0' ? (
            <div className="box box-bg">
              <div className="row">
                {/*=============== Public presale ================*/}

                {/*Voting*/}
                {showHtmlYouNeed500LessToVote && htmlYouNeed500LessToVote}
                {showHtmlVoting && htmlVoting}
                {showHtmlYouVoted && htmlYouVoted}
                {/*Registration*/}
                {showHtmlCollectFee && htmlCollectFeeWhenVotingNotSuccessful}
                {showHtmlRegistration && htmlRegistration}
                {showHtmlYouAreRegistered && htmlYouAreRegistered}
                {/*Investment*/}
                {showHtmlYouNeedToBeRegisteredToInvest && htmlYouNeedToBeRegisteredToInvest}
                {showHtmlYourInvestment && htmlYourInvestment}
                {showHtmlInvestmentYourTierStarts && htmlInvestmentYourTierStarts}
                {showHtmlInvestmentBuyTokens ? htmlInvestmentBuyTokens : null}
                {/*Claim tokens*/}
                {showHtmlClaimTokens && htmlClaimTokens}
                {showHtmlCancelPresale && htmlCancelPresale}
                {/*Withdraw investment*/}
                {showHtmlWithdrawInvestment && htmlWithdrawInvestment}
                {/*Collect funds*/}
                {showHtmlCollectFunds && htmlCollectFunds}

                {/*=============== Certified presale ================*/}

                {/*Registration*/}
                {showHtmlRegistrationOnCertified && htmlRegistration}
                {showHtmlYouAreRegisteredOnCertified && htmlYouAreRegistered}
                {/*Investment*/}
                {showHtmlYouNeedToBeRegisteredToInvestOnCertified &&
                  htmlYouNeedToBeRegisteredToInvest}
                {showHtmlYouNeedToBeInTier4or5ToInvestOnCertified &&
                  htmlYouNeedToBeInTier4or5ToInvestOnCertified}
                {showHtmlInvestmentBuyTokensOnCertified && htmlInvestmentBuyTokens}
                {showHtmlInvestmentBuyTokensOnCertifiedPrivate && htmlInvestmentBuyTokens}
                {showHtmlInvestmentYourTierStartsOnCertified && htmlInvestmentYourTierStarts}
                {showHtmlYourInvestmentOnCertified && htmlYourInvestment}
                {/*Claim tokens*/}
                {showHtmlClaimTokensOnCertified && htmlClaimTokens}
                {showHtmlClaimTokensOnCertifiedWithLiquidity && htmlClaimTokens}
                {/*Cancel presale*/}
                {showHtmlCancelPresaleOnCertified && htmlCancelPresale}
                {/*Claim tokens*/}
                {showHtmlCollectFeeOnCertified && htmlCollectFeeWhenNotApproved}
                {/*Withdraw investment*/}
                {showHtmlWithdrawInvestmentOnCertified && htmlWithdrawInvestment}
                {/*Collect funds*/}
                {showHtmlCollectFundsOnCertified && htmlCollectFunds}
              </div>
            </div>
          ) : null}
        </>
      )}

      {/*Participants*/}
      <ParticipantsTable
        isPrivate={privatePresale}
        whitelist={whitelist}
        poolAddress={address}
        isCertified={isCertified}
      />

      {/*Important Links*/}
      <div className="container-header">Important Links</div>
      <div className="box">
        <div className="box-links">
          {links.map((item) => (
            <a
              key={uuid()}
              href={item.link}
              className="box-links-link"
              target="_blank"
              rel="noreferrer"
            >
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
                <a
                  key={uuid()}
                  href={addHttps(item.link)}
                  className="box-links-list-links-item"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={item.image} alt={`${item.image} icon`} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isCertified && (
        <>
          <div className="container-header">Audit</div>
          <div className="box box-bg">
            <div className="box-text">{approved ? 'Audited' : 'Not audited yet.'}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default memo(Pool);
