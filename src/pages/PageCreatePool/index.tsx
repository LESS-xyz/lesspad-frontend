import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { BigNumber as BN } from 'bignumber.js/bignumber';
import dayjs from 'dayjs';

import calendarImg from '../../assets/img/icons/calendar.svg';
import Button from '../../components/Button';
import Calendar from '../../components/Calendar/index';
import Checkbox from '../../components/Checkbox/index';
import DateInput from '../../components/DateInput';
import Input from '../../components/Input/index';
import config from '../../config';
import { useContractsContext } from '../../contexts/ContractsContext';
import { useWeb3ConnectorContext } from '../../contexts/Web3Connector';
import { modalActions } from '../../redux/actions';
import { BackendService } from '../../services/Backend';
import { convertFromWei } from '../../utils/ethereum';
import { prettyNumber } from '../../utils/prettifiers';

import s from './CreatePool.module.scss';

const Backend = new BackendService();

// enum EnumFieldType {
//   ADDRESS = 'ADDRESS',
//   TIME = 'TIME',
//   STRING = 'STRING',
// }
//
// type TypeHandleError = {
//   value: any;
//   message?: string;
//   type?: EnumFieldType;
// };

const CreatePoolPage: React.FC = () => {
  const { web3 } = useWeb3ConnectorContext();
  const {
    ContractPresaleFactory,
    ContractLessToken,
    ContractLPToken,
    ContractStaking,
    ContractLessLibrary,
    ContractUniswapRouter,
  } = useContractsContext();

  const defaultOpenVotingTime = new Date().getTime() + 1000 * 60 * 60 * 24;
  const defaultOpenTime = defaultOpenVotingTime + 1000 * 60 * 60 * 24 + 1000 * 60 * 10;
  const defaultCloseTime = defaultOpenTime + 1000 * 60 * 60 * 24;
  const defaultLiquidityAllocationTime = defaultCloseTime + 1000 * 60 * 60 * 24;

  const [lessDecimals, setLessDecimals] = useState<number>(0);
  const [lpDecimals, setLpDecimals] = useState<number>(0);

  const [stakedLess, setStakedLess] = useState<string>('0.000');
  const [stakedLP, setStakedLP] = useState<string>('0.000');

  const [saleTitle, setSaleTitle] = useState<string>('Title');
  const [description, setDescription] = useState<string>('');
  const [tokenAddress, setTokenAddress] = useState<string>(
    '0xa372d1d35041714092900B233934fB2D002755E2',
  );
  const [tokenPriceInWei, setTokenPriceInWei] = useState<string>('1000000000000000000');
  // инпуты для Public type
  const [softCapInWei, setSoftCapInWei] = useState<string>('1000000000000000000');
  const [hardCapInWei, setHardCapInWei] = useState<string>('2000000000000000000');
  const [openVotingTime, setOpenVotingTime] = useState<number>(defaultOpenVotingTime);
  const [openTime, setOpenTime] = useState<number>(defaultOpenTime);
  const [closeTime, setCloseTime] = useState<number>(defaultCloseTime);
  const [liquidityPercent, setLiquidityPercent] = useState<string>('0');
  const [liquidityPercentageAllocation, setLiquidityPercentageAllocation] = useState<string>('1');
  const [listingPriceInWei, setListingPriceInWei] = useState<string>('1000000000000000000');
  const [lpTokensLockDurationInDays, setLpTokensLockDurationInDays] = useState('0');
  const [vestingPercent, setVestingPercent] = useState<string>('0');
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
  // стейт календарей открыт/закрыт
  const [isCalendarVoting, setIsCalendarVoting] = useState<boolean>(false);
  const [isCalendar1, setIsCalendar1] = useState<boolean>(false);
  const [isCalendar2, setIsCalendar2] = useState<boolean>(false);
  const [
    isCalendarLiquidityAllocationTime,
    setIsCalendarLiquidityAllocationTime,
  ] = useState<boolean>(false);
  // чекбоксы
  const [presaleType, setPresaleType] = useState<string>('Public');
  const [liquidity, setLiquidity] = useState<string>('Liquidity');
  const [automatically, setAutomatically] = useState<string>('Automatically');
  const [vesting, setVesting] = useState<string>('Vesting');
  const [whiteListed, setWhiteListed] = useState<string>('Whitelist');
  // const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);

  const [errors, setErrors] = useState<any>({});

  const isPublic = presaleType === 'Public';
  const isLiquidity = liquidity === 'Liquidity';
  const isAutomatically = automatically === 'Automatically';
  const isVesting = vesting === 'Vesting';
  const isWhiteListed = whiteListed === 'Whitelist';

  const { chainType } = useSelector(({ wallet }: any) => wallet);
  const { address: userAddress } = useSelector(({ user }: any) => user);

  const dispatch = useDispatch();
  const toggleModal = React.useCallback((params) => dispatch(modalActions.toggleModal(params)), [
    dispatch,
  ]);

  const minInvestInWei = new BN(10).pow(new BN(10)).toString(10); // todo
  const maxInvestInWei = new BN(10).pow(new BN(20)).toString(10); // todo
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

  // const handleError = async ({ value, message, type }: TypeHandleError) => {
  //   if (type === EnumFieldType.ADDRESS) {
  //     const isTokenAddressValid = await web3.isAddress(value);
  //     if (!isTokenAddressValid) return 'Address is not valid';
  //   }
  //   if (isFormSubmitted && !value) return message || 'Enter value';
  //   return '';
  // };

  const validateForm = async () => {
    try {
      const checkIfValueExists = (value: any) => {
        return value ? null : 'Enter value';
      };
      const checkPercent = (value: any) => {
        const isPercentageValid = +value >= 0 && +value <= 100;
        return isPercentageValid ? null : 'Percent value should be between 0 and 100';
      };
      const newErrors = {
        saleTitle: checkIfValueExists(saleTitle),
        tokenPriceInWei: checkIfValueExists(tokenPriceInWei),
        softCapInWei: checkIfValueExists(softCapInWei),
        hardCapInWei: checkIfValueExists(hardCapInWei),
        maxInvestInWei: checkIfValueExists(maxInvestInWei),
        minInvestInWei: checkIfValueExists(minInvestInWei),
        openTime: checkIfValueExists(openTime),
        closeTime: checkIfValueExists(closeTime),
        liquidityPercent: checkIfValueExists(liquidityPercent) || checkPercent(liquidityPercent),
        liquidityPercentageAllocation: liquidityPercentageAllocation
          ? checkPercent(liquidityPercentageAllocation)
          : null,
      };
      setErrors({ ...errors, ...newErrors });
      if (!saleTitle) return false;
      if (!tokenAddress) return false;
      if (!tokenPriceInWei) return false;
      if (!softCapInWei) return false;
      if (!hardCapInWei) return false;
      if (!maxInvestInWei) return false;
      if (!minInvestInWei) return false;
      if (!openTime) return false;
      if (!closeTime) return false;
      if (!isPublic) {
        // if (!liquidityPercent) return false;
        // if (!whitelistArray) return false;
        // if (!listingPriceInWei) return false;
        // if (!lpTokensLockDurationInDays) return false;
        // if (!liquidityPercentageAllocation) return false;
        // if (!liquidityAllocationTime) return false;
      }
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
      const messageEnterValue = tokenAddress ? null : 'Enter value';
      const messageAddressNotValid = isTokenAddressValid ? null : 'Address is not valid';
      const newErrors = {
        tokenAddress: messageEnterValue || messageAddressNotValid,
      };
      setErrors({ ...errors, ...newErrors });
      if (!isTokenAddressValid) return false;
      if (!isPublic) {
        // if (!web3.isAddress(tokenAddress)) return false;
      }
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const validateTime = () => {
    // openTime > block.timestamp &&
    // openVotingTime + safeLibrary.getVotingTime() + 86400 <= openTime &&
    // openTime < closeTime &&
    // closeTime < _cakeInfo.liquidityAllocationTime,
    // todo block timestamp
    const isOpenTimeMoreThanBlockTimestamp = openTime > Date.now();
    // todo getVotingTime, check ms/s
    const isOpenVotingTimePlus24LessThanOpenTime =
      openVotingTime + 600 * 1000 + 86400 * 1000 <= openTime;
    const isOpenTimeLessThanCloseTime = openTime < closeTime;
    const isCloseTimeLessThanLiquidityAllocationTime = closeTime < liquidityAllocationTime;
    if (!isOpenTimeMoreThanBlockTimestamp) {
      toggleModal({
        open: true,
        text: (
          <div className={s.messageContainer}>
            <p>Open time should be more than last block time</p>
          </div>
        ),
      });
      return false;
    }
    if (!isOpenVotingTimePlus24LessThanOpenTime) {
      toggleModal({
        open: true,
        text: (
          <div className={s.messageContainer}>
            <p>Open time should be less or equal to: open voting time + voting time + 24H</p>
          </div>
        ),
      });
      return false;
    }
    if (!isOpenTimeLessThanCloseTime) {
      toggleModal({
        open: true,
        text: (
          <div className={s.messageContainer}>
            <p>Open time should be less than close time</p>
          </div>
        ),
      });
      return false;
    }
    if (!isCloseTimeLessThanLiquidityAllocationTime) {
      toggleModal({
        open: true,
        text: (
          <div className={s.messageContainer}>
            <p>Close time should be less than liquidity allocation time</p>
          </div>
        ),
      });
      return false;
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
      const minCreatorStakedBalance = await ContractLessLibrary.getMinCreatorStakedBalance();
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

  const approve = async () => {
    try {
      const totalSupply = await ContractLessToken.totalSupply();
      console.log('CreatePool stake stakeValueBN:', totalSupply);
      const { addresses }: any = config;
      const spender = addresses[config.isMainnetOrTestnet][chainType].PresaleFactory;
      console.log('CreatePool stake spender:', spender);
      const allowance = await ContractLessToken.allowance({ userAddress, spender });
      console.log('CreatePool stake allowance:', allowance);
      if (allowance < totalSupply) {
        const resultApprove = await ContractLessToken.approve({
          userAddress,
          spender,
          amount: totalSupply,
        });
        console.log('CreatePool stake resultApprove:', resultApprove);
        return true;
      }
      return true;
    } catch (e) {
      console.error('CreatePool approve:', e);
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      console.log('PageCreatePool handleSubmit:', { vestingPercent });
      if (!validateForm()) {
        // setIsFormSubmitted(true);
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
        // setIsFormSubmitted(true);
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
      if (!validateTime) return;
      // setIsFormSubmitted(true);
      const resultApprove = await approve();
      if (!resultApprove) return;
      // login to backend
      let tokenAmount;
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
              tokenAmount = resultGetPoolSignature.data.user_balance;
            }
          }
        }
      }
      const tokenAmountInEth = new BN(`${tokenAmount}`)
        .div(new BN(10).pow(new BN(lessDecimals)))
        .toString(10);

      const WETHAddress = await ContractUniswapRouter.getWETHAddress(); // todo: убрать в новом контракте
      console.log('PageCreatePool handleSubmit WETHAddress:', WETHAddress);
      const presaleInfo = [
        tokenAddress,
        tokenPriceInWei,
        hardCapInWei,
        softCapInWei,
        (openVotingTime / 1000).toFixed(),
        (openTime / 1000).toFixed(),
        (closeTime / 1000).toFixed(),
        tokenAmountInEth,
        // hexToBytes(signature),
        signature,
        timestamp.toString(),
        WETHAddress,
      ];
      const presalePancakeSwapInfo = [
        listingPriceInWei,
        lpTokensLockDurationInDays,
        liquidityPercentageAllocation,
        liquidityAllocationTime,
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
        console.log({ isPublic, presaleInfo, presalePancakeSwapInfo, presaleStringInfo });
        const resultCreatePresalePublic = await ContractPresaleFactory.createPresalePublic({
          userAddress,
          presaleInfo,
          presalePancakeSwapInfo,
          presaleStringInfo,
        });
        console.log('CreatePool handleSubmit', resultCreatePresalePublic);
      } else {
        // bool liquidity; - с ликвидностью / без
        // bool automatically; - если с ликвидностью, то через бэк, либо ручками
        // uint8 vesting; - процент вестинга
        // address[] whitelist; - список адресов для приватного пресейла (если список пустой, то проводится регистрация как на публичном)
        // address nativeToken; - в какой валюте продавать токены (котируются WETH, USDT, USDC)
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
          nativeToken,
        ];
        console.log('CreatePool handleSubmit:', {
          isPublic,
          presaleInfo,
          presalePancakeSwapInfo,
          presaleStringInfo,
          certifiedAddition,
        });
        const resultCreatePresalePublic = await ContractPresaleFactory.createPresalePublic({
          userAddress,
          presaleInfo,
          presalePancakeSwapInfo,
          presaleStringInfo,
        });
        console.log('CreatePool handleSubmit', resultCreatePresalePublic);
      }
    } catch (e) {
      console.error('PageCreatePool handleSubmit:', e);
    }
  };

  useEffect(() => {
    if (!userAddress) return;
    if (!ContractLessToken) return;
    if (!ContractLessLibrary) return;
    if (!ContractStaking) return;
    getDecimals();
    getStakedLess();
    getStakedLp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ContractStaking, userAddress]);

  useEffect(() => {
    validateForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    saleTitle,
    tokenPriceInWei,
    softCapInWei,
    hardCapInWei,
    maxInvestInWei,
    minInvestInWei,
    openTime,
    closeTime,
    liquidityPercent,
    liquidityPercentageAllocation,
  ]);

  useEffect(() => {
    validateAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenAddress]);

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
                value={saleTitle}
                onChange={setSaleTitle}
                error={errors.saleTitle}
              />
              <Input title="Description" value={description} onChange={setDescription} />
              <Input
                title="Token Contract Address"
                value={tokenAddress}
                onChange={setTokenAddress}
                error={errors.tokenAddress}
              />
              <Input
                title="Token Price (in wei)"
                value={tokenPriceInWei}
                onChange={setTokenPriceInWei}
                error={errors.tokenPriceInWei}
              />
              <div className={s.small_inputs}>
                <Input
                  title="Soft Cap (in wei)"
                  value={softCapInWei}
                  onChange={setSoftCapInWei}
                  error={errors.softCapInWei}
                />
                <Input
                  title="Hard Cap (in wei)"
                  value={hardCapInWei}
                  onChange={setHardCapInWei}
                  error={errors.hardCapInWei}
                />
              </div>
              {/* date pickers */}
              <div className={s.datePicker}>
                <div className={s.datePicker_title}>Open voting Time</div>
                <div className={s.datePicker_inner}>
                  <div className={s.datePicker_value}>
                    {dayjs(openVotingTime).format('DD MMM YYYY HH:mm')}
                  </div>
                  <div
                    className={s.datePicker_img}
                    role="button"
                    tabIndex={0}
                    onClick={() => setIsCalendarVoting(true)}
                    onKeyDown={() => {}}
                  >
                    <img src={calendarImg} alt="calendarImg" />
                  </div>
                </div>
                <div className={s.datePicker_subtitle}>In Your Timezone</div>
              </div>
              <div className={s.small_inputs}>
                <div className={s.datePicker}>
                  <div className={s.datePicker_title}>Open Time</div>
                  <div className={s.datePicker_inner}>
                    <div className={s.datePicker_value}>
                      {dayjs(openTime).format('DD MMM YYYY HH:mm')}
                    </div>
                    <div
                      className={s.datePicker_img}
                      role="button"
                      tabIndex={0}
                      onClick={() => setIsCalendar1(true)}
                      onKeyDown={() => {}}
                    >
                      <img src={calendarImg} alt="calendarImg" />
                    </div>
                  </div>
                  <div className={s.datePicker_subtitle}>In Your Timezone</div>
                </div>
                <div className={s.datePicker}>
                  <div className={s.datePicker_title}>Close Time</div>
                  <div className={s.datePicker_inner}>
                    <div className={s.datePicker_value}>
                      {dayjs(closeTime).format('DD MMM YYYY HH:mm')}
                    </div>
                    <div
                      className={s.datePicker_img}
                      role="button"
                      tabIndex={0}
                      onClick={() => setIsCalendar2(true)}
                      onKeyDown={() => {}}
                    >
                      <img src={calendarImg} alt="calendarImg" />
                    </div>
                  </div>
                  <div className={s.datePicker_subtitle}>In Your Timezone</div>
                </div>
              </div>
              {/* date pickers end */}
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
                    title="Liquidity Percent"
                    value={liquidityPercent}
                    onChange={setLiquidityPercent}
                    error={errors.liquidityPercent}
                  />
                  <Input
                    title="Liquidity Percentage allocation"
                    value={liquidityPercentageAllocation}
                    onChange={setLiquidityPercentageAllocation}
                    error={errors.liquidityPercentageAllocation}
                  />
                  <Input
                    title="Listing price (in wei)"
                    value={listingPriceInWei}
                    onChange={setListingPriceInWei}
                    // error={handleError(listingPriceInWei)}
                  />
                  <Input
                    title="Number Of Days To Lock LP Tokens"
                    value={lpTokensLockDurationInDays}
                    onChange={setLpTokensLockDurationInDays}
                    // error={handleError(lpTokensLockDurationInDays)}
                  />
                  <DateInput
                    title="Liquidity Allocation Time"
                    value={liquidityAllocationTime}
                    onChange={setLiquidityAllocationTime}
                    error={errors.liquidityAllocationTime}
                  />
                  <div className={s.datePicker}>
                    <div className={s.datePicker_title}>Liquidity Allocation Time</div>
                    <div className={s.datePicker_inner}>
                      <div className={s.datePicker_value}>
                        {dayjs(liquidityAllocationTime).format('DD MMM YYYY HH:mm')}
                      </div>
                      <div
                        className={s.datePicker_img}
                        role="button"
                        tabIndex={0}
                        onClick={() => setIsCalendarLiquidityAllocationTime(true)}
                        onKeyDown={() => {}}
                      >
                        <img src={calendarImg} alt="calendarImg" />
                      </div>
                    </div>
                    <div className={s.datePicker_subtitle}>In Your Timezone</div>
                  </div>
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

              <Input value={linkLogo} onChange={setLinkLogo} title="Link to logo" />
              <Input value={linkWebsite} onChange={setLinkWebsite} title="Link to Website" />
              <Input value={linkTelegram} onChange={setLinkTelegram} title="Link to Telegram" />
              <Input value={linkGithub} onChange={setLinkGithub} title="Link to Github" />
              <Input value={linkTwitter} onChange={setLinkTwitter} title="Link to Twitter" />
              <Input value={whitepaper} onChange={setWhitepaper} title="Whitepaper" />

              <div className={s.button}>
                <button type="submit" className={s.button_submit}>
                  Next
                </button>
              </div>
            </form>
          </div>
          {isCalendarVoting && (
            <div className={s.calender}>
              <Calendar
                defaultTimestamp={openVotingTime}
                onChange={(date: number) => setOpenVotingTime(date)}
                closeCalendar={() => setIsCalendarVoting(false)}
              />
            </div>
          )}
          {isCalendar1 && (
            <div className={s.calender}>
              <Calendar
                defaultTimestamp={openTime}
                onChange={(date: number) => setOpenTime(date)}
                closeCalendar={() => setIsCalendar1(false)}
              />
            </div>
          )}
          {isCalendar2 && (
            <div className={s.calender}>
              <Calendar
                defaultTimestamp={closeTime}
                onChange={(date: number) => setCloseTime(date)}
                closeCalendar={() => setIsCalendar2(false)}
              />
            </div>
          )}
          {isCalendarLiquidityAllocationTime && (
            <div className={s.calender}>
              <Calendar
                defaultTimestamp={liquidityAllocationTime}
                onChange={(date: number) => setLiquidityAllocationTime(date)}
                closeCalendar={() => setIsCalendarLiquidityAllocationTime(false)}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CreatePoolPage;
