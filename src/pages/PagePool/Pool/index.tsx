import { setInterval } from 'timers';

import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { BigNumber as BN } from 'bignumber.js/bignumber';
import dayjs from 'dayjs';
import { v4 as uuid } from 'uuid';

import bnbLogo from '../../../assets/img/icons/bnb-logo.svg';
import ethLogo from '../../../assets/img/icons/eth-logo.svg';
import Github from '../../../assets/img/icons/gh-icon.svg';
import Link from '../../../assets/img/icons/link-icon.svg';
import maticLogo from '../../../assets/img/icons/matic-logo.svg';
import RegisterImg from '../../../assets/img/icons/register.svg';
import Subscribe from '../../../assets/img/icons/subscribe.svg';
import Telegram from '../../../assets/img/icons/tg-icon.svg';
import Twitter from '../../../assets/img/icons/twitter-icon.svg';
import projectLogo from '../../../assets/img/sections/token-card/logo-1.png';
import Input from '../../../components/Input';
import YourTier from '../../../components/YourTier/index';
import config from '../../../config';
import { useContractsContext } from '../../../contexts/ContractsContext';
import { useWeb3ConnectorContext } from '../../../contexts/Web3Connector';
import { modalActions } from '../../../redux/actions';
import { BackendService } from '../../../services/Backend';
import { convertFromWei } from '../../../utils/ethereum';
import { addHttps, prettyNumber } from '../../../utils/prettifiers';
import ParticipantsTable from '../ParticipantsTable';

import './index.scss';

const { chainSymbols, explorers, NOW, REGISTRATION_TIME, TIER_TIME }: any = config;
const Backend = new BackendService();

const chainsInfo: any = [
  { key: 'Ethereum', title: 'Ethereum', symbol: 'ETH', logo: ethLogo },
  { key: 'Binance-Smart-Chain', title: 'Binance Smart Chain', symbol: 'BNB', logo: bnbLogo },
  { key: 'Matic', title: 'Polygon (Matic)', symbol: 'MATIC', logo: maticLogo },
];

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

