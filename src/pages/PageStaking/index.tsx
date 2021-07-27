import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';

import maxImg from '../../assets/img/icons/max.svg';
import Button from '../../components/Button/index';
import YourTier from '../../components/YourTier/index';
import config from '../../config';
import { useContractsContext } from '../../contexts/ContractsContext';
import { convertFromWei, convertToWei } from '../../utils/ethereum';

import s from './Staking.module.scss';

const StakingPage: React.FC = () => {
  const { ContractStaking, ContractLessToken, ContractLPToken } = useContractsContext();

  const [lessDecimals, setLessDecimals] = useState('');
  const [lpDecimals, setLpDecimals] = useState('');

  const [balanceLessToken, setBalanceLessToken] = useState('0');
  const [balanceLPToken, setBalanceLPToken] = useState('0');
  const [stakedLess, setStakedLess] = useState('0.000');
  const [stakedLP, setStakedLP] = useState('0.000');

  const [stakeLessValue, setStakeLessValue] = useState('');
  const [stakeLPValue, setStakeLPValue] = useState('');

  const [unstakeLessValue, setUnstakeLessValue] = useState('');
  const [unstakeLPValue, setUnstakeLPValue] = useState('');

  const [lessRewards, setLessRewards] = useState('0.000');
  const [lpRewards, setLpRewards] = useState('0.000');
  const [rewardLessValue, setRewardLessValue] = useState('');
  const [rewardLPValue, setRewardLPValue] = useState('');

  const { chainType } = useSelector(({ wallet }: any) => wallet);
  const { address: userAddress } = useSelector(({ user }: any) => user);

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

  const getLessTokenBalance = async () => {
    try {
      const result = await ContractLessToken.balanceOf({ userAddress });
      const resultInEth = convertFromWei(result, lessDecimals);
      setBalanceLessToken(resultInEth);
      console.log('StakingPage getLessTokenBalance:', resultInEth);
    } catch (e) {
      console.error(e);
    }
  };

  const getLPTokenBalance = async () => {
    try {
      const result = await ContractLPToken.balanceOf({ userAddress });
      const resultInEth = convertFromWei(result, lpDecimals);
      setBalanceLPToken(resultInEth);
      console.log('StakingPage getLPTokenBalance:', resultInEth);
    } catch (e) {
      console.error(e);
    }
  };

  const getStakedLess = async () => {
    try {
      const result = await ContractStaking.getLessBalanceByAddress({ userAddress });
      const resultInEth = convertFromWei(result, lessDecimals);
      setStakedLess(resultInEth);
      console.log('StakingPage getStakedLess:', resultInEth);
    } catch (e) {
      console.error(e);
    }
  };

  const getStakedLP = async () => {
    try {
      const result = await ContractStaking.getLpBalanceByAddress({ userAddress });
      const resultInEth = convertFromWei(result, lpDecimals);
      setStakedLP(resultInEth);
      console.log('StakingPage getStakedLP:', resultInEth);
    } catch (e) {
      console.error(e);
    }
  };

  const getAmountOfUsersStakes = async () => {
    try {
      const amountOfUsersStakes = await ContractStaking.getAmountOfUsersStakes({ userAddress });
      console.log('StakingPage amountOfUsersStakes:', amountOfUsersStakes);
    } catch (e) {
      console.error(e);
    }
  };

  const getLessRewards = async () => {
    try {
      const result = await ContractStaking.getLessRewards({ userAddress });
      const resultInEth = convertFromWei(result, lessDecimals);
      setLessRewards(resultInEth);
      console.log('StakingPage getLessRewards:', resultInEth);
    } catch (e) {
      console.error(e);
    }
  };

  const getLpRewards = async () => {
    try {
      const result = await ContractStaking.getLpRewards({ userAddress });
      const resultInEth = convertFromWei(result, lpDecimals);
      setLpRewards(resultInEth);
      console.log('StakingPage getLpRewards:', resultInEth);
    } catch (e) {
      console.error(e);
    }
  };

  const stake = async () => {
    try {
      const { addresses }: any = config;
      const spender = addresses[config.isMainnetOrTestnet][chainType].Staking;
      // approve Less
      const stakeLessValueBN = convertToWei(stakeLessValue || 0, lessDecimals);
      console.log('StakingPage stake stakeLessValueBN:', stakeLessValueBN);
      const allowanceLess = await ContractLessToken.allowance({ userAddress, spender });
      console.log('StakingPage stake allowanceLess:', allowanceLess);
      if (stakeLessValueBN > 0 && allowanceLess <= stakeLessValueBN) {
        const resultApprove = await ContractLessToken.approve({
          userAddress,
          spender,
          amount: stakeLessValueBN,
        });
        console.log('StakingPage stake resultApprove:', resultApprove);
      }
      // approve LP
      const stakeLPValueBN = convertToWei(stakeLPValue || 0, lpDecimals);
      console.log('StakingPage stake stakeLPValueBN:', stakeLPValueBN);
      const allowanceLP = await ContractLPToken.allowance({ userAddress, spender });
      console.log('StakingPage stake allowanceLP:', allowanceLP);
      if (stakeLPValueBN > 0 && allowanceLP <= stakeLPValueBN) {
        const resultApprove = await ContractLPToken.approve({
          userAddress,
          spender,
          amount: stakeLPValueBN,
        });
        console.log('StakingPage stake resultApprove:', resultApprove);
      }
      // stake
      const result = await ContractStaking.stake({
        userAddress,
        lpAmount: stakeLPValueBN,
        lessAmount: stakeLessValueBN,
      });
      if (result) {
        getLessTokenBalance();
        getLPTokenBalance();
      }
      console.log('StakingPage stake:', result);
    } catch (e) {
      console.error('StakingPage stake:', e);
    }
  };

  const unstake = async () => {
    try {
      const unstakeLessValueBN = convertToWei(unstakeLessValue, lessDecimals);
      const rewardLessValueBN = convertToWei(rewardLessValue, lessDecimals);
      console.log('StakingPage unstake unstakeLessValueBN:', unstakeLessValueBN);

      const unstakeLpValueBN = convertToWei(unstakeLPValue, lpDecimals);
      const rewardLPValueBN = convertToWei(rewardLPValue, lpDecimals);
      console.log('StakingPage unstake unstakeLPValueBN:', unstakeLpValueBN);

      const result = await ContractStaking.unstake({
        userAddress,
        lpAmount: unstakeLessValueBN,
        lessAmount: unstakeLpValueBN,
        lessRewards: rewardLessValueBN,
        lpRewards: rewardLPValueBN,
      });
      if (result) {
        getLessTokenBalance();
        getLPTokenBalance();
      }
      console.log('StakingPage unstake:', result);
    } catch (e) {
      console.error('StakingPage unstake:', e);
    }
  };

  const handleSetMaxLessStake = () => {
    setStakeLessValue(balanceLessToken);
  };

  const handleSetMaxLPStake = () => {
    setStakeLPValue(balanceLPToken);
  };

  const handleSetMaxLessUnstake = () => {
    setUnstakeLessValue(stakedLess);
  };

  const handleSetMaxLPUnstake = () => {
    setUnstakeLPValue(stakedLP);
  };

  const handleSetMaxLessReward = () => {
    setRewardLessValue(lessRewards);
  };

  const handleSetMaxLPReward = () => {
    setRewardLPValue(lpRewards);
  };

  const getAllInfo = () => {
    getLPTokenBalance();
    getLessTokenBalance();
    getStakedLess();
    getStakedLP();
    getAmountOfUsersStakes();
    getLessRewards();
    getLpRewards();
  };

  useEffect(() => {
    if (!userAddress) return;
    if (!ContractStaking) return;
    getDecimals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ContractStaking, userAddress]);

  useEffect(() => {
    if (!lessDecimals) return;
    if (!lpDecimals) return;
    const interval = setInterval(() => {
      getAllInfo();
    }, 20000);
    getAllInfo();
    // eslint-disable-next-line consistent-return
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessDecimals, lpDecimals]);

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
                  <span>{Number(balanceLessToken).toFixed(3)}</span> $LESS
                </div>
                <div className={s.balance_subtitle}>Available to stake:</div>
                <div className={s.balance_amount}>
                  <div className={s.balance_amount__inner}>
                    <div className={s.balance_amount__money}>
                      <input
                        type="text"
                        placeholder="0.0"
                        value={stakeLessValue}
                        onChange={(e) => setStakeLessValue(e.target.value.replace(/[^\d.,]/g, ''))}
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
              </div>
              <div className={s.balance_inner}>
                <div className={s.balance_title}>
                  Your <span>ETH-$LESS LP</span> Balance
                </div>
                <div className={s.balance_bnb}>
                  <span>{Number(balanceLPToken).toFixed(3)}</span> ETH-$LESS LP
                </div>
                <div className={s.balance_subtitle}>Available to stake:</div>
                <div className={s.balance_amount}>
                  <div className={s.balance_amount__inner}>
                    <div className={s.balance_amount__money}>
                      <input
                        type="text"
                        placeholder="0.0"
                        value={stakeLPValue}
                        onChange={(e) => setStakeLPValue(e.target.value.replace(/[^\d.,]/g, ''))}
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
              </div>
            </div>
            <Button long onClick={stake}>
              Stake
            </Button>
          </div>
        </div>
        <YourTier className={s.your_tier} tier="king" />
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
                <span>{stakedLess} $LESS</span>
              </div>
              <div className={s.balance_amount}>
                <div className={s.balance_amount__inner}>
                  <div className={s.balance_amount__money}>
                    <input
                      type="text"
                      placeholder="0.0"
                      value={unstakeLessValue}
                      onChange={(e) => setUnstakeLessValue(e.target.value.replace(/[^\d.,]/g, ''))}
                    />
                  </div>
                  <div
                    className={s.balance_amount__img}
                    role="button"
                    tabIndex={0}
                    onClick={handleSetMaxLessUnstake}
                    onKeyDown={() => {}}
                  >
                    <img src={maxImg} alt="maxImg" />
                  </div>
                </div>
              </div>
            </div>
            <div className={s.small_balance}>
              <div className={s.small_balance_title}>
                <span>Already staked ETH-$LESS LP</span>
              </div>
              <div className={s.small_balance_subtitle}>
                <span>{stakedLP} ETH-$LESS LP</span>
              </div>
              <div className={s.balance_amount}>
                <div className={s.balance_amount__inner}>
                  <div className={s.balance_amount__money}>
                    <input
                      type="text"
                      placeholder="0.0"
                      value={unstakeLPValue}
                      onChange={(e) => setUnstakeLPValue(e.target.value.replace(/[^\d.,]/g, ''))}
                    />
                  </div>
                  <div
                    className={s.balance_amount__img}
                    role="button"
                    tabIndex={0}
                    onClick={handleSetMaxLPUnstake}
                    onKeyDown={() => {}}
                  >
                    <img src={maxImg} alt="maxImg" />
                  </div>
                </div>
              </div>
            </div>
            <div className={s.small_balance}>
              <div className={s.small_balance_title}>
                <span>$LESS Rewards</span>
              </div>
              <div className={s.small_balance_subtitle}>
                <span>{lessRewards} $LESS</span>
              </div>
              <div className={s.balance_amount}>
                <div className={s.balance_amount__inner}>
                  <div className={s.balance_amount__money}>
                    <input
                      type="text"
                      placeholder="0.0"
                      value={rewardLessValue}
                      onChange={(e) => setRewardLessValue(e.target.value.replace(/[^\d.,]/g, ''))}
                    />
                  </div>
                  <div
                    className={s.balance_amount__img}
                    role="button"
                    tabIndex={0}
                    onClick={handleSetMaxLessReward}
                    onKeyDown={() => {}}
                  >
                    <img src={maxImg} alt="maxImg" />
                  </div>
                </div>
              </div>
            </div>
            <div className={s.small_balance}>
              <div className={s.small_balance_title}>
                <span>ETH-$LESS LP Rewards</span>
              </div>
              <div className={s.small_balance_subtitle}>
                <span>{lpRewards} ETH-$LESS LP</span>
              </div>
              <div className={s.balance_amount}>
                <div className={s.balance_amount__inner}>
                  <div className={s.balance_amount__money}>
                    <input
                      type="text"
                      placeholder="0.0"
                      value={rewardLPValue}
                      onChange={(e) => setRewardLPValue(e.target.value.replace(/[^\d.,]/g, ''))}
                    />
                  </div>
                  <div
                    className={s.balance_amount__img}
                    role="button"
                    tabIndex={0}
                    onClick={handleSetMaxLPReward}
                    onKeyDown={() => {}}
                  >
                    <img src={maxImg} alt="maxImg" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={s.button_center}>
          <div
            role="button"
            tabIndex={0}
            onKeyDown={() => {}}
            onClick={unstake}
            className={s.balance_button}
          >
            Claim Rewards and Unstake
          </div>
        </div>
      </div>
    </div>
  );
};

export default StakingPage;
