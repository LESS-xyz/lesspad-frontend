import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';
import web3 from 'web3';

import maxImg from '../../assets/img/icons/max.svg';
import Button from '../../components/Button/index';
import YourTier from '../../components/YourTier/index';
import config from '../../config';
import { useContractsContext } from '../../contexts/ContractsContext';

import s from './Staking.module.scss';

const { BN }: any = web3.utils;

const StakingPage: React.FC = () => {
  const { ContractStaking, ContractLessToken, ContractLPToken } = useContractsContext();

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

  const getLessTokenBalance = async () => {
    try {
      const result = await ContractLessToken.balanceOf({ userAddress });
      const ten = web3.utils.toBN(10);
      const decimalsLess = await ContractLessToken.decimals();
      const decimalsBN = web3.utils.toBN(decimalsLess);
      const balance = new BN(result).div(ten.pow(decimalsBN)).toString(10);
      setBalanceLessToken(balance);
      console.log('StakingPage getLessTokenBalance:', balance);
    } catch (e) {
      console.error(e);
    }
  };

  const getLPTokenBalance = async () => {
    try {
      const result = await ContractLPToken.balanceOf({ userAddress });
      const ten = web3.utils.toBN(10);
      const decimalsLP = await ContractLPToken.decimals();
      const decimalsBN = web3.utils.toBN(decimalsLP);
      const balance = new BN(result).div(ten.pow(decimalsBN)).toString(10);
      setBalanceLPToken(balance);
      console.log('StakingPage getLPTokenBalance:', balance);
    } catch (e) {
      console.error(e);
    }
  };

  const getStakedLess = async () => {
    try {
      const decimals = await ContractLessToken.decimals();
      const result = await ContractStaking.getLessBalanceByAddress({ userAddress });
      const ten = web3.utils.toBN(10);
      const decimalsBN = web3.utils.toBN(decimals);
      const balance = new BN(result).div(ten.pow(decimalsBN)).toString(10);
      setStakedLess(balance);
      console.log('StakingPage getStakedLess:', balance);
    } catch (e) {
      console.error(e);
    }
  };

  const getStakedLP = async () => {
    try {
      const decimals = await ContractLPToken.decimals();
      const result = await ContractStaking.getLpBalanceByAddress({ userAddress });
      const ten = web3.utils.toBN(10);
      const decimalsBN = web3.utils.toBN(decimals);
      const balance = new BN(result).div(ten.pow(decimalsBN)).toString(10);
      setStakedLP(balance);
      console.log('StakingPage getStakedLP:', balance);
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
      const resultGetLessRewards = await ContractStaking.getLessRewards({ userAddress });
      setLessRewards(resultGetLessRewards);
      console.log('StakingPage resultGetLessRewards:', resultGetLessRewards);
    } catch (e) {
      console.error(e);
    }
  };

  const getLpRewards = async () => {
    try {
      const resultGetLpRewards = await ContractStaking.getLpRewards({ userAddress });
      setLpRewards(resultGetLpRewards);
      console.log('StakingPage resultGetLpRewards:', resultGetLpRewards);
    } catch (e) {
      console.error(e);
    }
  };

  const stake = async () => {
    try {
      const ten = web3.utils.toBN(10);
      const { addresses }: any = config;
      const spender = addresses[config.isMainnetOrTestnet][chainType].Staking;
      // approve Less
      const decimalsLess = await ContractLessToken.decimals();
      const decimalsLessBN = web3.utils.toBN(decimalsLess);
      const stakeLessValueBN = new BN(stakeLessValue || 0)
        .mul(ten.pow(decimalsLessBN))
        .toString(10);
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
      const decimalsLP = await ContractLPToken.decimals();
      const decimalsLPBN = web3.utils.toBN(decimalsLP);
      const stakeLPValueBN = new BN(stakeLPValue || 0).mul(ten.pow(decimalsLPBN)).toString(10);
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

  // todo unstake less/LP, rewards
  const unstake = async () => {
    try {
      const ten = web3.utils.toBN(10);
      const decimalsLess = await ContractLessToken.decimals();
      const decimalsBN = web3.utils.toBN(decimalsLess);
      const unstakeLessValueBN = new BN(stakeLessValue).mul(ten.pow(decimalsBN)).toString(10);
      const unstakeLPValueBN = new BN(stakeLessValue).mul(ten.pow(decimalsBN)).toString(10);
      console.log('StakingPage unstake unstakeLessValueBN:', unstakeLessValueBN);
      console.log('StakingPage unstake unstakeLPValueBN:', unstakeLPValueBN);
      const result = await ContractStaking.unstake({
        userAddress,
        lpAmount: unstakeLessValueBN,
        lessAmount: unstakeLPValueBN,
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

  useEffect(() => {
    if (!userAddress) return;
    if (!ContractStaking) return;
    const interval = setInterval(() => {
      getLPTokenBalance();
      getLessTokenBalance();
      getStakedLess();
      getStakedLP();
      getAmountOfUsersStakes();
      getLessRewards();
      getLpRewards();
    }, 20000);
    getLPTokenBalance();
    getLessTokenBalance();
    getStakedLess();
    getStakedLP();
    getAmountOfUsersStakes();
    getLessRewards();
    getLpRewards();
    // eslint-disable-next-line consistent-return
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ContractStaking, userAddress]);

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
                  Your <span>$Less</span> Balance
                </div>
                <div className={s.balance_bnb}>
                  <span>{Number(balanceLessToken).toFixed(3)}</span> $Less
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
                  Your <span>ETH-$Less LP</span> Balance
                </div>
                <div className={s.balance_bnb}>
                  <span>{Number(balanceLPToken).toFixed(3)}</span> ETH-$Less LP
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
                <span>Already staked $Less</span>
              </div>
              <div className={s.small_balance_subtitle}>
                <span>{stakedLess} Less</span>
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
                <span>Already staked ETH-$Less LP</span>
              </div>
              <div className={s.small_balance_subtitle}>
                <span>{stakedLP} ETH-$Less LP</span>
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
                <span>$Less Rewards</span>
              </div>
              <div className={s.small_balance_subtitle}>
                <span>{lessRewards} BNB</span>
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
                <span>ETH-$Less LP Rewards</span>
              </div>
              <div className={s.small_balance_subtitle}>
                <span>{lpRewards} BNB</span>
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
          <div role="button" tabIndex={0} onKeyPress={unstake} className={s.balance_button}>
            Claim Rewards and Unstake
          </div>
        </div>
      </div>
    </div>
  );
};

export default StakingPage;