const Pool: React.FC = () => {
  const { address }: any = useParams();
  const history = useHistory();

  const { web3 } = useWeb3ConnectorContext();
  const {
    ContractERC20,
    ContractPresalePublicWithMetamask,
    ContractPresalePublic,
    ContractPresaleCertified,
    ContractLessToken,
    ContractStaking,
  } = useContractsContext();

  const [info, setInfo] = useState<any>(defaultInfo);

  const [isCertified, setIsCertified] = useState<boolean>();
  const [chainInfo, setChainInfo] = useState<any>({});
  const [tier, setTier] = React.useState<string>('');
  const [isMyTierTime, setIsMyTierTime] = useState<boolean>(false);

  // const [logo, setLogo] = React.useState<string>(projectLogo);

  const [lessDecimals, setLessDecimals] = useState<number>();
  // const [lpDecimals, setLpDecimals] = useState<number>();
  const [tokenDecimals, setTokenDecimals] = useState<number>(0);

  const [investments, setInvestments] = useState<any>({ amountEth: 0, amountTokens: 0 });
  const [amountToInvest, setAmountToInvest] = useState<string>('');
  const [myVote, setMyVote] = useState<number>(0);
  const [isInvestStart, setInvestStart] = useState<boolean>(false);
  const [isUserRegister, setUserRegister] = useState<boolean>(false);
  // console.log('Pool isUserRegister:', isUserRegister);

  const [timeBeforeVoting, setTimeBeforeVoting] = useState<string>('');
  const [timeBeforeRegistration, setTimeBeforeRegistration] = useState<string>('');
  const [timeBeforeMyTier, setTimeBeforeMyTier] = useState<string>('');

  const { pools } = useSelector(({ pool }: any) => pool);
  const { chainType } = useSelector(({ wallet }: any) => wallet);
  const { address: userAddress } = useSelector(({ user }: any) => user);
  const { stakedLess, stakedLp, lessPerLp } = useSelector(({ library }: any) => library);

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
    tokensForSaleLeft,
    // tokensForLiquidityLeft,
    openTimePresale,
    closeTimePresale,
    openTimeVoting,
    closeTimeVoting,
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
    cancelled,
    liquidityAdded,
    participants,
    // raisedAmount,
    yesVotes,
    noVotes,
    lastTotalStakedAmount,
  } = info;

  const isBeforeVotimgTime = openTimeVoting > NOW;
  const isVotingTime = openTimeVoting <= NOW && closeTimeVoting > NOW;
  const isBeforeRegistrationTime =
    openTimeVoting <= NOW && openTimePresale - REGISTRATION_TIME > NOW;
  const isRegistrationTime = openTimePresale - REGISTRATION_TIME <= NOW && openTimePresale > NOW;
  const isInvestmentTime = openTimePresale <= NOW && closeTimePresale > NOW;
  const isOpened = openTimePresale <= NOW;
  const isPresaleClosed = closeTimePresale <= NOW;

  const isUserCreator = userAddress ? creator.toLowerCase() === userAddress.toLowerCase() : false;

  const isEthereum = chainType === 'Ethereum';
  const isBinanceSmartChain = chainType === 'Binance-Smart-Chain';

  const exchange = isEthereum ? 'Uniswap' : isBinanceSmartChain ? 'PancakeSwap' : 'SushiSwap';

  const stakedLessAndLp = useMemo(() => {
    if (!lessPerLp) return 0;
    return stakedLess + stakedLp * lessPerLp;
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

  const tokensSold = useMemo(() => {
    const tokensSoldNew = new BN(beginingAmount).minus(tokensForSaleLeft);
    // const pow = new BN(10).pow(tokenDecimals);
    // const result = tokensSoldNew.div(pow);
    return tokensSoldNew.toString(10);
  }, [beginingAmount, tokensForSaleLeft]);

  const tokensSoldInNativeCurrency = useMemo(() => {
    const tokensSoldNew = new BN(beginingAmount).minus(tokensForSaleLeft);
    const tokenPriceBN = new BN(tokenPrice);
    // const pow = new BN(10).pow(tokenDecimals);
    const result = tokensSoldNew.multipliedBy(tokenPriceBN);
    return result.toString(10);
  }, [beginingAmount, tokensForSaleLeft, tokenPrice]);

  const percentOfTokensSold = useMemo(() => {
    const minus = new BN(beginingAmount).minus(tokensForSaleLeft);
    return minus.div(beginingAmount).multipliedBy(new BN(100)).toString(10);
  }, [beginingAmount, tokensForSaleLeft]);

  const percentOfSoftCap = useMemo(() => {
    return new BN(softCap).div(hardCap).multipliedBy(new BN(100)).toString(10);
  }, [softCap, hardCap]);

  const isPresaleSuccessful = +percentOfSoftCap >= 100;

  const currency = chainSymbols[chainType];
  const explorer = explorers[chainType];

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

  // const getImage = useCallback(async () => {
  //   try {
  //     const { linkLogo } = info;
  //     const result = await axios.get(linkLogo);
  //     console.log('Pool getImage:', result);
  //     if (!result.data) return;
  //     setLogo(result.data);
  //     return;
  //   } catch (e) {
  //     console.error('Pool getImage:', e);
  //   }
  // }, [info]);

  const updateTimerBeforeVoting = useCallback(() => {
    try {
      if (openTimeVoting === '0') return;
      if (openTimePresale === '0') return;
      const newTimeBeforeVoting = dayjs(openTimeVoting).fromNow();
      setTimeBeforeVoting(newTimeBeforeVoting);
      const openRegistrationTime = openTimePresale - REGISTRATION_TIME;
      const newTimeBeforeRegistration = dayjs(openRegistrationTime).fromNow();
      setTimeBeforeRegistration(newTimeBeforeRegistration);
    } catch (e) {
      console.error(e);
    }
  }, [openTimeVoting, openTimePresale]);

  const getTokenDecimals = useCallback(async () => {
    try {
      if (!info) return;
      const resultTokenDecimals = await ContractERC20.decimals({ contractAddress: token });
      setTokenDecimals(resultTokenDecimals);
    } catch (e) {
      console.error(e);
    }
  }, [info, ContractERC20, token]);

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

  const getChainInfo = useCallback(() => {
    try {
      const chainInfoNew = chainsInfo.filter((item: any) => item.key === chainType);
      setChainInfo(chainInfoNew[0]);
    } catch (e) {
      console.error(e);
    }
  }, [chainType]);

  const getInfo = useCallback(async () => {
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
  }, [ContractPresaleCertified, ContractPresalePublic, address, isCertified]);

  const getMyVote = useCallback(async () => {
    try {
      const resultVote = await ContractPresalePublic.getMyVote(address, userAddress);
      setMyVote(+resultVote);
    } catch (e) {
      console.error(e);
    }
  }, [address, userAddress, ContractPresalePublic]);

  const getInvestments = useCallback(async () => {
    try {
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
        console.log('PagePool vote:', resultVote);
        await getMyVote();
        await getInfo();
      } catch (e) {
        console.error('PagePool vote:', e);
      }
    },
    [ContractPresalePublicWithMetamask, address, getInfo, getMyVote, loginToBackend, userAddress],
  );

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
      const amountToInvestInWei = new BN(amountToInvest)
        .multipliedBy(new BN(10).pow(new BN(tokenDecimals)))
        .toString(10);
      const resultGetTierSignature = await Backend.getTierSignature({
        token: key,
        presale: address,
      });
      console.log('PagePool resultGetTierSignature:', resultGetTierSignature);
      // const userBalance = new BN(`${user_balance}`).toString(10);
      if (!resultGetTierSignature.data) return;
      const resultVote = await ContractPresalePublicWithMetamask.invest({
        userAddress,
        contractAddress: address,
        amount: amountToInvestInWei,
        userBalance,
        signature,
        timestamp,
        poolPercentages,
        stakingTiers,
      });
      console.log('PagePool invest:', resultVote);
    } catch (e) {
      console.error('PagePool invest:', e);
    }
  }, [
    amountToInvest,
    ContractPresalePublicWithMetamask,
    address,
    tokenDecimals,
    loginToBackend,
    userAddress,
  ]);

  const getUserRegister = useCallback(async () => {
    try {
      const resultRegister = await ContractPresalePublic.getUserRegister(address, userAddress);
      setUserRegister(resultRegister);
    } catch (e) {
      console.error(e);
    }
  }, [userAddress, ContractPresalePublic, address]);

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
      const resultVote = await ContractPresalePublicWithMetamask.register({
        userAddress,
        contractAddress: address,
        tier: userTier,
        signature,
        stakedAmount: userBalance,
        timestamp,
      });
      console.log('PagePool resultVote:', resultVote);
    } catch (e) {
      console.error('PagePool register:', e);
    }
  }, [ContractPresalePublicWithMetamask, ContractStaking, address, userAddress, toggleModal, web3]);

  const getDecimals = useCallback(async () => {
    try {
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

  const getTierTime = useCallback(async () => {
    try {
      if (!info) return;
      if (!tier) return;
      // console.log('PagePool getTierTime:', tier);
      if (openTimePresale === '0') return;
      if (closeTimePresale === '0') return;
      const tierTimeNew = +openTimePresale + TIER_TIME * (5 - +tier);
      const isMyTierTimeNew = isInvestmentTime && tierTimeNew <= NOW;
      const timeBeforeMyTierNew = dayjs(tierTimeNew).fromNow();
      setIsMyTierTime(isMyTierTimeNew);
      setTimeBeforeMyTier(timeBeforeMyTierNew);
    } catch (e) {
      console.error(e);
    }
  }, [tier, info, openTimePresale, closeTimePresale, isInvestmentTime]);

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

  const cancelPresale = useCallback(async () => {
    try {
      const resultCancelPresale = await ContractPresalePublicWithMetamask.cancelPresale({
        userAddress,
        contractAddress: address,
      });
      console.log('PagePool cancelPresale:', resultCancelPresale);
    } catch (e) {
      console.error(e);
    }
  }, [ContractPresalePublicWithMetamask, address, userAddress]);

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

  const handleClaimTokens = useCallback(async () => {
    try {
      const resultClaimTokens = await ContractPresalePublicWithMetamask.claimTokens({
        userAddress,
        contractAddress: address,
      });
      console.log('PagePool resultClaimTokens:', resultClaimTokens);
    } catch (e) {
      console.error('PagePool resultClaimTokens:', e);
    }
  }, [ContractPresalePublicWithMetamask, userAddress, address]);

  const withdrawInvestment = useCallback(async () => {
    try {
      const resultClaimTokens = await ContractPresalePublicWithMetamask.withdrawInvestment({
        userAddress,
        contractAddress: address,
      });
      console.log('PagePool withdrawInvestment:', resultClaimTokens);
    } catch (e) {
      console.error('PagePool withdrawInvestment:', e);
    }
  }, [ContractPresalePublicWithMetamask, userAddress, address]);

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

  // useEffect(() => {
  //   if (!info) return () => {};
  //   getImage();
  // }, [info, getImage]);

  useEffect(() => {
    if (!info) return () => {};
    updateTimerBeforeVoting();
    const interval = setInterval(() => updateTimerBeforeVoting(), 3000);
    return () => {
      clearInterval(interval);
    };
  }, [info, updateTimerBeforeVoting]);

  useEffect(() => {
    if (!info) return;
    if (!userAddress) return;
    if (!ContractLessToken) return;
    if (!ContractERC20) return;
    // getDecimals();
    getTokenDecimals();
  }, [ContractLessToken, userAddress, info, getTokenDecimals, ContractERC20]);

  useEffect(() => {
    if (!chainType) return;
    getChainInfo();
  }, [chainType, getChainInfo]);

  useEffect(() => {
    if (!pools || !pools.length) return;
    getIsCertified(address);
  }, [pools, address, getIsCertified]);

  useEffect(() => {
    if (!ContractPresalePublic) return;
    if (!ContractPresaleCertified) return;
    if (isCertified === undefined) return;
    getInfo();
  }, [ContractPresalePublic, ContractPresaleCertified, isCertified, getInfo]);

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
      getMyVote();
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
    if (!info) return () => {};
    getPoolStatus();
    const interval = setInterval(() => {
      getPoolStatus();
    }, 10000);
    return () => clearInterval(interval);
  }, [getPoolStatus, info]);

  useEffect(() => {
    if (ContractPresalePublic && address && userAddress) {
      getUserRegister();
    }
  }, [getUserRegister, ContractPresalePublic, address, userAddress]);

  const row1 = [
    {
      header: 'Softcap',
      value: `${softCap} ${currency}`,
      gradient: true,
      less: false,
    },
    {
      header: 'Presale Rate',
      value: `${tokenPrice} ${currency}`,
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
      value: `${hardCap} ${currency}`,
      gradient: true,
      less: false,
    },
    {
      header: `${exchange} Listing Rate`,
      value: `${listingPrice} ${currency}`,
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
      header: 'Voting completion',
      value: lastTotalStakedAmount === '0' ? '0%' : `${prettyNumber(votingCompletion)}%`,
      gradient: +votingCompletion === 100,
      less: false,
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

  const htmlYouVoted = (
    <div className="item">
      <div className="item-text-gradient" style={{ fontSize: 35, lineHeight: '45px' }}>
        Voting
      </div>
      <div className="item-text">You voted</div>
    </div>
  );

  const htmlVoting = (
    <div className="item">
      <div className="item-text-gradient" style={{ fontSize: 35, lineHeight: '45px' }}>
        Voting
      </div>
      <div className="item-text">
        <div className="item-text-bold">{prettyNumber(stakedLessAndLp)}</div>
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

  const htmlVotingIsNotSuccessful = (
    <div className="item">
      <div className="item-text-gradient" style={{ fontSize: 35, lineHeight: '45px' }}>
        Voting
      </div>
      <div className="item-text">
        <div className="item-text-bold">is not successful</div>
      </div>
    </div>
  );

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

  const htmlYouNeedToBeRegisteredToInvest = (
    <div className="item">
      <div className="item-text-gradient" style={{ fontSize: 35, lineHeight: '45px' }}>
        Investment
      </div>
      <div className="item-text">You need to be registered on presale to invest</div>
    </div>
  );

  const htmlInvestment = (
    <>
      <div className="item">
        Your {currency} Investment
        <div className="item-text">
          <div className="item-text-bold">
            {investments.amountEth} {currency}
          </div>
        </div>
      </div>
      {isMyTierTime ? (
        <div className="item">
          Buy Tokens
          <div className="item-text">
            <div className="item-text-bold">
              1 {tokenSymbol} = {tokenPrice} {currency}
            </div>
          </div>
          <p>Please, enter amount to invest (in ether)</p>
          <Input
            title=""
            value={amountToInvest}
            onChange={setAmountToInvest}
            style={{ marginBottom: 10 }}
          />
          <div className="button-border" style={{ margin: '5px 0' }}>
            <div
              className="button"
              role="button"
              tabIndex={0}
              onClick={invest}
              onKeyDown={() => {}}
            >
              <div className="gradient-button-text">Invest</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="item">
          Buy Tokens
          <div className="item-text">
            <div className="item-text-bold">Your tier invest time starts {timeBeforeMyTier}</div>
          </div>
        </div>
      )}
    </>
  );

  const htmlInvestmentIsClosed = (
    <div className="item">
      <div className="item-text-gradient" style={{ fontSize: 35, lineHeight: '45px' }}>
        Investment
      </div>
      <div className="item-text">Is closed</div>
    </div>
  );

  const htmlClaimTokens = (
    <>
      <div className="item">
        Your Tokens
        <div className="item-text">
          <div className="item-text-bold">{investments.amountTokens}</div>
          <div className="item-text-gradient">{tokenSymbol}</div>
        </div>
        {/*<div className="item-count">$13,780,000 USD</div>*/}
        <div className="button-border">
          <div
            className="button"
            role="button"
            tabIndex={0}
            onClick={handleClaimTokens}
            onKeyDown={() => {}}
          >
            <div className="gradient-button-text">Claim Token</div>
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
        <div className="item-text">Presale is not successful</div>
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

  const htmlClosePresale = (
    <>
      <div className="item">
        <div className="item-text-gradient" style={{ fontSize: 35, lineHeight: '45px' }}>
          Close presale
        </div>
        <div className="button-border">
          <div
            className="button"
            role="button"
            tabIndex={0}
            onClick={cancelPresale}
            onKeyDown={() => {}}
          >
            <div className="gradient-button-text">Close</div>
          </div>
        </div>
      </div>
    </>
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
            <img src={linkLogo ? addHttps(linkLogo) : projectLogo} alt="token-logo" />
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
          {tokenPrice} {chainInfo.symbol} per {tokenSymbol}
        </div>
        <div className="grow-progress">
          <div>
            {tokensSoldInNativeCurrency || 0} {chainInfo.symbol} Raised
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
            {prettyNumber(percentOfTokensSold.toString()) || 0}% (Min{' '}
            {!Number.isNaN(+percentOfSoftCap) ? percentOfSoftCap : 0}%)
          </div>
          <div className="grow-max">
            {tokensSold || 0} / {prettyNumber(hardCapInTokens) || 0} {tokenSymbol}
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
      <div className="container-header">Your Investment</div>

      {isBeforeVotimgTime ? (
        <div className="container-presale-status">
          <div className="container-presale-status-inner">
            <div className="gradient-header">Voting will start</div>
            <div className="presale-status-text">{timeBeforeVoting}</div>
          </div>
        </div>
      ) : isVotingTime ? (
        <div className="container-presale-status">
          <div className="container-presale-status-inner">
            <div className="gradient-header">Voting started</div>
            <div className="presale-status-text">{timeBeforeVoting}</div>
          </div>
        </div>
      ) : null}

      {isBeforeRegistrationTime ? (
        <div className="container-presale-status">
          <div className="container-presale-status-inner">
            <div className="gradient-header">Registration will start</div>
            <div className="presale-status-text">{timeBeforeRegistration}</div>
          </div>
        </div>
      ) : isRegistrationTime ? (
        <div className="container-presale-status">
          <div className="container-presale-status-inner">
            <div className="gradient-header">Registration started</div>
            <div className="presale-status-text">{timeBeforeRegistration}</div>
          </div>
        </div>
      ) : null}

      {openTimePresale !== '0' ? (
        <div className="box box-bg">
          <div className="row">
            {!isCertified &&
              isVotingTime &&
              timeBeforeVoting &&
              !isUserCreator &&
              (!myVote ? htmlVoting : htmlYouVoted)}

            {isRegistrationTime && timeBeforeRegistration
              ? isVotingSuccessful
                ? isUserRegister
                  ? htmlYouAreRegistered
                  : !isUserCreator
                  ? htmlRegistration
                  : null
                : htmlVotingIsNotSuccessful
              : null}

            {isInvestmentTime && isInvestStart && isVotingSuccessful && timeBeforeMyTier
              ? isUserRegister
                ? !isUserCreator
                  ? htmlInvestment
                  : null
                : htmlYouNeedToBeRegisteredToInvest
              : isPresaleClosed
              ? htmlInvestmentIsClosed
              : null}

            {isPresaleClosed && !cancelled && liquidityAdded
              ? !isUserCreator
                ? htmlClaimTokens
                : null
              : null}

            {isUserCreator && !liquidityAdded ? htmlClosePresale : null}

            {isUserCreator
              ? isPresaleClosed
                ? cancelled
                  ? null
                  : isPresaleSuccessful
                  ? null
                  : null
                : null
              : null}

            {isPresaleClosed
              ? cancelled
                ? htmlWithdrawInvestment
                : isPresaleSuccessful
                ? null
                : htmlWithdrawInvestment
              : null}
          </div>
        </div>
      ) : null}

      {/*Participants*/}
      <ParticipantsTable poolAddress={address} />

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

      <div className="container-header">Audit</div>
      <div className="box box-bg">
        <div className="box-text">{approved ? 'Audited' : 'Not audited yet.'}</div>
      </div>
    </div>
  );
};

export default memo(Pool);
