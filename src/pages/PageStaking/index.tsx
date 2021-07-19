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
  const [stakeLessValue, setStakeLessValue] = useState('');
  const [stakeLPValue, setStakeLPValue] = useState('');

  const [alreadyStakedLess, setAlreadyStakedLess] = useState('');
  const [alreadyStakedEthLess, setAlreadyStakedEthLess] = useState('');
  const [lessRewards, setLessRewards] = useState('');
  const [ethLessRewards, setEthLessRewards] = useState('');

  const { chainType } = useSelector(({ wallet }: any) => wallet);
  const { address: userAddress } = useSelector(({ user }: any) => user);

  const decimals = async () => {
    return ContractLessToken.decimals();
  };

  const getLessTokenBalance = async () => {
    try {
      const result = await ContractLessToken.balanceOf({ userAddress });
      const ten = web3.utils.toBN(10);
      const decimalsBN = web3.utils.toBN(await decimals());
      const balance = new BN(result).div(ten.pow(decimalsBN)).toString(10);
      setBalanceLessToken(balance);
      console.log('Staking lessTokenBalanceOf:', balance);
    } catch (e) {
      console.error(e);
    }
  };

  const getLPTokenBalance = async () => {
    try {
      const result = await ContractLPToken.balanceOf({ userAddress });
      const ten = web3.utils.toBN(10);
      const decimalsBN = web3.utils.toBN(await decimals());
      const balance = new BN(result).div(ten.pow(decimalsBN)).toString(10);
      setBalanceLPToken(balance);
      console.log('Staking lpTokenBalanceOf:', balance);
    } catch (e) {
      console.error(e);
    }
  };

  // const getLessStakedBalance = async () => {
  //   try {
  //     const decimals = await ContractLessToken.decimals();
  //     const result = await ContractStaking.getLessBalance({ userAddress });
  //     const ten = web3.utils.toBN(10);
  //     const decimalsBN = web3.utils.toBN(decimals);
  //     const balance = new BN(result).div(ten.pow(decimalsBN)).toString(10);
  //     setStakeLessValue(balance);
  //     console.log('Staking getStakedBalance:', balance);
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };

  // const getLPStakedBalance = async () => {
  //   try {
  //     const decimals = await ContractLPToken.decimals();
  //     const result = await ContractStaking.getStakedBalance({ userAddress });
  //     const ten = web3.utils.toBN(10);
  //     const decimalsBN = web3.utils.toBN(decimals);
  //     const balance = new BN(result).div(ten.pow(decimalsBN)).toString(10);
  //     setStakeBalance(balance);
  //     console.log('Staking getStakedBalance:', balance);
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };

  const stake = async () => {
    try {
      const ten = web3.utils.toBN(10);
      const decimalsBN = web3.utils.toBN(await decimals());
      const stakeLessValueBN = new BN(stakeLessValue).mul(ten.pow(decimalsBN)).toString(10);
      const stakeLPValueBN = new BN(stakeLPValue).mul(ten.pow(decimalsBN)).toString(10);
      console.log('Staking stake stakeLessValueBN:', stakeLessValueBN);
      console.log('Staking stake stakeLPValueBN:', stakeLPValueBN);
      const { addresses }: any = config;
      const spender = addresses[config.isMainnetOrTestnet][chainType].Staking;
      const allowance = await ContractLessToken.allowance({ userAddress, spender });
      console.log('Staking stake allowance:', allowance);
      if (allowance <= stakeLessValueBN && allowance <= stakeLPValueBN) {
        const resultApprove = await ContractLessToken.approve({
          userAddress,
          spender,
          amount: stakeLessValueBN + stakeLPValueBN,
        });
        console.log('Staking stake resultApprove:', resultApprove);
      }
      const result = await ContractStaking.stakeTokens({
        userAddress,
        lpAmount: stakeLPValueBN,
        lessAmount: stakeLessValueBN,
      });
      if (result) {
        getLessTokenBalance();
        getLPTokenBalance();
      }
      console.log('Staking stake:', result);
    } catch (e) {
      console.error('Staking stake:', e);
    }
  };

  const unstake = async () => {
    try {
      const ten = web3.utils.toBN(10);
      const decimalsBN = web3.utils.toBN(await decimals());
      const unstakeLessValueBN = new BN(stakeLessValue).mul(ten.pow(decimalsBN)).toString(10);
      const unstakeLPValueBN = new BN(stakeLessValue).mul(ten.pow(decimalsBN)).toString(10);
      console.log('Staking unstake unstakeLessValueBN:', unstakeLessValueBN);
      console.log('Staking unstake unstakeLPValueBN:', unstakeLPValueBN);
      const result = await ContractStaking.unstake({
        userAddress,
        lpAmount: unstakeLessValueBN,
        lessAmount: unstakeLPValueBN,
      });
      if (result) {
        getLessTokenBalance();
        getLPTokenBalance();
      }
      console.log('Staking unstake:', result);
    } catch (e) {
      console.error('Staking unstake:', e);
    }
  };

  useEffect(() => {
    if (!userAddress) return;
    if (!ContractStaking) return;
    getLPTokenBalance();
    getLessTokenBalance();
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
                    <div className={s.balance_amount__img}>
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
                <div className={s.balance_subtitle}>Avaliable to unstake:</div>
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
                    <div className={s.balance_amount__img}>
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
                <span>0.000 Less</span>
              </div>
              <div className={s.balance_amount}>
                <div className={s.balance_amount__inner}>
                  <div className={s.balance_amount__money}>
                    <input
                      type="text"
                      placeholder="0.0"
                      value={alreadyStakedLess}
                      onChange={(e) => setAlreadyStakedLess(e.target.value.replace(/[^\d.,]/g, ''))}
                    />
                  </div>
                  <div className={s.balance_amount__img}>
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
                <span>0.000 ETH-$Less LP</span>
              </div>
              <div className={s.balance_amount}>
                <div className={s.balance_amount__inner}>
                  <div className={s.balance_amount__money}>
                    <input
                      type="text"
                      placeholder="0.0"
                      value={alreadyStakedEthLess}
                      onChange={(e) =>
                        setAlreadyStakedEthLess(e.target.value.replace(/[^\d.,]/g, ''))
                      }
                    />
                  </div>
                  <div className={s.balance_amount__img}>
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
                <span>0.000 BNB</span>
              </div>
              <div className={s.balance_amount}>
                <div className={s.balance_amount__inner}>
                  <div className={s.balance_amount__money}>
                    <input
                      type="text"
                      placeholder="0.0"
                      value={lessRewards}
                      onChange={(e) => setLessRewards(e.target.value.replace(/[^\d.,]/g, ''))}
                    />
                  </div>
                  <div className={s.balance_amount__img}>
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
                <span>0.000 BNB</span>
              </div>
              <div className={s.balance_amount}>
                <div className={s.balance_amount__inner}>
                  <div className={s.balance_amount__money}>
                    <input
                      type="text"
                      placeholder="0.0"
                      value={ethLessRewards}
                      onChange={(e) => setEthLessRewards(e.target.value.replace(/[^\d.,]/g, ''))}
                    />
                  </div>
                  <div className={s.balance_amount__img}>
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
