import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { BigNumber as BN } from 'bignumber.js/bignumber';

import Button from '../../components/Button';
import Checkbox from '../../components/Checkbox/index';
import DateInput from '../../components/DateInput';
import Input from '../../components/Input/index';
import config from '../../config';
import { useContractsContext } from '../../contexts/ContractsContext';
import { useWeb3ConnectorContext } from '../../contexts/Web3Connector';
import { libraryActions, modalActions } from '../../redux/actions';
import { BackendService } from '../../services/Backend';
import { convertFromWei, convertToWei } from '../../utils/ethereum';
import { prettyNumber } from '../../utils/prettifiers';

import s from './CreatePool.module.scss';

const Backend = new BackendService();
const { SHOW_FORM_VALUES, NOW, DAY, TIER_TIME, VOTING_TIME } = config;

const checkIfExists = (value: any) => value;
const checkPercentage = (value: number) => value >= 0 && value <= 100;
const checkDuration = (value: number) => value >= 30;
const checkGt0 = (value: number) => value > 0;

const messageEnterValue = 'Enter value';
const messagePercentValue = 'Percent value should be between 0 and 100';
const messageMin30Days = 'Minimum 30 days';
const messageAddressIsNotValid = 'Address is not valid';
const messageSoftCapLessThanHardCap = 'Softcap should be less than hardcap';
const messageGt0 = 'Value should be greater than 0';

const validationIfExists = [
  {
    equation: checkIfExists,
    message: messageEnterValue,
  },
];
const validationPercentage = [
  {
    equation: checkPercentage,
    message: messagePercentValue,
  },
];
const validationOfDuration = [
  {
    equation: checkDuration,
    message: messageMin30Days,
  },
];
const validationGt0 = [
  {
    equation: checkGt0,
    message: messageGt0,
  },
];

