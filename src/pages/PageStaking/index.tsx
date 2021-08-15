import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';

import maxImg from '../../assets/img/icons/max.svg';
import Button from '../../components/Button/index';
import YourTier from '../../components/YourTier/index';
import config from '../../config';
import { useContractsContext } from '../../contexts/ContractsContext';
import useDebounce from '../../hooks/useDebounce';
import { modalActions } from '../../redux/actions';
import { convertFromWei, convertToWei } from '../../utils/ethereum';
import { prettyNumber } from '../../utils/prettifiers';

import Table from './Table';

import s from './Staking.module.scss';

const StakingPage: React.FC = () => {
  const { ContractStaking, ContractLessToken, ContractLPToken } = useContractsContext();

  const [lessDecimals, setLessDecimals] = useState<string>('');
  const [lpDecimals, setLpDecimals] = useState<string>('');

  const [balanceLessToken, setBalanceLessToken] = useState<string>('0');
  const [balanceLPToken, setBalanceLPToken] = useState<string>('0');
  const [stakedLess, setStakedLess] = useState<string | null>('0.000');
  const [stakedLP, setStakedLP] = useState<string | null>('0.000');
  const [userStakeIds, setUserStakeIds] = useState<string[]>([]);

  const [stakeLessValue, setStakeLessValue] = useState<string>('');
  const debouncedStakeLessValue = useDebounce(stakeLessValue, 500);
  const [stakeLPValue, setStakeLPValue] = useState<string>('');
  const debouncedStakeLpValue = useDebounce(stakeLPValue, 500);

  const [lessAllowance, setLessAllowance] = useState<number>(0);
  const [lpAllowance, setLpAllowance] = useState<number>(0);

  const [lessRewards, setLessRewards] = useState<string>('0.000');
  const [lpRewards, setLpRewards] = useState<string>('0.000');

  const [tier, setTier] = useState<string>('');

  const [isStakeWaiting, setIsStakeWaiting] = useState<boolean>(false);
  const [isApproveLessWaiting, setIsApproveLessWaiting] = useState<boolean>(false);
  const [isApproveLpWaiting, setIsApproveLpWaiting] = useState<boolean>(false);

  const { chainType } = useSelector(({ wallet }: any) => wallet);
  const { address: userAddress } = useSelector(({ user }: any) => user);

  const dispatch = useDispatch();
  const toggleModal = React.useCallback((params) => dispatch(modalActions.toggleModal(params)), [
    dispatch,
  ]);

  const isStakeLessValue = debouncedStakeLessValue !== '';
  const isStakeLPValue = debouncedStakeLpValue !== '';

  // const powLess = new BN(10).pow(lessDecimals);
  // const allowanceLessInEth = new BN(lessAllowance).div(powLess).toString(10);
  // console.log('StakingPage isLessAllowed:', allowanceLessInEth);
  const isLessAllowed = +lessAllowance >= +debouncedStakeLessValue;
  //
  // const powLp = new BN(10).pow(lpDecimals);
  // const allowanceLpInEth = new BN(lpAllowance).div(powLp).toString(10);
  // console.log('StakingPage isLpAllowed:', allowanceLpInEth);
  const isLpAllowed = +lpAllowance >= +debouncedStakeLpValue;

  // const isLessAllowed = useMemo(() => {
  //   const pow = new BN(10).pow(lessDecimals);
  //   const allowanceInEth = new BN(lessAllowance).div(pow).toString(10);
  //   console.log('StakingPage isLessAllowed:', allowanceInEth);
  //   return +allowanceInEth >= +debouncedStakeLessValue;
  // }, [lessAllowance, lessDecimals, debouncedStakeLessValue]);
  // const isLpAllowed = useMemo(() => {
  //   const pow = new BN(10).pow(lpDecimals);
  //   const allowanceInEth = new BN(lpAllowance).div(pow).toString(10);
  //   console.log('StakingPage isLpAllowed:', allowanceInEth);
  //   return +allowanceInEth >= +debouncedStakeLpValue;
  // }, [lpAllowance, lpDecimals, debouncedStakeLpValue]);

  const stakingContractAddress = config.addresses[config.isMainnetOrTestnet][chainType].Staking;

  const getDecimals = useCallback(async () => {
    try {
      const resultLessDecimals = await ContractLessToken.decimals();
      setLessDecimals(resultLessDecimals);
      const resultLpDecimals = await ContractLPToken.decimals();
      setLpDecimals(resultLpDecimals);
    } catch (e) {
      console.error(e);
    }
  }, [ContractLessToken, ContractLPToken]);

  const getAllowances = useCallback(async () => {
    try {
      const resultLessAllowance = await ContractLessToken.allowance({
        userAddress,
        spender: stakingContractAddress,
      });
      setLessAllowance(resultLessAllowance);
      console.log('StakingPage getAllowances:', { resultLessAllowance });
      const resultLpAllowance = await ContractLPToken.allowance({
        userAddress,
        spender: stakingContractAddress,
      });
      setLpAllowance(resultLpAllowance);
      console.log('StakingPage getAllowances:', { resultLpAllowance });
    } catch (e) {
      console.error(e);
    }
  }, [ContractLessToken, ContractLPToken, stakingContractAddress, userAddress]);

  const getTier = useCallback(async () => {
    try {
      const userTier = await ContractStaking.getUserTier({ userAddress });
      setTier(userTier);
    } catch (e) {
      console.error(e);
    }
  }, [ContractStaking, userAddress]);

  const getLessTokenBalance = useCallback(async () => {
    try {
      const result = await ContractLessToken.balanceOf({ userAddress });
      setBalanceLessToken(result);
      console.log('StakingPage getLessTokenBalance:', result);
    } catch (e) {
      console.error(e);
    }
  }, [ContractLessToken, userAddress]);

  const getLPTokenBalance = useCallback(async () => {
    try {
      const result = await ContractLPToken.balanceOf({ userAddress });
      setBalanceLPToken(result);
      console.log('StakingPage getLPTokenBalance:', result);
    } catch (e) {
      console.error(e);
    }
  }, [ContractLPToken, userAddress]);

  const getStakedLess = useCallback(async () => {
    try {
      const result = await ContractStaking.getLessBalanceByAddress({ userAddress });
      const resultInEth = convertFromWei(result, lessDecimals);
      setStakedLess(resultInEth);
      console.log('StakingPage getStakedLess:', resultInEth);
    } catch (e) {
      console.error(e);
    }
  }, [ContractStaking, userAddress, lessDecimals]);

  const getStakedLP = useCallback(async () => {
    try {
      const result = await ContractStaking.getLpBalanceByAddress({ userAddress });
      const resultInEth = convertFromWei(result, lpDecimals);
      setStakedLP(resultInEth);
      console.log('StakingPage getStakedLP:', resultInEth);
    } catch (e) {
      console.error(e);
    }
  }, [ContractStaking, userAddress, lpDecimals]);

  const getUserStakeIds = useCallback(async () => {
    try {
      const resultGetUserStakeIds = await ContractStaking.getUserStakeIds({ userAddress });
      console.log('StakingPage getUserStakeIds:', resultGetUserStakeIds);
      setUserStakeIds(resultGetUserStakeIds);
    } catch (e) {
      console.error(e);
    }
  }, [ContractStaking, userAddress]);

  const getAmountOfUsersStakes = useCallback(async () => {
    try {
      const amountOfUsersStakes = await ContractStaking.getAmountOfUsersStakes({ userAddress });
      console.log('StakingPage amountOfUsersStakes:', amountOfUsersStakes);
    } catch (e) {
      console.error(e);
    }
  }, [ContractStaking, userAddress]);

  const getLessRewards = useCallback(async () => {
    try {
      const result = await ContractStaking.getLessRewards({ userAddress });
      setLessRewards(result);
      console.log('StakingPage getLessRewards:', result);
    } catch (e) {
      console.error(e);
    }
  }, [ContractStaking, userAddress]);

  const getLpRewards = useCallback(async () => {
    try {
      const result = await ContractStaking.getLpRewards({ userAddress });
      setLpRewards(result);
      console.log('StakingPage getLpRewards:', result);
    } catch (e) {
      console.error(e);
    }
  }, [ContractStaking, userAddress]);

  const checkLessValue = useCallback(() => {
    try {
      if (!isStakeLessValue || +debouncedStakeLessValue === 0) {
        toggleModal({
          open: true,
          text: (
            <div className={s.messageContainer}>
              <p>Please, enter one of the tokens amounts</p>
            </div>
          ),
        });
        return false;
      }
      return true;
    } catch (e) {
      console.error('StakingPage checkValues:', e);
      return false;
    }
  }, [isStakeLessValue, debouncedStakeLessValue, toggleModal]);

  const checkLpValue = useCallback(() => {
    try {
      if (!isStakeLPValue || +debouncedStakeLpValue === 0) {
        toggleModal({
          open: true,
          text: (
            <div className={s.messageContainer}>
              <p>Please, enter one of the tokens amounts</p>
            </div>
          ),
        });
        return false;
      }
      return true;
    } catch (e) {
      console.error('StakingPage checkValues:', e);
      return false;
    }
  }, [isStakeLPValue, debouncedStakeLpValue, toggleModal]);

  const checkLessBalance = useCallback(() => {
    try {
      if (isStakeLessValue && +stakeLessValue > +balanceLessToken) {
        toggleModal({
          open: true,
          text: (
            <div className={s.messageContainer}>
              <p>Insufficient $LESS balance</p>
            </div>
          ),
        });
        return false;
      }
      return true;
    } catch (e) {
      console.error('StakingPage checkLessBalance:', e);
      return false;
    }
  }, [isStakeLessValue, stakeLessValue, balanceLessToken, toggleModal]);

  const checkLpBalance = useCallback(() => {
    try {
      if (isStakeLPValue && +stakeLPValue > +balanceLPToken) {
        toggleModal({
          open: true,
          text: (
            <div className={s.messageContainer}>
              <p>Insufficient ETH-LESS LP balance</p>
            </div>
          ),
        });
        return false;
      }
      return true;
    } catch (e) {
      console.error('StakingPage checkLpBalance:', e);
      return false;
    }
  }, [isStakeLPValue, stakeLPValue, balanceLPToken, toggleModal]);

  const approveLess = useCallback(async () => {
    try {
      if (!checkLessValue()) return;
      if (!checkLessBalance()) return;
      const stakeLessValueInWei = convertToWei(debouncedStakeLessValue || 0, lessDecimals);
      console.log('StakingPage approveLess:', stakeLessValueInWei);
      setIsApproveLessWaiting(true);
      const resultApprove = await ContractLessToken.approve({
        userAddress,
        spender: stakingContractAddress,
        amount: stakeLessValueInWei,
      });
      console.log('StakingPage approveLess:', resultApprove);
      await getAllowances();
      setIsApproveLessWaiting(false);
    } catch (e) {
      setIsApproveLessWaiting(false);
      console.error(e);
    }
  }, [
    ContractLessToken,
    checkLessValue,
    checkLessBalance,
    debouncedStakeLessValue,
    lessDecimals,
    getAllowances,
    stakingContractAddress,
    userAddress,
  ]);

  const approveLp = useCallback(async () => {
    try {
      if (!checkLpValue()) return;
      if (!checkLpBalance()) return;
      const stakeLpValueInWei = convertToWei(debouncedStakeLpValue || 0, lpDecimals);
      console.log('StakingPage approveLess:', stakeLpValueInWei);
      setIsApproveLpWaiting(true);
      const resultApprove = await ContractLPToken.approve({
        userAddress,
        spender: stakingContractAddress,
        amount: stakeLpValueInWei,
      });
      console.log('StakingPage approveLp:', resultApprove);
      await getAllowances();
      setIsApproveLpWaiting(false);
    } catch (e) {
      setIsApproveLpWaiting(false);
      console.error(e);
    }
  }, [
    ContractLPToken,
    checkLpValue,
    checkLpBalance,
    debouncedStakeLpValue,
    lpDecimals,
    getAllowances,
    stakingContractAddress,
    userAddress,
  ]);

  const checkAllowancesAndFields = useCallback(() => {
    try {
      if (!isStakeLessValue && !isStakeLPValue) {
        toggleModal({
          open: true,
          text: (
            <div className={s.messageContainer}>
              <p>Please, enter stake values</p>
            </div>
          ),
        });
        return false;
      }
      if (isStakeLessValue && isStakeLPValue && !isLessAllowed && !isLpAllowed) {
        toggleModal({
          open: true,
          text: (
            <div className={s.messageContainer}>
              <p>Please, approve $LESS and ETH-LESS LP tokens to stake</p>
            </div>
          ),
        });
        return false;
      }
      if (isStakeLessValue && !isLessAllowed) {
        toggleModal({
          open: true,
          text: (
            <div className={s.messageContainer}>
              <p>Please, approve $LESS tokens to stake</p>
            </div>
          ),
        });
        return false;
      }
      if (isStakeLPValue && !isLpAllowed) {
        toggleModal({
          open: true,
          text: (
            <div className={s.messageContainer}>
              <p>Please, approve ETH-LESS LP tokens to stake</p>
            </div>
          ),
        });
        return false;
      }
      return true;
    } catch (e) {
      console.error('StakingPage stake:', e);
      return false;
    }
  }, [isStakeLessValue, isStakeLPValue, isLessAllowed, isLpAllowed, toggleModal]);

  const stake = useCallback(async () => {
    try {
      if (isStakeLessValue && !checkLessBalance()) return;
      if (isStakeLPValue && !checkLpBalance()) return;
      if (!checkAllowancesAndFields()) return;
      const stakeLessValueInWei = convertToWei(debouncedStakeLessValue || 0, lessDecimals);
      const stakeLpValueInWei = convertToWei(debouncedStakeLpValue || 0, lpDecimals);
      setIsStakeWaiting(true);
      const result = await ContractStaking.stake({
        userAddress,
        lessAmount: stakeLessValueInWei,
        lpAmount: stakeLpValueInWei,
      });
      if (result) {
        setStakeLessValue('');
        setStakeLPValue('');
        getLessTokenBalance();
        getLPTokenBalance();
        getTier();
        getUserStakeIds();
      }
      setIsStakeWaiting(false);
      console.log('StakingPage stake:', result);
    } catch (e) {
      setIsStakeWaiting(false);
      console.error('StakingPage stake:', e);
    }
  }, [
    ContractStaking,
    checkLessBalance,
    checkLpBalance,
    checkAllowancesAndFields,
    debouncedStakeLessValue,
    debouncedStakeLpValue,
    lessDecimals,
    lpDecimals,
    getLessTokenBalance,
    getLPTokenBalance,
    getTier,
    getUserStakeIds,
    isStakeLessValue,
    isStakeLPValue,
    userAddress,
  ]);

  const handleChangeStakeLessValue = (e) => {
    const value = e.target.value.replace(/[^\d.,]/g, '').replace(/,/g, '.');
    // console.log('Staking handleChangeStakeLessValue:', value);
    setStakeLessValue(value);
  };

  const handleChangeStakeLpValue = (e) => {
    const value = e.target.value.replace(/[^\d.,]/g, '').replace(/,/g, '.');
    // console.log('Staking handleChangeStakeLpValue:', value);
    setStakeLPValue(value);
  };

  const handleSetMaxLessStake = () => {
    setStakeLessValue(balanceLessToken);
  };

  const handleSetMaxLPStake = () => {
    setStakeLPValue(balanceLPToken);
  };

  const onUnstake = () => {
    getUserStakeIds();
  };

  const getAllInfo = useCallback(() => {
    getTier();
    getLPTokenBalance();
    getLessTokenBalance();
    getStakedLess();
    getStakedLP();
    getAmountOfUsersStakes();
    getLessRewards();
    getLpRewards();
  }, [
    getTier,
    getLPTokenBalance,
    getLessTokenBalance,
    getStakedLess,
    getStakedLP,
    getAmountOfUsersStakes,
    getLessRewards,
    getLpRewards,
  ]);

  useEffect(() => {
    if (!userAddress) return;
    if (!ContractStaking) return;
    getUserStakeIds();
    getDecimals();
  }, [ContractStaking, userAddress, getUserStakeIds, getDecimals]);

  useEffect(() => {
    if (!userAddress) return;
    if (!ContractLessToken) return;
    if (!ContractLPToken) return;
    getAllowances();
  }, [
    ContractLessToken,
    ContractLPToken,
    userAddress,
    debouncedStakeLessValue,
    debouncedStakeLpValue,
    getAllowances,
  ]);

  useEffect(() => {
    if (!userAddress) return () => {};
    if (!lessDecimals) return () => {};
    if (!lpDecimals) return () => {};
    const interval = setInterval(() => {
      getAllInfo();
    }, 20000);
    getAllInfo();
    return () => clearInterval(interval);
  }, [lessDecimals, lpDecimals, userAddress, getAllInfo]);

  return (
    <div className={s.page}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Staking | Lesspad</title>
        <meta name="description" content="Staking" />
      </Helmet>

      <div className={s.container}>
        <div className={s.inner}>
          <div className={s.title}>Staking</div>
          <div className={s.balance}>
            <div className={s.small_balances}>
              <div className={s.balance_inner}>
                <div className={s.balance_title}>
                  Your <span>$LESS</span> Balance
                </div>
                <div className={s.balance_bnb}>
                  <span>{prettyNumber(balanceLessToken)}</span> $LESS
                </div>
                <div className={s.balance_subtitle}>Available to stake:</div>
                <div className={s.balance_amount}>
                  <div className={s.balance_amount__inner}>
                    <div className={s.balance_amount__money}>
                      <input
                        type="text"
                        placeholder="0.0"
                        value={stakeLessValue}
                        onChange={handleChangeStakeLessValue}
                      />
                    </div>
                    <div
                      className={s.balance_amount__img}
                      role="button"
                      tabIndex={0}
                      onClick={handleSetMaxLessStake}
                      onKeyDown={() => {}}
                    >
                      <img src={maxImg} alt="maxImg" />
                    </div>
                  </div>
                </div>
                {debouncedStakeLessValue && !isLessAllowed ? (
                  isApproveLessWaiting ? (
                    <Button long onClick={() => {}}>
                      Waiting...
                    </Button>
                  ) : (
                    <Button long onClick={approveLess}>
                      Approve
                    </Button>
                  )
                ) : null}
              </div>
              <div className={s.balance_inner}>
                <div className={s.balance_title}>
                  Your <span>ETH-LESS LP</span> Balance
                </div>
                <div className={s.balance_bnb}>
                  <span>{prettyNumber(balanceLPToken)}</span> ETH-LESS LP
                </div>
                <div className={s.balance_subtitle}>Available to stake:</div>
                <div className={s.balance_amount}>
                  <div className={s.balance_amount__inner}>
                    <div className={s.balance_amount__money}>
                      <input
                        type="text"
                        placeholder="0.0"
                        value={stakeLPValue}
                        onChange={handleChangeStakeLpValue}
                      />
                    </div>
                    <div
                      className={s.balance_amount__img}
                      role="button"
                      tabIndex={0}
                      onClick={handleSetMaxLPStake}
                      onKeyDown={() => {}}
                    >
                      <img src={maxImg} alt="maxImg" />
                    </div>
                  </div>
                </div>
                {debouncedStakeLpValue && !isLpAllowed ? (
                  isApproveLpWaiting ? (
                    <Button long onClick={() => {}}>
                      Waiting...
                    </Button>
                  ) : (
                    <Button long onClick={approveLp}>
                      Approve
                    </Button>
                  )
                ) : null}
              </div>
            </div>
            {isStakeWaiting ? (
              <Button long onClick={() => {}}>
                Waiting...
              </Button>
            ) : (
              <Button long onClick={stake}>
                Stake
              </Button>
            )}
          </div>
        </div>

        {/* Your tier */}
        <YourTier className={s.your_tier} tier={tier} />

        {/* 4 поля ввода внизу */}
        <div className={s.bottom_table}>
          <div className={s.bottom_table__title}>
            <span>Already staked and your Rewards</span>
          </div>
          <div className={`${s.small_balances} ${s.wide}`}>
            <div className={s.small_balance}>
              <div className={s.small_balance_title}>
                <span>Already staked $LESS</span>
              </div>
              <div className={s.small_balance_subtitle}>
                <span>{prettyNumber(stakedLess || '0')} $LESS</span>
              </div>
              {/*<div className={s.balance_amount}>*/}
              {/*  <div className={s.balance_amount__inner}>*/}
              {/*    <div className={s.balance_amount__money}>*/}
              {/*      <input*/}
              {/*        type="text"*/}
              {/*        placeholder="0.0"*/}
              {/*        value={unstakeLessValue}*/}
              {/*        onChange={(e) => setUnstakeLessValue(e.target.value.replace(/[^\d.,]/g, ''))}*/}
              {/*      />*/}
              {/*    </div>*/}
              {/*    <div*/}
              {/*      className={s.balance_amount__img}*/}
              {/*      role="button"*/}
              {/*      tabIndex={0}*/}
              {/*      onClick={handleSetMaxLessUnstake}*/}
              {/*      onKeyDown={() => {}}*/}
              {/*    >*/}
              {/*      <img src={maxImg} alt="maxImg" />*/}
              {/*    </div>*/}
              {/*  </div>*/}
              {/*</div>*/}
            </div>
            <div className={s.small_balance}>
              <div className={s.small_balance_title}>
                <span>Already staked ETH-LESS LP</span>
              </div>
              <div className={s.small_balance_subtitle}>
                <span>{prettyNumber(stakedLP || '0')} ETH-LESS LP</span>
              </div>
              {/*<div className={s.balance_amount}>*/}
              {/*  <div className={s.balance_amount__inner}>*/}
              {/*    <div className={s.balance_amount__money}>*/}
              {/*      <input*/}
              {/*        type="text"*/}
              {/*        placeholder="0.0"*/}
              {/*        value={unstakeLPValue}*/}
              {/*        onChange={(e) => setUnstakeLPValue(e.target.value.replace(/[^\d.,]/g, ''))}*/}
              {/*      />*/}
              {/*    </div>*/}
              {/*    <div*/}
              {/*      className={s.balance_amount__img}*/}
              {/*      role="button"*/}
              {/*      tabIndex={0}*/}
              {/*      onClick={handleSetMaxLPUnstake}*/}
              {/*      onKeyDown={() => {}}*/}
              {/*    >*/}
              {/*      <img src={maxImg} alt="maxImg" />*/}
              {/*    </div>*/}
              {/*  </div>*/}
              {/*</div>*/}
            </div>
            <div className={s.small_balance}>
              <div className={s.small_balance_title}>
                <span>$LESS Rewards</span>
              </div>
              <div className={s.small_balance_subtitle}>
                <span>{prettyNumber(lessRewards)} $LESS</span>
              </div>
              {/*<div className={s.balance_amount}>*/}
              {/*  <div className={s.balance_amount__inner}>*/}
              {/*    <div className={s.balance_amount__money}>*/}
              {/*      <input*/}
              {/*        type="text"*/}
              {/*        placeholder="0.0"*/}
              {/*        value={rewardLessValue}*/}
              {/*        onChange={(e) => setRewardLessValue(e.target.value.replace(/[^\d.,]/g, ''))}*/}
              {/*      />*/}
              {/*    </div>*/}
              {/*    <div*/}
              {/*      className={s.balance_amount__img}*/}
              {/*      role="button"*/}
              {/*      tabIndex={0}*/}
              {/*      onClick={handleSetMaxLessReward}*/}
              {/*      onKeyDown={() => {}}*/}
              {/*    >*/}
              {/*      <img src={maxImg} alt="maxImg" />*/}
              {/*    </div>*/}
              {/*  </div>*/}
              {/*</div>*/}
            </div>
            <div className={s.small_balance}>
              <div className={s.small_balance_title}>
                <span>ETH-LESS LP Rewards</span>
              </div>
              <div className={s.small_balance_subtitle}>
                <span>{prettyNumber(lpRewards)} ETH-LESS LP</span>
              </div>
              {/*<div className={s.balance_amount}>*/}
              {/*  <div className={s.balance_amount__inner}>*/}
              {/*    <div className={s.balance_amount__money}>*/}
              {/*      <input*/}
              {/*        type="text"*/}
              {/*        placeholder="0.0"*/}
              {/*        value={rewardLPValue}*/}
              {/*        onChange={(e) => setRewardLPValue(e.target.value.replace(/[^\d.,]/g, ''))}*/}
              {/*      />*/}
              {/*    </div>*/}
              {/*    <div*/}
              {/*      className={s.balance_amount__img}*/}
              {/*      role="button"*/}
              {/*      tabIndex={0}*/}
              {/*      onClick={handleSetMaxLPReward}*/}
              {/*      onKeyDown={() => {}}*/}
              {/*    >*/}
              {/*      <img src={maxImg} alt="maxImg" />*/}
              {/*    </div>*/}
              {/*  </div>*/}
              {/*</div>*/}
            </div>
          </div>
        </div>
        <Table data={userStakeIds} onUnstake={onUnstake} />
        {/*<div className={s.button_center}>*/}
        {/*  <div*/}
        {/*    role="button"*/}
        {/*    tabIndex={0}*/}
        {/*    onKeyDown={() => {}}*/}
        {/*    onClick={unstake}*/}
        {/*    className={s.balance_button}*/}
        {/*  >*/}
        {/*    Claim Rewards and Unstake*/}
        {/*  </div>*/}
        {/*</div>*/}
      </div>
    </div>
  );
};

export default StakingPage;
