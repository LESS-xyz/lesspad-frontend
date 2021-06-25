import React, { useEffect, useState } from 'react';
import s from './Staking.module.scss';
import Button from '../../components/Button/index';
import maxImg from '../../assets/img/icons/max.svg';
import { useContractsContext } from "../../contexts/ContractsContext";
import { useSelector } from "react-redux";
import web3 from 'web3';

const { BN }: any = web3.utils;

const StakingPage: React.FC = () => {
  const { ContractStaking, ContractLessToken } = useContractsContext();

  const [stakedBalance, setStakedBalance] = useState('0');
  const [balanceLessToken, setBalanceLessToken] = useState('0');
  const [stakeValue, setStakeValue] = useState('');
  const [unstakeValue, setUnstakeValue] = useState('');

  const { chainType } = useSelector(({ wallet }: any) => wallet);
  const { address: userAddress, balance: userBalance } = useSelector(({ user }: any) => user);

  const isEthereum = chainType === 'Ethereum';
  const isBinanceSmartChain = chainType === 'Binance-Smart-Chain';
  const currency = isEthereum ? 'ETH' : isBinanceSmartChain ? 'BNB' : 'MATIC';

  const getLessTokenBalance = async () => {
    try {
      const decimals = await ContractLessToken.decimals();
      const result = await ContractLessToken.balanceOf({ userAddress });
      const ten = web3.utils.toBN(10);
      const decimalsBN = web3.utils.toBN(decimals);
      const balance = new BN(result).div(ten.pow(decimalsBN)).toString(10);
      setBalanceLessToken(balance);
      console.log('Staking lessTokenBalanceOf:', balance);
    } catch (e) {
      console.error(e);
    }
  };

  const getStakedBalance = async () => {
    try {
      const decimals = await ContractLessToken.decimals();
      const result = await ContractStaking.getStakedBalance({ userAddress });
      const ten = web3.utils.toBN(10);
      const decimalsBN = web3.utils.toBN(decimals);
      const balance = new BN(result).div(ten.pow(decimalsBN)).toString(10);
      setStakedBalance(balance);
      console.log('Staking getStakedBalance:', balance);
    } catch (e) {
      console.error(e);
    }
  };

  const stake = async () => {
    try {
      const decimals = await ContractLessToken.decimals();
      const ten = web3.utils.toBN(10);
      const decimalsBN = web3.utils.toBN(decimals);
      const stakeValueBN = new BN(stakeValue).mul(ten.pow(decimalsBN)).toString(10);
      console.log('Staking stake stakeValueBN:', stakeValueBN);
      const allowance = await ContractLessToken.allowance({ userAddress });
      console.log('Staking stake allowance:', allowance);
      if (allowance < stakeValueBN) {
        const resultApprove = await ContractLessToken.approve({ userAddress, amount: stakeValueBN });
        console.log('Staking stake resultApprove:', resultApprove);
      };
      const result = await ContractStaking.stake({ amount: stakeValueBN });
      console.log('Staking stake:', result);
    } catch (e) {
      console.error(e);
    }
  };

  const unstake = async () => {
    try {
      const decimals = await ContractLessToken.decimals();
      const ten = web3.utils.toBN(10);
      const decimalsBN = web3.utils.toBN(decimals);
      const unstakeValueBN = new BN(unstakeValue).mul(ten.pow(decimalsBN)).toString(10);
      console.log('Staking unstake unstakeValueBN:', unstakeValueBN);
      const result = await ContractStaking.unstake({ amount: unstakeValueBN });
      console.log('Staking stake:', result);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (!userAddress) return;
    if (!ContractStaking) return;
    getStakedBalance();
    getLessTokenBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ContractStaking, userAddress]);

  return (
    <div className={s.page}>
      <div className={s.container}>
        <div className={s.inner}>
          <div className={s.title}>Your Wallet</div>
          <div className={s.balance}>
            <div className={s.balance_inner}>
              <div className={s.balance_title}>
                <span>{currency}</span> Balance
              </div>
              <div className={s.balance_bnb}>{userBalance} {currency}</div>
              <div className={s.balance_usd}>0 USD</div>
              <div className={s.balance_subinfo}>
                You have earned 0 BNB. Click now &apos;Claim Rewards&apos; to add the amount to your
                balance.
              </div>
              <div className={s.balance_button}>Claim Rewards</div>
            </div>
          </div>
          <div className={s.small_balances}>
            <div className={s.balance}>
              <div className={s.balance_inner}>
                <div className={s.balance_title}>
                  <span>Less</span> Balance
                </div>
                <div className={s.balance_bnb}>{balanceLessToken} LESS</div>
                <div className={s.balance_usd}>0 USD</div>
                <div className={s.balance_amount}>
                  <div className={s.balance_amount__inner}>
                    <div className={s.balance_amount__money}>
                      <input
                        type="text"
                        placeholder="0.0"
                        value={stakeValue}
                        onChange={(e) => setStakeValue(e.target.value.replace(/[^\d.,]/g, ''))}
                      />
                    </div>
                    <div className={s.balance_amount__img}>
                      <img src={maxImg} alt="maxImg" />
                    </div>
                  </div>
                </div>
                <Button long onClick={stake}>Stake</Button>
              </div>
            </div>
            <div className={s.balance}>
              <div className={s.balance_inner}>
                <div className={s.balance_title}>
                  Staked <span>Less</span> Balance
                </div>
                <div className={s.balance_bnb}>{stakedBalance} LESS</div>
                <div className={s.balance_usd}>0 USD</div>
                <div className={s.balance_amount}>
                  <div className={s.balance_amount__inner}>
                    <div className={s.balance_amount__money}>
                      <input
                        type="text"
                        placeholder="0.0"
                        value={unstakeValue}
                        onChange={(e) => setUnstakeValue(e.target.value.replace(/[^\d.,]/g, ''))}
                      />
                    </div>
                    <div className={s.balance_amount__img}>
                      <img src={maxImg} alt="maxImg" />
                    </div>
                  </div>
                </div>
                <Button long onClick={unstake}>Unstake</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StakingPage;
