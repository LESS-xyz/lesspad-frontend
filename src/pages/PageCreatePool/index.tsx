import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
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
import { detectNonLatinLetters, prettyNumber } from '../../utils/prettifiers';

import s from './CreatePool.module.scss';

const Backend = new BackendService();
const {
  IS_MAINNET_OR_TESTNET,
  SHOW_CERTIFIED_PRESALE,
  SHOW_FORM_VALUES,
  SHOW_FORM_VALUES_MINE,
  IS_FORM_EXISTING_VALUES_VALIDATION_ENABLED,
  IS_FORM_TIME_VALIDATION_ENABLED,
  NOW,
  BLOCK_DURATION,
  VOTING_DURATION,
  PRESALE_DURATION,
  REGISTRATION_DURATION,
  LIQUIDITY_ALLOCATION_DURATION,
  MINUTE,
  CERTIFIED_PRESALE_CURRENCIES,
  APPROVE_DURATION_ON_CERTIFIED,
  PRESALE_DURATION_ON_CERTIFIED,
} = config;

const checkIfExists = (value: any) => value;
const checkPercentage = (value: number) => value >= 0 && value <= 100;
const checkDuration = (value: number) => value >= 30;
const checkGt0 = (value: number) => value > 0;
const checkMaxStringLengthIs32 = (value: string) => value.length <= 32;
const checkLatinLettersNumbersSymbols = (value: string) => !detectNonLatinLetters(value);

const messageEnterValue = 'Enter value';
const messagePercentValue = 'Percent value should be between 0 and 100';
const messageMin30Days = 'Minimum 30 days';
const messageAddressIsNotValid = 'Address is not valid';
const messageSoftCapLessThanHardCap = 'Softcap should be less than hardcap';
const messageTokenPriceLessThanHardCap = 'Token price should be less than hardcap';
const messageGt0 = 'Value should be greater than 0';
const messageMaxStringLengthIs32 = 'Maximum length is 32';
const messageLatinLettersNumbersSymbols = 'Allowed only latin letters, numbers and symbols';