const CreatePoolPage: React.FC = () => {
  const { web3 } = useWeb3ConnectorContext();
  const {
    ContractERC20,
    ContractCalculations,
    ContractPresaleFactory,
    ContractLessToken,
    ContractLPToken,
    ContractStaking,
    ContractLessLibrary,
  } = useContractsContext();

  const min5 = 1000 * 60 * 5;
  const defaultOpenVotingTime = NOW + min5; // todo: next block time
  const votingDuration = VOTING_TIME; // todo
  const registerDuration = DAY; // todo
  const defaultOpenTime = defaultOpenVotingTime + votingDuration + registerDuration; // todo
  const defaultCloseTime = defaultOpenTime + TIER_TIME * 5; // todo
  const defaultLiquidityAllocationTime = defaultCloseTime + DAY; // todo

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lessDecimals, setLessDecimals] = useState<number>(0);
  const [lpDecimals, setLpDecimals] = useState<number>(0);

  const [stakedLess, setStakedLess] = useState<string>('0.000');
  const [stakedLP, setStakedLP] = useState<string>('0.000');

  const [saleTitle, setSaleTitle] = useState<string>(SHOW_FORM_VALUES ? 'Title' : '');
  const [description, setDescription] = useState<string>(SHOW_FORM_VALUES ? 'Description' : '');
  const [tokenAddress, setTokenAddress] = useState<string>(
    SHOW_FORM_VALUES ? '0x3561A02e1192B89e2415724f43521f898e867013' : '',
  );
  const [tokenPrice, setTokenPrice] = useState<string>(SHOW_FORM_VALUES ? '0.001' : '');
  // инпуты для Public type
  const [softCap, setSoftCap] = useState<string>(SHOW_FORM_VALUES ? '0.1' : '');
  const [hardCap, setHardCap] = useState<string>(SHOW_FORM_VALUES ? '0.2' : '');
  const [openVotingTime, setOpenVotingTime] = useState<number>(defaultOpenVotingTime);
  const [openTime, setOpenTime] = useState<number>(defaultOpenTime);
  const [closeTime, setCloseTime] = useState<number>(defaultCloseTime);
  const [liquidityPercentageAllocation, setLiquidityPercentageAllocation] = useState<string>(
    SHOW_FORM_VALUES ? '10' : '',
  );
  const [listingPrice, setListingPrice] = useState<string>(SHOW_FORM_VALUES ? '0.001' : '');
  const [lpTokensLockDurationInDays, setLpTokensLockDurationInDays] = useState(
    SHOW_FORM_VALUES ? '31' : '',
  );
  const [vestingPercent, setVestingPercent] = useState<string>(SHOW_FORM_VALUES ? '0' : '');
  const [liquidityAllocationTime, setLiquidityAllocationTime] = useState<number>(
    defaultLiquidityAllocationTime,
  );
  // инпут для Certified type
  const [whitelist1, setWhitelist1] = useState<string>('');
  const [whitelist2, setWhitelist2] = useState<string>('');
  const [whitelist3, setWhitelist3] = useState<string>('');
  const [whitelist4, setWhitelist4] = useState<string>('');
  const [whitelist5, setWhitelist5] = useState<string>('');
  const [nativeToken, setNativeToken] = useState<string>('WETH');
  // links
  const [linkLogo, setLinkLogo] = useState<string>('');
  const [linkWebsite, setLinkWebsite] = useState<string>('');
  const [linkTelegram, setLinkTelegram] = useState<string>('');
  const [linkGithub, setLinkGithub] = useState<string>('');
  const [linkTwitter, setLinkTwitter] = useState<string>('');
  const [whitepaper, setWhitepaper] = useState<string>('');
  // чекбоксы
  const [presaleType, setPresaleType] = useState<string>('Public');
  const [liquidity, setLiquidity] = useState<string>('Liquidity');
  const [automatically, setAutomatically] = useState<string>('Automatically');
  const [vesting, setVesting] = useState<string>('Vesting');
  const [whiteListed, setWhiteListed] = useState<string>('Whitelist');
  // const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);

  const [usdtToEthFee, setUsdtToEthFee] = useState<string>();
  const [errors, setErrors] = useState<any>({});

  const isPublic = presaleType === 'Public';
  const isLiquidity = liquidity === 'Liquidity';
  const isAutomatically = automatically === 'Automatically';
  const isVesting = vesting === 'Vesting';
  const isWhiteListed = whiteListed === 'Whitelist';

  const { chainType } = useSelector(({ wallet }: any) => wallet);
  const { address: userAddress } = useSelector(({ user }: any) => user);
  const { minCreatorStakedBalance } = useSelector(({ library }: any) => library);

  const dispatch = useDispatch();
  const toggleModal = React.useCallback((params) => dispatch(modalActions.toggleModal(params)), [
    dispatch,
  ]);
  const setLibrary = React.useCallback((params) => dispatch(libraryActions.setLibrary(params)), [
    dispatch,
  ]);

  // const minInvest = new BN(10).pow(new BN(10)).toString(10); // todo
  // const maxInvest = new BN(10).pow(new BN(20)).toString(10); // todo
  // const presaleType = isPublic ? 1 : 0;
  // const whitelistArray = whitelist ? whitelist.split(',') : [];

  const splitWhitelist = (data: string) => {
    try {
      const whitelistArray = data.split(',');
      const newWhitelistArray = whitelistArray.map((item: string) => item.trim());
      return newWhitelistArray;
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  const getDecimals = async () => {
    try {
      const resultLessDecimals = await ContractLessToken.decimals();
      setLessDecimals(resultLessDecimals);
      const resultLpDecimals = await ContractLPToken.decimals();
      setLpDecimals(resultLpDecimals);
    } catch (e) {
      console.error(e);
    }
  };

  const getMinCreatorStakedBalance = async () => {
    try {
      const resultGetMinCreatorStakedBalance = await ContractLessLibrary.getMinCreatorStakedBalance();
      setLibrary({ minCreatorStakedBalance: resultGetMinCreatorStakedBalance });
    } catch (e) {
      console.error(e);
    }
  };

  const getUsdtFeeForCreation = async () => {
    try {
      const resultUsdtToEthFee = await ContractCalculations.usdtToEthFee();
      setUsdtToEthFee(resultUsdtToEthFee);
      console.log('PageCreatePool getUsdtFeeForCreation:', resultUsdtToEthFee);
    } catch (e) {
      console.error(e);
    }
  };

  const fieldsMustExist = {
    saleTitle,
    description,
    tokenAddress,
    tokenPrice,
    softCap,
    hardCap,
    openTime,
    closeTime,
    listingPrice,
    liquidityPercentageAllocation,
    lpTokensLockDurationInDays,
    // linkTelegram,
    // linkGithub,
    // linkTwitter,
    // linkWebsite,
    // linkLogo,
    // whitepaper,
  };

  const clearErrors = () => {
    try {
      const newErrors = {};
      const entries = Object.entries(fieldsMustExist);
      for (let i = 0; i < entries.length; i += 1) {
        const [variableName, variable] = entries[i];
        if (variable) {
          newErrors[variableName] = variable && '';
        }
      }
      setErrors({ ...errors, ...newErrors });
    } catch (e) {
      console.error(e);
    }
  };

  const validateFormForExistingValues = () => {
    try {
      const newErrors = {};
      const entries = Object.entries(fieldsMustExist);
      for (let i = 0; i < entries.length; i += 1) {
        const [variableName, variable] = entries[i];
        newErrors[variableName] = !checkIfExists(variable) && messageEnterValue;
      }
      setErrors({ ...errors, ...newErrors });
      for (let i = 0; i < entries.length; i += 1) {
        const [, variable] = entries[i];
        if (!variable) return false;
      }
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const validateSoftCapAndHardCap = () => {
    try {
      const isSoftCapLessThanHardCap = +softCap < +hardCap;
      const messageIfIsSoftCapLessThanHardCap =
        !isSoftCapLessThanHardCap && messageSoftCapLessThanHardCap;
      const newErrors = {
        softCap: messageIfIsSoftCapLessThanHardCap,
        hardCap: messageIfIsSoftCapLessThanHardCap,
      };
      setErrors({ ...errors, ...newErrors });
      if (!isSoftCapLessThanHardCap) return false;
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const validateFormValues = () => {
    try {
      const isSoftCapLessThan0 = +softCap < 0;
      const isHardCapLessThan0 = +hardCap < 0;
      const isSoftCapLessThanHardCap = +softCap < +hardCap;
      const messageIfIsSoftCapLessThanHardCap =
        !isSoftCapLessThanHardCap && messageSoftCapLessThanHardCap;
      const messageIfIsSoftCapLessThan0 = !isSoftCapLessThan0 && messageGt0;
      const messageIfIsHardCapLessThan0 = !isHardCapLessThan0 && messageGt0;
      const newErrors = {
        softCap: messageIfIsSoftCapLessThanHardCap || messageIfIsSoftCapLessThan0,
        hardCap: messageIfIsSoftCapLessThanHardCap || messageIfIsHardCapLessThan0,
      };
      setErrors({ ...errors, ...newErrors });
      if (!checkPercentage(+liquidityPercentageAllocation)) return false;
      if (!checkDuration(+lpTokensLockDurationInDays)) return false;
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const validateAddresses = async () => {
    try {
      if (!web3) return false;
      const isTokenAddressValid = await web3.isAddress(tokenAddress);
      const messageIfEnterValue = !tokenAddress && messageEnterValue;
      const messageIfAddressNotValid = !isTokenAddressValid && messageAddressIsNotValid;
      const newErrors = {
        tokenAddress: messageIfEnterValue || messageIfAddressNotValid,
      };
      setErrors({ ...errors, ...newErrors });
      if (!isTokenAddressValid) return false;
      if (!isPublic) {
        //
      }
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const validateTime = () => {
    return true; // todo: remove!!!
    // checks
    // todo block timestamp
    const isOpenVotingTimeMoreThanBlockTimestamp = openTime > Date.now();
    // todo add getVotingTime from contract, check ms/s
    const isOpenVotingTimePlus24HLessThanOpenTime =
      openVotingTime + 600 * 1000 + 86400 * 1000 < openTime;
    const isOpenTimeLessThanCloseTime = openTime < closeTime;
    const isCloseTimeLessThanLiquidityAllocationTime = closeTime < liquidityAllocationTime;
    // messages
    const messageIsOpenVotingTimeMoreThanBlockTimestamp =
      !isOpenVotingTimeMoreThanBlockTimestamp &&
      'Open voting time should be more than last block time';
    const messageIsOpenVotingTimePlus24HLessThanOpenTime =
      !isOpenVotingTimePlus24HLessThanOpenTime &&
      'Open time should be less or equal to: open voting time + voting time + 24H';
    const messageIsOpenTimeLessThanCloseTime =
      !isOpenTimeLessThanCloseTime && 'Open time should be less than close time';
    const messageIsCloseTimeLessThanLiquidityAllocationTime =
      !isCloseTimeLessThanLiquidityAllocationTime &&
      'Close time should be less than liquidity allocation time';
    // errors
    const newErrors = {
      openVotingTime:
        messageIsOpenVotingTimeMoreThanBlockTimestamp ||
        messageIsOpenVotingTimePlus24HLessThanOpenTime,
      openTime:
        messageIsOpenTimeLessThanCloseTime || messageIsOpenVotingTimePlus24HLessThanOpenTime,
      closeTime:
        messageIsOpenTimeLessThanCloseTime || messageIsCloseTimeLessThanLiquidityAllocationTime,
      liquidityAllocationTime: messageIsCloseTimeLessThanLiquidityAllocationTime,
    };
    setErrors({ ...errors, ...newErrors });
    // returns
    if (!isOpenVotingTimeMoreThanBlockTimestamp) return false;
    if (!isOpenVotingTimePlus24HLessThanOpenTime) return false;
    if (!isOpenTimeLessThanCloseTime) return false;
    if (!isCloseTimeLessThanLiquidityAllocationTime) return false;
    if (!isPublic) {
      //
    }
    return true;
  };

  const getStakedLess = async () => {
    try {
      const result = await ContractStaking.getLessBalanceByAddress({ userAddress });
      const resultInEth = convertFromWei(result, lessDecimals);
      if (resultInEth) setStakedLess(resultInEth);
      console.log('PageCreatePool getStakedLess:', resultInEth);
    } catch (e) {
      console.error(e);
    }
  };

  const getStakedLp = async () => {
    try {
      const result = await ContractStaking.getLpBalanceByAddress({ userAddress });
      const resultInEth = convertFromWei(result, lpDecimals);
      if (resultInEth) setStakedLP(resultInEth);
      console.log('PageCreatePool getStakedLP:', resultInEth);
    } catch (e) {
      console.error(e);
    }
  };

  const checkStakingBalance = async () => {
    try {
      const stakedSum = +stakedLess + +stakedLP * 300;
      const minCreatorStakedBalanceInLp = minCreatorStakedBalance / 300;
      if (stakedSum < minCreatorStakedBalance)
        toggleModal({
          open: true,
          text: (
            <div className={s.messageContainer}>
              <p>
                To be able to create new pool, please stake {prettyNumber(minCreatorStakedBalance)}{' '}
                $LESS or {prettyNumber(minCreatorStakedBalanceInLp.toString())} ETH-LESS LP
              </p>
              <p>Your staking balance is: {stakedSum} ($LESS + ETH-LESS LP)</p>
              <div className={s.messageContainerButtons}>
                <Button to="/staking">Go to Staking</Button>
              </div>
            </div>
          ),
        });
      return true;
    } catch (e) {
      console.error('CreatePool checkStakingBalance:', e);
      return false;
    }
  };

  const approveLess = async () => {
    try {
      const totalSupply = await ContractLessToken.totalSupply();
      const { addresses }: any = config;
      const spender = addresses[config.isMainnetOrTestnet][chainType].PresaleFactory;
      const allowance = await ContractLessToken.allowance({ userAddress, spender });
      console.log('CreatePool approveLess:', { totalSupply, spender, allowance });
      if (allowance < totalSupply) {
        const resultApprove = await ContractLessToken.approve({
          userAddress,
          spender,
          amount: totalSupply,
        });
        console.log('CreatePool approveLess resultApprove:', resultApprove);
        return true;
      }
      return true;
    } catch (e) {
      console.error('CreatePool approveLess:', e);
      return false;
    }
  };

  const approveTokens = async () => {
    try {
      const totalSupply = await ContractERC20.totalSupply({ contractAddress: tokenAddress });
      const { addresses }: any = config;
      const spender = addresses[config.isMainnetOrTestnet][chainType].PresaleFactory;
      const allowance = await ContractERC20.allowance({
        contractAddress: tokenAddress,
        userAddress,
        spender,
      });
      console.log('CreatePool approveTokens:', { totalSupply, spender, allowance });
      if (allowance < totalSupply) {
        const resultApprove = await ContractERC20.approve({
          contractAddress: tokenAddress,
          userAddress,
          spender,
          amount: totalSupply,
        });
        console.log('CreatePool approveTokens resultApprove:', resultApprove);
        return true;
      }
      return true;
    } catch (e) {
      console.error('CreatePool approveTokens:', e);
      return false;
    }
  };

  // const subscribeEvent = async (type: string) => {
  //   try {
  //     await web3.subscribe(type, console.log);
  //     return true;
  //   } catch (e) {
  //     console.error('CreatePool subscribeEvent:', e);
  //     return false;
  //   }
  // };

  const countAmountOfTokensToCreate = async () => {
    try {
      const decimals = await ContractERC20.decimals({ contractAddress: tokenAddress });
      const result = await ContractCalculations.countAmountOfTokens({
        hardCap,
        tokenPrice,
        listingPrice,
        liquidityPercentageAllocation,
        decimals,
      });
      return result;
    } catch (e) {
      console.error('CreatePool subscribeEvent:', e);
      return null;
    }
  };
  const handleTransactionHash = (txHash: string) => {
    toggleModal({
      open: true,
      text: (
        <div className={s.messageContainer}>
          <p>Transaction submitted</p>
          <div className={s.messageContainerButtons}>
            <Button href={`${config.explorers[chainType]}/tx/${txHash}`}>View on etherscan</Button>
          </div>
        </div>
      ),
    });
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      setIsLoading(true);
      if (!isPublic) {
        toggleModal({
          open: true,
          text: (
            <div className={s.messageContainer}>
              <p>Creating certified presale is coming soon</p>
            </div>
          ),
        });
        return;
      }
      const areFieldsNotValid = !validateFormForExistingValues() || !validateFormValues();
      if (areFieldsNotValid) {
        toggleModal({
          open: true,
          text: (
            <div className={s.messageContainer}>
              <p>Please, check fields</p>
            </div>
          ),
        });
        return;
      }
      const areAddressesValid = await validateAddresses();
      if (!areAddressesValid) {
        toggleModal({
          open: true,
          text: (
            <div className={s.messageContainer}>
              <p>Please, check addresses</p>
            </div>
          ),
        });
        return;
      }
      const amountOfTokensToCreate = await countAmountOfTokensToCreate();
      const balanceOf = await ContractERC20.balanceOf({
        contractAddress: tokenAddress,
        userAddress,
      });
      const decimals = await ContractERC20.decimals({
        contractAddress: tokenAddress,
      });
      const symbol = await ContractERC20.symbol({
        contractAddress: tokenAddress,
      });
      const amountOfTokensToCreateInEth = convertFromWei(amountOfTokensToCreate, decimals);
      const isBalanceOfTokensLessThanNeededToCreate = +balanceOf < +amountOfTokensToCreate;
      console.log('PageCreatePool handleSubmit:', { balanceOf, amountOfTokensToCreate });
      if (isBalanceOfTokensLessThanNeededToCreate) {
        toggleModal({
          open: true,
          text: (
            <div className={s.messageContainer}>
              <p>
                You need to have {amountOfTokensToCreateInEth} {symbol} tokens on balance to create
                pool
              </p>
            </div>
          ),
        });
        return;
      }
      if (!validateSoftCapAndHardCap()) {
        toggleModal({
          open: true,
          text: (
            <div className={s.messageContainer}>
              <p>Please, check softcap and hardcap</p>
            </div>
          ),
        });
        return;
      }
      if (!validateTime()) {
        toggleModal({
          open: true,
          text: (
            <div className={s.messageContainer}>
              <p>Please, check time values</p>
            </div>
          ),
        });
        return;
      }
      const resultApproveLess = await approveLess();
      if (!resultApproveLess) return;
      const resultApproveTokens = await approveTokens();
      if (!resultApproveTokens) return;
      // login to backend
      let userLessAndLpBalance;
      let timestamp;
      let signature;
      const resultGetMetamaskMessage = await Backend.getMetamaskMessage();
      console.log('PageCreatePool resultGetMetamaskMessage:', resultGetMetamaskMessage);
      if (resultGetMetamaskMessage.data) {
        const msg = resultGetMetamaskMessage.data;
        const signedMsg = await web3.signMessage({ userAddress, message: msg });
        console.log('PageCreatePool signedMsg:', signedMsg);
        if (signedMsg) {
          const resultMetamaskLogin = await Backend.metamaskLogin({
            address: userAddress,
            msg,
            signedMsg,
          });
          console.log('PageCreatePool resultMetamaskLogin:', resultMetamaskLogin);
          if (resultMetamaskLogin.data) {
            const { key } = resultMetamaskLogin.data;
            const resultGetPoolSignature = await Backend.getPoolSignature({
              token: key,
              token_address: tokenAddress,
            });
            console.log('PageCreatePool resultGetPoolSignature:', resultGetPoolSignature);
            if (resultGetPoolSignature.data) {
              timestamp = resultGetPoolSignature.data.date;
              signature = resultGetPoolSignature.data.signature;
              userLessAndLpBalance = resultGetPoolSignature.data.user_balance;
            }
          }
        }
      }

      const tokenDecimals = await ContractERC20.decimals({ contractAddress: tokenAddress });
      console.log('CreatePool handleSubmit hardCap softCap:', {
        hardCap,
        softCap,
        tokenDecimals,
        userLessAndLpBalance,
      });
      const tokenPriceInWei = convertToWei(tokenPrice, 18); // todo: check 18
      const hardCapInWei = convertToWei(hardCap, tokenDecimals);
      const softCapInWei = convertToWei(softCap, tokenDecimals);
      const listingPriceInWei = convertToWei(listingPrice, 18); // todo: check 18
      const userLessAndLpBalanceFormatted = new BN(userLessAndLpBalance.toString()).toString(10);
      const poolPercentages = await ContractStaking.poolPercentages();
      const stakingTiers = await ContractStaking.stakingTiers();

      // address tokenAddress;      // адрес токена для пресейла
      // uint256 tokenPriceInWei;   // цена по которой токен будет продаваться
      // uint256 hardCapInWei;      // хард кап
      // uint256 softCapInWei;      // софт кап
      // uint256 openVotingTime;    // время начала голосования
      // uint256 openTime;          // время открытия пресейла
      // uint256 closeTime;         // время закрытия пресейла
      // uint256 _tokenAmount;      // кол-во застейканных токенов (дает бэк)
      // bytes _signature;          // подпись (дает бэк)
      // uint256 _timestamp;        // временная метка для подписи (дает бэк)
      // uint8[4] poolPercentages;  // проценты распределения токенов по тирам
      // uint256[5] stakingTiers;   // мин. количества токенов для тиров
      const presaleInfo = [
        tokenAddress,
        tokenPriceInWei,
        hardCapInWei,
        softCapInWei,
        (openVotingTime / 1000).toFixed(),
        (openTime / 1000).toFixed(),
        (closeTime / 1000).toFixed(),
        userLessAndLpBalanceFormatted,
        // hexToBytes(signature),
        signature,
        timestamp.toString(),
        poolPercentages,
        stakingTiers,
      ];
      const presalePancakeSwapInfo = [
        listingPriceInWei,
        lpTokensLockDurationInDays,
        liquidityPercentageAllocation,
        (liquidityAllocationTime / 1000).toFixed(),
      ];
      // todo: add CertifiedAddition for certified presale, where nativeToken is
      const presaleStringInfo = [
        saleTitle,
        linkTelegram,
        linkGithub,
        linkTwitter,
        linkWebsite,
        linkLogo,
        description,
        whitepaper,
      ];
      if (isPublic) {
        console.log('CreatePool handleSubmit', {
          isPublic,
          presaleInfo,
          presalePancakeSwapInfo,
          presaleStringInfo,
          usdtToEthFee,
        });
        ContractPresaleFactory.createPresalePublic({
          userAddress,
          presaleInfo,
          presalePancakeSwapInfo,
          presaleStringInfo,
          usdtToEthFee,
        })
          .on('transactionHash', (txHash: string) => {
            handleTransactionHash(txHash);
          })
          .then((resultCreatePresalePublic) => {
            console.log('CreatePool handleSubmit', resultCreatePresalePublic);
          });
      } else {
        // const nativeTokenAddress = // todo: get from library contract?
        const whiteListArray1 = splitWhitelist(whitelist1);
        const whiteListArray2 = splitWhitelist(whitelist2);
        const whiteListArray3 = splitWhitelist(whitelist3);
        const whiteListArray4 = splitWhitelist(whitelist4);
        const whiteListArray5 = splitWhitelist(whitelist5);
        const certifiedAddition = [
          isLiquidity,
          isAutomatically,
          isVesting,
          whiteListArray1, // todo check
          whiteListArray2, // todo check
          whiteListArray3, // todo check
          whiteListArray4, // todo check
          whiteListArray5, // todo check
          nativeToken, // todo: nativeTokenAddress get from library contract?
        ];
        console.log('CreatePool handleSubmit:', {
          isPublic,
          presaleInfo,
          presalePancakeSwapInfo,
          presaleStringInfo,
          certifiedAddition,
        });
        ContractPresaleFactory.createPresalePublic({
          userAddress,
          presaleInfo,
          presalePancakeSwapInfo,
          presaleStringInfo,
        })
          .on('transactionHash', (txHash: string) => {
            handleTransactionHash(txHash);
          })
          .then((resultCreatePresalePublic) =>
            console.log('CreatePool handleSubmit', resultCreatePresalePublic),
          );
      }
    } catch (e) {
      console.error('PageCreatePool handleSubmit:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isPublic) {
      toggleModal({
        open: true,
        text: (
          <div className={s.messageContainer}>
            <p>Creating certified presale is coming soon</p>
          </div>
        ),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPublic]);

  useEffect(() => {
    if (!userAddress) return;
    if (!ContractLessToken) return;
    if (!ContractLessLibrary) return;
    if (!ContractStaking) return;
    getDecimals();
    getMinCreatorStakedBalance();
    getStakedLess();
    getStakedLp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ContractStaking, userAddress]);

  useEffect(() => {
    if (!userAddress) return;
    if (!ContractCalculations) return;
    getUsdtFeeForCreation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ContractCalculations, userAddress]);

  useEffect(() => {
    clearErrors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    saleTitle,
    description,
    tokenAddress,
    tokenPrice,
    softCap,
    hardCap,
    openTime,
    closeTime,
    listingPrice,
    liquidityPercentageAllocation,
    lpTokensLockDurationInDays,
    linkTelegram,
    linkGithub,
    linkTwitter,
    linkWebsite,
    linkLogo,
    description,
    whitepaper,
  ]);

  useEffect(() => {
    if (!softCap) return;
    if (!hardCap) return;
    validateSoftCapAndHardCap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [softCap, hardCap]);

  useEffect(() => {
    if (!ContractLessToken) return;
    if (!ContractLessLibrary) return;
    if (!ContractStaking) return;
    if (!userAddress) return;
    if (!lpDecimals) return;
    if (!lessDecimals) return;
    checkStakingBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    ContractLessToken,
    ContractLessLibrary,
    ContractStaking,
    userAddress,
    lpDecimals,
    lessDecimals,
  ]);

  return (
    <section className={s.page}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Create pool | Lesspad</title>
        <meta name="description" content="Create pool" />
      </Helmet>

      <div className={s.container}>
        <div className={s.inner}>
          <div className={s.title}>Create Pool</div>
          <Checkbox
            name="presale type"
            value={presaleType}
            onChange={setPresaleType}
            options={[
              { key: 'Public', text: 'Public' },
              { key: 'Certified', text: 'Certified' },
            ]}
          />
          <div className={s.page_body}>
            <form action="" onSubmit={(e) => handleSubmit(e)}>
              <Input
                title="Sale title"
                placeholder="Title"
                value={saleTitle}
                onChange={setSaleTitle}
                error={errors.saleTitle}
                validations={validationIfExists}
              />
              <Input
                title="Description"
                value={description}
                onChange={setDescription}
                error={errors.description}
                validations={validationIfExists}
              />
              <Input
                title="Token Contract Address"
                placeholder="0x3561A02e...8e867013"
                value={tokenAddress}
                onChange={setTokenAddress}
                error={errors.tokenAddress}
                validations={validationIfExists}
              />
              <Input
                title="Token Price"
                placeholder="1"
                value={tokenPrice}
                onChange={setTokenPrice}
                error={errors.tokenPrice}
                validations={[...validationIfExists, ...validationGt0]}
              />
              <div className={s.small_inputs}>
                <Input
                  title="Soft Cap"
                  placeholder="1"
                  value={softCap}
                  onChange={setSoftCap}
                  error={errors.softCap}
                  validations={[...validationIfExists, ...validationGt0]}
                />
                <Input
                  title="Hard Cap"
                  placeholder="2"
                  value={hardCap}
                  onChange={setHardCap}
                  error={errors.hardCap}
                  validations={[...validationIfExists, ...validationGt0]}
                />
              </div>

              {/* date pickers */}
              <DateInput
                title="Open voting Time"
                value={openVotingTime}
                onChange={setOpenVotingTime}
                error={errors.openVotingTime}
              />
              <DateInput
                title="Open Time"
                value={openTime}
                onChange={setOpenTime}
                error={errors.openTime}
              />
              <DateInput
                title="Close Time"
                value={closeTime}
                onChange={setCloseTime}
                error={errors.closeTime}
              />

              {!isPublic && (
                <Checkbox
                  name="liquidity / without liquidity"
                  value={liquidity}
                  onChange={setLiquidity}
                  options={[
                    { key: 'Liquidity', text: 'Liquidity' },
                    { key: 'Without liquidity', text: 'Without liquidity' },
                  ]}
                />
              )}

              {/* Liquidity inputs */}
              {(isPublic || isLiquidity) && (
                <>
                  <Input
                    title="Liquidity Percentage"
                    placeholder="10"
                    value={liquidityPercentageAllocation}
                    onChange={setLiquidityPercentageAllocation}
                    error={errors.liquidityPercentageAllocation}
                    validations={[...validationIfExists, ...validationPercentage]}
                  />
                  <Input
                    title="Listing price"
                    placeholder="1"
                    value={listingPrice}
                    onChange={setListingPrice}
                    error={errors.listingPrice}
                    validations={validationIfExists}
                  />
                  <Input
                    title="Number Of Days To Lock LP Tokens"
                    placeholder="30"
                    value={lpTokensLockDurationInDays}
                    onChange={setLpTokensLockDurationInDays}
                    error={errors.lpTokensLockDurationInDays}
                    validations={[...validationIfExists, ...validationOfDuration]}
                  />
                  <DateInput
                    title="Liquidity Allocation Time"
                    value={liquidityAllocationTime}
                    onChange={setLiquidityAllocationTime}
                    error={errors.liquidityAllocationTime}
                  />
                  {!isPublic && (
                    <Checkbox
                      name="Automatically / Not Automatically"
                      value={automatically}
                      onChange={setAutomatically}
                      options={[
                        { key: 'Automatically', text: 'Automatically' },
                        { key: 'Not Automatically', text: 'Not Automatically' },
                      ]}
                    />
                  )}
                </>
              )}
              {/* Liquidity inputs end */}

              {!isPublic && (
                <>
                  <Checkbox
                    name="Whitelist / without whitelist"
                    value={whiteListed}
                    onChange={setWhiteListed}
                    options={[
                      { key: 'Whitelist', text: 'Whitelist' },
                      { key: 'Without whitelist', text: 'Without whitelist' },
                    ]}
                  />
                  {isWhiteListed && (
                    <>
                      <Input
                        title="Tier 1 adresses, comma separated"
                        value={whitelist1}
                        onChange={setWhitelist1}
                      />
                      <Input
                        title="Tier 2 adresses, comma separated"
                        value={whitelist2}
                        onChange={setWhitelist2}
                      />
                      <Input
                        title="Tier 3 adresses, comma separated"
                        value={whitelist3}
                        onChange={setWhitelist3}
                      />
                      <Input
                        title="Tier 4 adresses, comma separated"
                        value={whitelist4}
                        onChange={setWhitelist4}
                      />
                      <Input
                        title="Tier 5 adresses, comma separated"
                        value={whitelist5}
                        onChange={setWhitelist5}
                      />
                    </>
                  )}
                  <Checkbox
                    name="vesting / without vesting"
                    value={vesting}
                    onChange={setVesting}
                    options={[
                      { key: 'Vesting', text: 'Vesting' },
                      { key: 'Without vesting', text: 'Without vesting' },
                    ]}
                  />
                  {isVesting && (
                    <>
                      <Input
                        title="Vesting Percent"
                        placeholder="10"
                        value={vestingPercent}
                        onChange={setVestingPercent}
                      />
                    </>
                  )}
                </>
              )}

              {!isPublic && (
                <Checkbox
                  name="Native token"
                  value={nativeToken}
                  onChange={setNativeToken}
                  options={[
                    { key: 'WETH', text: 'WETH' },
                    { key: 'USDT', text: 'USDT' },
                    { key: 'USDC', text: 'USDC' },
                  ]}
                />
              )}

              <Input
                value={linkLogo}
                onChange={setLinkLogo}
                title="Link to logo"
                placeholder="https://example.com/logo.png"
                // error={errors.linkLogo}
                // validations={validationIfExists}
              />
              <Input
                value={linkWebsite}
                onChange={setLinkWebsite}
                title="Link to Website"
                // error={errors.linkWebsite}
                // validations={validationIfExists}
              />
              <Input
                value={linkTelegram}
                onChange={setLinkTelegram}
                title="Link to Telegram"
                // error={errors.linkTelegram}
                // validations={validationIfExists}
              />
              <Input
                value={linkGithub}
                onChange={setLinkGithub}
                title="Link to Github"
                // error={errors.linkGithub}
                // validations={validationIfExists}
              />
              <Input
                value={linkTwitter}
                onChange={setLinkTwitter}
                title="Link to Twitter"
                // error={errors.linkTwitter}
                // validations={validationIfExists}
              />
              <Input
                value={whitepaper}
                onChange={setWhitepaper}
                title="Whitepaper"
                // error={errors.whitepaper}
                // validations={validationIfExists}
              />

              <div className={s.button}>
                <button type="submit" className={isLoading ? s.button_loading : s.button_submit}>
                  {isLoading ? 'Loading...' : 'Next'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreatePoolPage;
