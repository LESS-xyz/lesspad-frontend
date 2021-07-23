import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import Web3 from 'web3';

import calendarImg from '../../assets/img/icons/calendar.svg';
import Calendar from '../../components/Calendar/index';
import Checkbox from '../../components/Checkbox/index';
import Input from '../../components/Input/index';
import config from '../../config';
import { useContractsContext } from '../../contexts/ContractsContext';
import { useWeb3ConnectorContext } from '../../contexts/Web3Connector';
import { modalActions } from '../../redux/actions';
import { BackendService } from '../../services/Backend';

import s from './CreatePool.module.scss';

const Backend = new BackendService();
const { BN }: any = Web3.utils;

const CreatePoolPage: React.FC = () => {
  const { web3 } = useWeb3ConnectorContext();
  const {
    // ContractPresaleFactory,
    ContractLessToken,
    ContractStaking,
    ContractLessLibrary,
  } = useContractsContext();

  const defaultOpenVotingTime = new Date().getTime() + 1000 * 60 * 60 * 24;
  const defaultOpenTime = defaultOpenVotingTime + 1000 * 60 * 60 * 24 + 1000 * 60 * 10;
  const defaultCloseTime = defaultOpenTime + 1000 * 60 * 60 * 24;
  const defaultLiquidityAllocationTime = defaultCloseTime + 1000 * 60 * 60 * 24;

  const [saleTitle, setSaleTitle] = useState<string>('Rnb');
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
  const [whitelist, setWhitelist] = useState<string>('');
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
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [isLiquidity, setIsLiquidity] = useState<boolean>(false);
  const [isAutomatically, setIsAutomatically] = useState<boolean>(false);
  const [isVesting, setIsVesting] = useState<boolean>(false);
  const [isWhiteListed, setIsWhiteListed] = useState<boolean>(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);

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

  const handleError = (value: any, message?: string) => {
    if (isFormSubmitted && !value) return message || 'Enter value';
    return undefined;
  };

  const signMessage = async () => {
    try {
      // const result = await web3.signMessage({ userAddress, message: 'Hello' });
      // console.log('PageCreatePool signMessage result:', result);
    } catch (e) {
      console.error('PageCreatePool signMessage result:', e);
    }
  };

  const validateForm = () => {
    if (!saleTitle) return false;
    if (!tokenAddress) return false;
    if (!tokenPriceInWei) return false;
    if (!softCapInWei) return false;
    if (!hardCapInWei) return false;
    if (!maxInvestInWei) return false;
    if (!minInvestInWei) return false;
    if (!openTime) return false;
    if (!closeTime) return false;
    // if (!presaleType) return false;
    // if (!liquidityPercent) return false;
    // if (!whitelistArray) return false;
    // if (!listingPriceInWei) return false;
    // if (!lpTokensLockDurationInDays) return false;
    // if (!liquidityPercentageAllocation) return false;
    // if (!liquidityAllocationTime) return false;x
    return true;
  };

  const checkTime = () => {
    // openTime > block.timestamp &&
    // openVotingTime + safeLibrary.getVotingTime() + 86400 <= openTime &&
    // openTime < closeTime &&
    // closeTime < _cakeInfo.liquidityAllocationTime,
    // todo block timestamp
    const isOpenTimeMoreThanBlockTimestamp = openTime > new Date().getTime();
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

  const checkStakingBalance = async () => {
    try {
      const decimals = await ContractLessToken.decimals();
      const minCreatorStakedBalance = await ContractLessLibrary.getMinCreatorStakedBalance();
      const minCreatorStakedBalanceInEther = new BN(minCreatorStakedBalance)
        .div(new BN(10).pow(new BN(decimals)))
        .toString(10);
      const balance = await ContractStaking.getStakedBalance({ userAddress });
      const balanceInEther = new BN(balance).div(new BN(10).pow(new BN(decimals))).toString(10);
      // console.log('CreatePool checkStakingBalance:', { minCreatorStakedBalanceInEther, balanceInEther });
      if (balance < minCreatorStakedBalance)
        toggleModal({
          open: true,
          text: (
            <div className={s.messageContainer}>
              <p>
                To be able to create new pool, please stake {minCreatorStakedBalanceInEther} LESS
              </p>
              <p>Your staking balance is: {balanceInEther} LESS</p>
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
      console.log('Staking stake stakeValueBN:', totalSupply);
      const { addresses }: any = config;
      const spender = addresses[config.isMainnetOrTestnet][chainType].PresaleFactory;
      console.log('Staking stake spender:', spender);
      const allowance = await ContractLessToken.allowance({ userAddress, spender });
      console.log('Staking stake allowance:', allowance);
      if (allowance < totalSupply) {
        const resultApprove = await ContractLessToken.approve({
          userAddress,
          spender,
          amount: totalSupply,
        });
        console.log('Staking stake resultApprove:', resultApprove);
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
      console.log('handleSubmit:', { vestingPercent });
      if (!validateForm()) {
        setIsFormSubmitted(true);
        // return; // todo
      }
      if (!checkTime) return;
      // порядок полей менять нельзя!
      const presaleInfo = [
        tokenAddress,
        tokenPriceInWei,
        hardCapInWei,
        softCapInWei,
        // maxInvestInWei,
        // minInvestInWei, // 5
        openVotingTime,
        openTime,
        closeTime,
        // presaleType,
        // isLiquidity,
        // isAutomatically, // 10
        // isWhiteListed,
        // whitelistArray,
        // isVesting,
      ];
      // порядок полей менять нельзя!
      const presalePancakeSwapInfo = [
        listingPriceInWei,
        lpTokensLockDurationInDays,
        liquidityPercentageAllocation,
        liquidityAllocationTime,
      ];
      // порядок полей менять нельзя!
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

      console.log({ isPublic, presaleInfo, presalePancakeSwapInfo, presaleStringInfo });
      setIsFormSubmitted(true);
      const resultApprove = await approve();
      if (!resultApprove) return;
      // const resultCreatePresalePublic = await ContractPresaleFactory.createPresalePublic({
      //   userAddress,
      //   presaleInfo,
      //   presalePancakeSwapInfo,
      //   presaleStringInfo,
      // });
      // console.log('CreatePool handleSubmit', resultCreatePresalePublic);
      // if (resultCreatePresalePublic) await subscribeEvent('PublicPresaleCreated');
      // login to backend
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
        }
      }
    } catch (e) {
      console.error('PageCreatePool handleSubmit:', e);
    }
  };

  useEffect(() => {
    if (!userAddress) return;
    signMessage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAddress]);

  useEffect(() => {
    if (!ContractLessToken) return;
    if (!ContractLessLibrary) return;
    if (!ContractStaking) return;
    if (!userAddress) return;
    checkStakingBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ContractLessToken, ContractLessLibrary, ContractStaking, userAddress]);

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
            checkboxTitle="presale type"
            optionOne="Certified"
            optionTwo="Public"
            onChange={setIsPublic}
            defaultValue={!isPublic}
          />
          <div className={s.page_body}>
            <form action="" onSubmit={(e) => handleSubmit(e)}>
              <Input
                title="Sale title"
                value={saleTitle}
                onChange={setSaleTitle}
                error={handleError(saleTitle)}
              />
              <Input title="Description" value={description} onChange={setDescription} />
              <Input
                title="Token Contract Address"
                value={tokenAddress}
                onChange={setTokenAddress}
                error={handleError(tokenAddress)}
              />
              <Input
                title="Token Price (in wei)"
                value={tokenPriceInWei}
                onChange={setTokenPriceInWei}
                error={handleError(tokenPriceInWei)}
              />
              <div className={s.small_inputs}>
                <Input
                  title="Soft Cap (in wei)"
                  value={softCapInWei}
                  onChange={setSoftCapInWei}
                  error={handleError(softCapInWei)}
                />
                <Input
                  title="Hard Cap (in wei)"
                  value={hardCapInWei}
                  onChange={setHardCapInWei}
                  error={handleError(hardCapInWei)}
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
                  defaultValue={isLiquidity}
                  onChange={setIsLiquidity}
                  checkboxTitle="liquidity / without liquidity"
                  optionOne="Liquidity"
                  optionTwo="Without liquidity"
                />
              )}

              {/* Liquidity inputs */}
              {(isPublic || isLiquidity) && (
                <>
                  <Input
                    title="Liquidity Percent"
                    value={liquidityPercent}
                    onChange={setLiquidityPercent}
                    // error={handleError(liquidityPercent)}
                  />
                  <Input
                    title="Liquidity Percentage allocation"
                    value={liquidityPercentageAllocation}
                    onChange={setLiquidityPercentageAllocation}
                    // error={handleError(liquidityPercentageAllocation)}
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
                      defaultValue={isAutomatically}
                      onChange={setIsAutomatically}
                      checkboxTitle="Automatically / Not Automatically"
                      optionOne="Automatically"
                      optionTwo="Not Automatically"
                    />
                  )}
                  {/* Liquidity inputs end */}
                </>
              )}
              {!isPublic && (
                <>
                  <Checkbox
                    defaultValue={isWhiteListed}
                    onChange={setIsWhiteListed}
                    checkboxTitle="Whitelist / without whitelist"
                    optionOne="Whitelist"
                    optionTwo="Without whitelist"
                  />
                  {isWhiteListed && (
                    <Input title="Adresses" value={whitelist} onChange={setWhitelist} />
                  )}
                  <Checkbox
                    defaultValue={isVesting}
                    onChange={setIsVesting}
                    checkboxTitle="vesting / without vesting"
                    optionOne="Vesting"
                    optionTwo="Without vesting"
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