const validationIfExists = [
  {
    equation: checkIfExists,
    message: IS_FORM_EXISTING_VALUES_VALIDATION_ENABLED ? messageEnterValue : '',
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
const validationMaxStringLengthIs32 = [
  {
    equation: checkMaxStringLengthIs32,
    message: messageMaxStringLengthIs32,
  },
];
const validationLatinLettersAndNumbersAndSymbols = [
  {
    equation: checkLatinLettersNumbersSymbols,
    message: messageLatinLettersNumbersSymbols,
  },
];

const CreatePoolPage: React.FC = () => {
  const { web3 } = useWeb3ConnectorContext();
  const history = useHistory();
  const {
    ContractERC20,
    ContractCalculations,
    ContractPresaleFactory,
    ContractPresaleFactoryCertified,
    ContractLessToken,
    ContractStaking,
    ContractLessLibrary,
  } = useContractsContext();

  const { chainType } = useSelector(({ wallet }: any) => wallet);
  const { address: userAddress } = useSelector(({ user }: any) => user);
  const { minCreatorStakedBalance } = useSelector(({ library }: any) => library);
  const { stakedLess, stakedLp, lessPerLp } = useSelector(({ library }: any) => library);

  const nativeTokensAddresses =
    CERTIFIED_PRESALE_CURRENCIES[IS_MAINNET_OR_TESTNET][chainType].address || {};
  const nativeTokensSymbols = Object.keys(
    CERTIFIED_PRESALE_CURRENCIES[IS_MAINNET_OR_TESTNET][chainType] || {},
  );

  const defaultNativeTokenSymbol = nativeTokensSymbols[0] || '';

  const TIME_TO_BLOCK = MINUTE * 10;
  const defaultOpenVotingTime = NOW + TIME_TO_BLOCK;
  const defaultOpenTime = defaultOpenVotingTime + VOTING_DURATION + REGISTRATION_DURATION;
  const defaultCloseTime = defaultOpenTime + PRESALE_DURATION + MINUTE;
  const defaultLiquidityAllocationTime = defaultCloseTime + LIQUIDITY_ALLOCATION_DURATION;

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [saleTitle, setSaleTitle] = useState<string>(SHOW_FORM_VALUES ? 'Title' : '');
  const [description, setDescription] = useState<string>(SHOW_FORM_VALUES ? 'Description' : '');
  const [tokenAddress, setTokenAddress] = useState<string>(
    SHOW_FORM_VALUES
      ? SHOW_FORM_VALUES_MINE
        ? '0x3561A02e1192B89e2415724f43521f898e867013'
        : '0x7118afa5c6cbab828f0d9a529c62e89d282df9e4'
      : '',
  );
  const [tokenPrice, setTokenPrice] = useState<string>(SHOW_FORM_VALUES ? '0.0001' : '');
  // инпуты для Public type
  const [softCap, setSoftCap] = useState<string>(SHOW_FORM_VALUES ? '0.1' : '');
  const [hardCap, setHardCap] = useState<string>(SHOW_FORM_VALUES ? '0.2' : '');
  const [openVotingTime, setOpenVotingTime] = useState<number>(defaultOpenVotingTime);
  const [openTime, setOpenTime] = useState<number>(defaultOpenTime);
  const [closeTime, setCloseTime] = useState<number>(defaultCloseTime);
  const [liquidityPercentageAllocation, setLiquidityPercentageAllocation] = useState<string>(
    SHOW_FORM_VALUES ? '10' : '',
  );
  const [listingPrice, setListingPrice] = useState<string>(SHOW_FORM_VALUES ? '0.0002' : '');
  const [lpTokensLockDurationInDays, setLpTokensLockDurationInDays] = useState(
    SHOW_FORM_VALUES ? '30' : '',
  );
  const [vestingPercent, setVestingPercent] = useState<string>(SHOW_FORM_VALUES ? '0' : '');
  const [liquidityAllocationTime, setLiquidityAllocationTime] = useState<number>(
    defaultLiquidityAllocationTime,
  );
  // инпут для Certified type
  const [whitelist, setWhitelist] = useState<string>('');
  const [nativeTokenSymbol, setNativeTokenSymbol] = useState<string>(defaultNativeTokenSymbol);
  // links
  const [linkLogo, setLinkLogo] = useState<string>(
    SHOW_FORM_VALUES
      ? 'https://www.meme-arsenal.com/memes/2433145282c497c718a8859894466452.jpg'
      : '',
  );
  const [linkWebsite, setLinkWebsite] = useState<string>(
    SHOW_FORM_VALUES ? 'https://www.meme-arsenal.com' : '',
  );
  const [linkTelegram, setLinkTelegram] = useState<string>(
    SHOW_FORM_VALUES ? 'https://www.meme-arsenal.com' : '',
  );
  const [linkGithub, setLinkGithub] = useState<string>(
    SHOW_FORM_VALUES ? 'https://www.meme-arsenal.com' : '',
  );
  const [linkTwitter, setLinkTwitter] = useState<string>(
    SHOW_FORM_VALUES ? 'https://www.meme-arsenal.com' : '',
  );
  const [whitepaper, setWhitepaper] = useState<string>(
    SHOW_FORM_VALUES ? 'https://www.meme-arsenal.com' : '',
  );
  // чекбоксы
  const [presaleType, setPresaleType] = useState<string>('Certified');
  const [liquidity, setLiquidity] = useState<string>('Liquidity');
  // const [automatically, setAutomatically] = useState<string>('Automatically');
  const [vesting, setVesting] = useState<string>('Vesting');
  const [whiteListed, setWhiteListed] = useState<string>('Whitelist');
  // const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);

  const [usdtToEthFee, setUsdtToEthFee] = useState<string>();
  const [errors, setErrors] = useState<any>({});

  const isPublic = presaleType === 'Public';
  const isLiquidity = liquidity === 'Liquidity';
  // const isAutomatically = automatically === 'Automatically';
  const isVesting = vesting === 'Vesting';
  const isWhiteListed = whiteListed === 'Whitelist';
  const isPrivate = isWhiteListed;

  const dispatch = useDispatch();
  const toggleModal = useCallback((params) => dispatch(modalActions.toggleModal(params)), [
    dispatch,
  ]);
  const setLibrary = useCallback((params) => dispatch(libraryActions.setLibrary(params)), [
    dispatch,
  ]);
  const showMessageIfNoMetamask = useCallback(() => {
    try {
      if (!userAddress) {
        toggleModal({
          open: true,
          text: (
            <div className={s.messageContainer}>
              <p>Please, connect metamask to be able to create pool</p>
            </div>
          ),
        });
        return false;
      }
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }, [userAddress, toggleModal]);

  const splitWhitelist = (data: string) => {
    try {
      const whitelistArray = data.split(',');
      const newWhitelistArray = whitelistArray
        .map((item: string) => item.trim())
        .filter((item: string) => item !== '');
      return newWhitelistArray;
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  const getMinCreatorStakedBalance = useCallback(async () => {
    try {
      const resultGetMinCreatorStakedBalance = await ContractLessLibrary.getMinCreatorStakedBalance();
      setLibrary({ minCreatorStakedBalance: resultGetMinCreatorStakedBalance });
    } catch (e) {
      console.error(e);
    }
  }, [ContractLessLibrary, setLibrary]);

  const getUsdtFeeForCreation = useCallback(async () => {
    try {
      const resultUsdtToEthFee = await ContractCalculations.usdtToEthFee();
      setUsdtToEthFee(resultUsdtToEthFee);
      console.log('PageCreatePool getUsdtFeeForCreation:', resultUsdtToEthFee);
    } catch (e) {
      console.error(e);
    }
  }, [ContractCalculations]);

  const fieldsMustExist = useMemo(() => {
    return {
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
      whitepaper,
    };
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
    whitepaper,
  ]);

  const clearErrors = useCallback(() => {
    try {
      const newErrors = {};
      const entries = Object.entries(fieldsMustExist);
      for (let i = 0; i < entries.length; i += 1) {
        const [variableName, variable] = entries[i];
        if (variable) {
          newErrors[variableName] = variable && '';
        }
      }
      setErrors(newErrors);
    } catch (e) {
      console.error(e);
    }
  }, [fieldsMustExist]);

  const validateFormForExistingValues = useCallback(() => {
    try {
      if (!IS_FORM_EXISTING_VALUES_VALIDATION_ENABLED) return true;
      const newErrors = {};
      const entries = Object.entries(fieldsMustExist);
      for (let i = 0; i < entries.length; i += 1) {
        const [variableName, variable] = entries[i];
        newErrors[variableName] = !checkIfExists(variable) && messageEnterValue;
      }
      setErrors(newErrors);
      for (let i = 0; i < entries.length; i += 1) {
        const [, variable] = entries[i];
        if (!variable) return false;
      }
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }, [fieldsMustExist]);

  const validateSoftCapAndHardCap = useCallback(() => {
    try {
      const isSoftCapLessThanHardCap = +softCap < +hardCap;
      const messageIfIsSoftCapLessThanHardCap =
        !isSoftCapLessThanHardCap && messageSoftCapLessThanHardCap;
      const newErrors = {
        softCap: messageIfIsSoftCapLessThanHardCap,
        hardCap: messageIfIsSoftCapLessThanHardCap,
      };
      setErrors(newErrors);
      if (!isSoftCapLessThanHardCap) return false;
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }, [hardCap, softCap]);

  const validateTokenPriceAndHardCap = useCallback(() => {
    try {
      const isTokenPriceLessThanHardCap = +tokenPrice < +hardCap;
      const messageIfisTokenPriceLessThanHardCap =
        !isTokenPriceLessThanHardCap && messageTokenPriceLessThanHardCap;
      const newErrors = {
        tokenPrice: messageIfisTokenPriceLessThanHardCap,
        hardCap: messageIfisTokenPriceLessThanHardCap,
      };
      setErrors(newErrors);
      if (!isTokenPriceLessThanHardCap) return false;
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }, [hardCap, tokenPrice]);

  const validateFormValues = useCallback(() => {
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
      setErrors(newErrors);
      if (!checkPercentage(+liquidityPercentageAllocation)) return false;
      if (!checkDuration(+lpTokensLockDurationInDays)) return false;
      if (!checkMaxStringLengthIs32(saleTitle)) return false;
      if (!checkMaxStringLengthIs32(linkTelegram)) return false;
      if (!checkMaxStringLengthIs32(linkGithub)) return false;
      if (!checkMaxStringLengthIs32(linkTwitter)) return false;
      if (!checkMaxStringLengthIs32(linkWebsite)) return false;
      if (!checkLatinLettersNumbersSymbols(saleTitle)) return false;
      if (!checkLatinLettersNumbersSymbols(description)) return false;
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }, [
    description,
    hardCap,
    softCap,
    liquidityPercentageAllocation,
    lpTokensLockDurationInDays,
    saleTitle,
    linkTelegram,
    linkGithub,
    linkTwitter,
    linkWebsite,
  ]);

  const validateAddresses = useCallback(async () => {
    try {
      if (!web3) return false;
      const isTokenAddressValid = await web3.isAddress(tokenAddress);
      const messageIfEnterValue = !tokenAddress && messageEnterValue;
      const messageIfAddressNotValid = !isTokenAddressValid && messageAddressIsNotValid;
      const newErrors = {
        tokenAddress: messageIfEnterValue || messageIfAddressNotValid,
      };
      setErrors(newErrors);
      if (!isTokenAddressValid) return false;
      if (!isPublic) {
        //
      }
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }, [isPublic, tokenAddress, web3]);

  const validateTime = useCallback(() => {
    if (!IS_FORM_TIME_VALIDATION_ENABLED) return true;
    // checks
    const isOpenVotingTimeMoreThanBlockTimestamp = openVotingTime > NOW + BLOCK_DURATION;
    const isOpenVotingTimePlus24HLessThanOpenTime = openVotingTime + VOTING_DURATION < openTime;
    const isOpenTimeLessThanCloseTime = openTime < closeTime;
    const isCloseTimeGEQOpenTimePlusPresaleDuration = openTime + PRESALE_DURATION < closeTime;
    const isCloseTimeLessThanLiquidityAllocationTime = closeTime < liquidityAllocationTime;
    // messages
    const messageIsOpenVotingTimeMoreThanBlockTimestamp =
      !isOpenVotingTimeMoreThanBlockTimestamp &&
      'Open voting time should be more than last block time';
    const messageIsOpenVotingTimePlus24HLessThanOpenTime =
      !isOpenVotingTimePlus24HLessThanOpenTime &&
      'Open time should be more than: open voting time + 3 days';
    const messageIsOpenTimeLessThanCloseTime =
      !isOpenTimeLessThanCloseTime && 'Open time should be less than close time';
    const messageIsCloseTimeGeqOpenTimePlusPresaleDuration =
      !isCloseTimeGEQOpenTimePlusPresaleDuration &&
      'Close time should be more than: open time + presale duration';
    const messageIsCloseTimeLessThanLiquidityAllocationTime =
      !isCloseTimeLessThanLiquidityAllocationTime &&
      'Close time should be less than liquidity allocation time';
    // errors
    const newErrors = {
      openVotingTime:
        messageIsOpenVotingTimeMoreThanBlockTimestamp ||
        messageIsOpenVotingTimePlus24HLessThanOpenTime,
      openTime:
        messageIsOpenTimeLessThanCloseTime ||
        messageIsOpenVotingTimePlus24HLessThanOpenTime ||
        messageIsCloseTimeGeqOpenTimePlusPresaleDuration,
      closeTime:
        messageIsOpenTimeLessThanCloseTime ||
        messageIsCloseTimeLessThanLiquidityAllocationTime ||
        messageIsCloseTimeGeqOpenTimePlusPresaleDuration,
      liquidityAllocationTime: messageIsCloseTimeLessThanLiquidityAllocationTime,
    };
    setErrors(newErrors);
    if (!isOpenVotingTimeMoreThanBlockTimestamp) return false;
    if (!isOpenVotingTimePlus24HLessThanOpenTime) return false;
    if (!isOpenTimeLessThanCloseTime) return false;
    if (!isCloseTimeGEQOpenTimePlusPresaleDuration) return false;
    if (!isCloseTimeLessThanLiquidityAllocationTime) return false;
    return true;
  }, [openTime, closeTime, liquidityAllocationTime, openVotingTime]);

  const validateTimeCertified = useCallback(() => {
    if (!IS_FORM_TIME_VALIDATION_ENABLED) return true;
    // checks
    const isOpenTimeLessThanCloseTime = openTime < closeTime;
    const isCloseTimeGEQOpenTimePlusPresaleDuration =
      openTime + PRESALE_DURATION_ON_CERTIFIED < closeTime;
    const isCloseTimeLessThanLiquidityAllocationTime = closeTime < liquidityAllocationTime;
    const isOpenTimeGTBlockTimePlusApprove = openTime > NOW + APPROVE_DURATION_ON_CERTIFIED;
    // messages
    const messageIsOpenTimeLessThanCloseTime =
      !isOpenTimeLessThanCloseTime && 'Open time should be less than close time';
    const messageIsCloseTimeGeqOpenTimePlusPresaleDuration =
      !isCloseTimeGEQOpenTimePlusPresaleDuration &&
      'Close time should be more than: open time + presale duration';
    const messageIsCloseTimeLessThanLiquidityAllocationTime =
      !isCloseTimeLessThanLiquidityAllocationTime &&
      'Close time should be less than liquidity allocation time';
    //
    const messageIsOpenTimeGTBlockTimePlusApprove =
      !isOpenTimeGTBlockTimePlusApprove &&
      'Open time should be greater than last block time + 1 day to approve';
    // errors
    const newErrors = {
      openTime:
        messageIsOpenTimeGTBlockTimePlusApprove ||
        messageIsOpenTimeLessThanCloseTime ||
        messageIsCloseTimeGeqOpenTimePlusPresaleDuration,
      closeTime:
        messageIsOpenTimeLessThanCloseTime ||
        messageIsCloseTimeLessThanLiquidityAllocationTime ||
        messageIsCloseTimeGeqOpenTimePlusPresaleDuration,
      liquidityAllocationTime: messageIsCloseTimeLessThanLiquidityAllocationTime,
    };
    setErrors(newErrors);
    if (!isOpenTimeGTBlockTimePlusApprove) return false;
    if (!isOpenTimeLessThanCloseTime) return false;
    if (!isCloseTimeGEQOpenTimePlusPresaleDuration) return false;
    if (!isCloseTimeLessThanLiquidityAllocationTime) return false;
    return true;
  }, [openTime, closeTime, liquidityAllocationTime]);

  const validateTimePrivate = useCallback(() => {
    if (!IS_FORM_TIME_VALIDATION_ENABLED) return true;
    // checks
    const isOpenTimeLessThanCloseTime = openTime < closeTime;
    const isCloseTimeGEQOpenTimePlusPresaleDuration =
      openTime + PRESALE_DURATION_ON_CERTIFIED < closeTime;
    const isCloseTimeLessThanLiquidityAllocationTime = closeTime < liquidityAllocationTime;
    const isOpenTimeGTBlockTimePlusApprove = openTime > NOW + APPROVE_DURATION_ON_CERTIFIED;
    // messages
    const messageIsOpenTimeLessThanCloseTime =
      !isOpenTimeLessThanCloseTime && 'Open time should be less than close time';
    const messageIsCloseTimeGeqOpenTimePlusPresaleDuration =
      !isCloseTimeGEQOpenTimePlusPresaleDuration &&
      'Close time should be more than: open time + presale duration';
    const messageIsCloseTimeLessThanLiquidityAllocationTime =
      !isCloseTimeLessThanLiquidityAllocationTime &&
      'Close time should be less than liquidity allocation time';
    //
    const messageIsOpenTimeGTBlockTimePlusApprove =
      !isOpenTimeGTBlockTimePlusApprove &&
      'Open time should be greater than last block time + 1 day to approve';
    // errors
    const newErrors = {
      openTime:
        messageIsOpenTimeGTBlockTimePlusApprove ||
        messageIsOpenTimeLessThanCloseTime ||
        messageIsCloseTimeGeqOpenTimePlusPresaleDuration,
      closeTime:
        messageIsOpenTimeLessThanCloseTime ||
        messageIsCloseTimeLessThanLiquidityAllocationTime ||
        messageIsCloseTimeGeqOpenTimePlusPresaleDuration,
      liquidityAllocationTime: messageIsCloseTimeLessThanLiquidityAllocationTime,
    };
    setErrors(newErrors);
    if (!isOpenTimeGTBlockTimePlusApprove) return false;
    if (!isOpenTimeLessThanCloseTime) return false;
    if (!isCloseTimeGEQOpenTimePlusPresaleDuration) return false;
    if (!isCloseTimeLessThanLiquidityAllocationTime) return false;
    return true;
  }, [openTime, closeTime, liquidityAllocationTime]);

  const handleGoToStaking = useCallback(async () => {
    try {
      history.push('/staking');
      toggleModal({ open: false });
    } catch (e) {
      console.error(e);
    }
  }, [toggleModal, history]);

  const checkStakingBalance = useCallback(async () => {
    try {
      const stakedSum = +stakedLess + +stakedLp * +lessPerLp;
      const minCreatorStakedBalanceInLp = minCreatorStakedBalance / lessPerLp;
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
                <Button onClick={handleGoToStaking}>Go to Staking</Button>
              </div>
            </div>
          ),
        });
      return true;
    } catch (e) {
      console.error('CreatePool checkStakingBalance:', e);
      return false;
    }
  }, [stakedLess, stakedLp, lessPerLp, toggleModal, minCreatorStakedBalance, handleGoToStaking]);

  const approveLess = async () => {
    try {
      const totalSupply = await ContractLessToken.totalSupply();
      const { addresses }: any = config;
      const spenderPublic = addresses[config.IS_MAINNET_OR_TESTNET][chainType].PresaleFactory;
      const spenderCertified =
        addresses[config.IS_MAINNET_OR_TESTNET][chainType].PresaleFactoryCertified;
      const spender = isPublic ? spenderPublic : spenderCertified;
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
      const spenderPublic = addresses[config.IS_MAINNET_OR_TESTNET][chainType].PresaleFactory;
      const spenderCertified =
        addresses[config.IS_MAINNET_OR_TESTNET][chainType].PresaleFactoryCertified;
      const spender = isPublic ? spenderPublic : spenderCertified;
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

  const countAmountOfTokensToCreate = async () => {
    try {
      const decimals = await ContractERC20.decimals({ contractAddress: tokenAddress });
      const hardCapInWei = convertToWei(
        hardCap,
        CERTIFIED_PRESALE_CURRENCIES[IS_MAINNET_OR_TESTNET][chainType][nativeTokenSymbol].decimals,
      );
      const tokenPriceInWei = convertToWei(
        tokenPrice,
        CERTIFIED_PRESALE_CURRENCIES[IS_MAINNET_OR_TESTNET][chainType][nativeTokenSymbol].decimals,
      );
      const listingPriceInWei = convertToWei(
        listingPrice,
        CERTIFIED_PRESALE_CURRENCIES[IS_MAINNET_OR_TESTNET][chainType][nativeTokenSymbol].decimals,
      );
      const result = await ContractCalculations.countAmountOfTokens({
        hardCap: hardCapInWei,
        tokenPrice: tokenPriceInWei,
        listingPrice: listingPriceInWei,
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
            <Button href={`${config.EXPLORERS[chainType]}/tx/${txHash}`}>View on etherscan</Button>
          </div>
        </div>
      ),
    });
    history.push('/pools');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      setIsLoading(true);
      if (!showMessageIfNoMetamask()) return;
      if (!isPublic && !SHOW_CERTIFIED_PRESALE) {
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
      const validateTimeResult = isPublic
        ? validateTime()
        : isPrivate
        ? validateTimePrivate()
        : validateTimeCertified();
      if (!validateTimeResult) {
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
      const tokenPriceInWei = convertToWei(
        tokenPrice,
        CERTIFIED_PRESALE_CURRENCIES[IS_MAINNET_OR_TESTNET][chainType][nativeTokenSymbol].decimals,
      );
      const hardCapInWei = convertToWei(
        hardCap,
        CERTIFIED_PRESALE_CURRENCIES[IS_MAINNET_OR_TESTNET][chainType][nativeTokenSymbol].decimals,
      );
      const softCapInWei = convertToWei(
        softCap,
        CERTIFIED_PRESALE_CURRENCIES[IS_MAINNET_OR_TESTNET][chainType][nativeTokenSymbol].decimals,
      );
      const listingPriceInWei = convertToWei(
        listingPrice,
        CERTIFIED_PRESALE_CURRENCIES[IS_MAINNET_OR_TESTNET][chainType][nativeTokenSymbol].decimals,
      );
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
      // bytes32 saleTitle;      // название
      // bytes32 linkTelegram;   // ссылка телега
      // bytes32 linkGithub;     // ссылка гит
      // bytes32 linkTwitter;    // ссылка твиттер
      // bytes32 linkWebsite;    // ссылка сайт
      // string linkLogo;        // ссылка лого
      // string description;     // описание
      // string whitepaper;      // вайтпепер ссылка
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
        // address tokenAddress; - адрес токена для пресейла
        // uint256 tokenPriceInWei;-цена по которой токен будет продаваться
        // uint256 hardCapInWei; - хард кап
        // uint256 softCapInWei; - софт кап
        // uint256 openTime; - время открытия пресейла
        // uint256 closeTime; - время закрытия пресейла
        // uint256 _tokenAmount; - кол-во застейканных токенов (дает бэк)
        // bytes _signature; - подпись (дает бэк)
        // uint256 _timestamp; - временная метка для подписи (дает бэк)
        // uint8[4] poolPercentages; дает бэк
        // uint256[5] stakingTiers; дает бэк
        const presaleInfoCertified = [
          tokenAddress,
          tokenPriceInWei,
          hardCapInWei,
          softCapInWei,
          (openTime / 1000).toFixed(),
          (closeTime / 1000).toFixed(),
          userLessAndLpBalanceFormatted,
          signature,
          timestamp.toString(),
          poolPercentages,
          stakingTiers,
        ];
        // bool liquidity; - с ликвидностью / без
        // bool automatically; - если с ликвидностью, то через бэк, либо ручками
        // uint8 vesting; - процент вестинга
        // address[] whitelist; - список адресов для приватного пресейла (если список пустой, то проводится регистрация как на публичном)
        // address nativeToken; - в какой валюте продавать токены (котируются WETH, USDT, USDC)
        const whiteListArray = splitWhitelist(whitelist);
        const nativeTokenAddress = nativeTokensAddresses[nativeTokenSymbol];
        const certifiedAddition = [
          isLiquidity,
          // isAutomatically,
          false,
          vestingPercent,
          whiteListArray,
          nativeTokenAddress,
        ];
        console.log('CreatePool handleSubmit:', {
          nativeTokenSymbol,
          nativeTokensAddresses,
          presaleInfoCertified,
          presalePancakeSwapInfo,
          presaleStringInfo,
          certifiedAddition,
          usdtToEthFee,
        });
        ContractPresaleFactoryCertified.createPresaleCertified({
          userAddress,
          presaleInfo: presaleInfoCertified,
          presalePancakeSwapInfo,
          presaleStringInfo,
          certifiedAddition,
          usdtToEthFee,
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
    if (!isPublic && !SHOW_CERTIFIED_PRESALE) {
      toggleModal({
        open: true,
        text: (
          <div className={s.messageContainer}>
            <p>Creating certified presale is coming soon</p>
          </div>
        ),
      });
    }
  }, [isPublic, toggleModal]);

  useEffect(() => {
    if (!userAddress) return;
    if (!ContractLessToken) return;
    if (!ContractLessLibrary) return;
    if (!ContractStaking) return;
    getMinCreatorStakedBalance();
  }, [
    getMinCreatorStakedBalance,
    ContractStaking,
    userAddress,
    ContractLessToken,
    ContractLessLibrary,
  ]);

  useEffect(() => {
    if (!userAddress) return;
    if (!ContractCalculations) return;
    getUsdtFeeForCreation();
  }, [getUsdtFeeForCreation, ContractCalculations, userAddress]);

  useEffect(() => {
    clearErrors();
  }, [
    clearErrors,
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
  }, [softCap, hardCap, validateSoftCapAndHardCap]);

  useEffect(() => {
    if (!tokenPrice) return;
    if (!hardCap) return;
    validateTokenPriceAndHardCap();
  }, [hardCap, tokenPrice, validateTokenPriceAndHardCap]);

  useEffect(() => {
    if (!tokenAddress) return;
    validateAddresses();
  }, [tokenAddress, validateAddresses]);

  useEffect(() => {
    if (!openVotingTime) return;
    if (!openTime) return;
    if (!closeTime) return;
    if (!liquidityAllocationTime) return;
    validateTime();
  }, [openVotingTime, openTime, closeTime, liquidityAllocationTime, validateTime]);

  useEffect(() => {
    if (!stakedLess) return;
    if (!stakedLp) return;
    if (!lessPerLp) return;
    if (!toggleModal) return;
    if (!minCreatorStakedBalance) return;
    checkStakingBalance();
  }, [stakedLess, stakedLp, lessPerLp, toggleModal, minCreatorStakedBalance, checkStakingBalance]);

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
                validations={[
                  ...validationIfExists,
                  ...validationMaxStringLengthIs32,
                  ...validationLatinLettersAndNumbersAndSymbols,
                ]}
              />
              <Input
                title="Description"
                value={description}
                onChange={setDescription}
                error={errors.description}
                validations={[...validationIfExists, ...validationLatinLettersAndNumbersAndSymbols]}
              />
              <Input
                title="Token Contract Address"
                placeholder="0x3561A02e...8e867013"
                value={tokenAddress}
                onChange={setTokenAddress}
                delay={500}
                error={errors.tokenAddress}
                validations={validationIfExists}
              />
              {!isPublic && (
                <Checkbox
                  name="Native token"
                  value={nativeTokenSymbol}
                  onChange={setNativeTokenSymbol}
                  options={nativeTokensSymbols.map((symbol: string) => {
                    return { key: symbol, text: symbol };
                  })}
                />
              )}
              <Input
                type="number"
                title="Token Price"
                placeholder="1"
                value={tokenPrice}
                onChange={setTokenPrice}
                error={errors.tokenPrice}
                validations={[...validationIfExists, ...validationGt0]}
              />
              <div className={s.small_inputs}>
                <Input
                  type="number"
                  title="Soft Cap"
                  placeholder="1"
                  value={softCap}
                  onChange={setSoftCap}
                  error={errors.softCap}
                  validations={[...validationIfExists, ...validationGt0]}
                />
                <Input
                  type="number"
                  title="Hard Cap"
                  placeholder="2"
                  value={hardCap}
                  onChange={setHardCap}
                  error={errors.hardCap}
                  validations={[...validationIfExists, ...validationGt0]}
                />
              </div>

              {/* date pickers */}
              {isPublic && (
                <DateInput
                  title="Open voting Time"
                  value={openVotingTime}
                  onChange={setOpenVotingTime}
                  error={errors.openVotingTime}
                />
              )}
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
                    type="number"
                    title="Liquidity Percentage"
                    placeholder="10"
                    value={liquidityPercentageAllocation}
                    onChange={setLiquidityPercentageAllocation}
                    error={errors.liquidityPercentageAllocation}
                    validations={[...validationIfExists, ...validationPercentage]}
                  />
                  <Input
                    type="number"
                    title="Listing price"
                    placeholder="1"
                    value={listingPrice}
                    onChange={setListingPrice}
                    error={errors.listingPrice}
                    validations={validationIfExists}
                  />
                  <Input
                    type="number"
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
                  {/* {!isPublic && (
                    <Checkbox
                      name="Liquidity allocation Automatically / Not Automatically"
                      value={automatically}
                      onChange={setAutomatically}
                      options={[
                        { key: 'Automatically', text: 'Automatically' },
                        { key: 'Not Automatically', text: 'Not Automatically' },
                      ]}
                    />
                  )} */}
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
                        type="addresses"
                        title="Whitelist addresses, comma separated"
                        value={whitelist}
                        onChange={setWhitelist}
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
                        type="number"
                        title="Vesting Percent"
                        placeholder="10"
                        value={vestingPercent}
                        onChange={setVestingPercent}
                      />
                    </>
                  )}
                </>
              )}

              <Input
                value={linkLogo}
                onChange={setLinkLogo}
                title="Link to logo"
                placeholder="https://example.com/logo.png"
                error={errors.linkLogo}
                validations={validationIfExists}
              />
              <Input
                value={linkWebsite}
                onChange={setLinkWebsite}
                title="Link to Website"
                error={errors.linkWebsite}
                validations={[...validationIfExists, ...validationMaxStringLengthIs32]}
              />
              <Input
                value={linkTelegram}
                onChange={setLinkTelegram}
                title="Link to Telegram"
                error={errors.linkTelegram}
                validations={[...validationIfExists, ...validationMaxStringLengthIs32]}
              />
              <Input
                value={linkGithub}
                onChange={setLinkGithub}
                title="Link to Github"
                error={errors.linkGithub}
                validations={[...validationIfExists, ...validationMaxStringLengthIs32]}
              />
              <Input
                value={linkTwitter}
                onChange={setLinkTwitter}
                title="Link to Twitter"
                error={errors.linkTwitter}
                validations={[...validationIfExists, ...validationMaxStringLengthIs32]}
              />
              <Input
                value={whitepaper}
                onChange={setWhitepaper}
                title="Whitepaper"
                error={errors.whitepaper}
                validations={validationIfExists}
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
