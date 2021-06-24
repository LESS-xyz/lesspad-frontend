import React, { useState } from 'react';
import s from './Staking.module.scss';
import Button from '../../components/Button/index';
import maxImg from '../../assets/img/icons/max.svg';

const StakingPage: React.FC = () => {
  const [stakeValue, setStakeValue] = useState('');
  const [unstakeValue, setUnstakeValue] = useState('');

  return (
    <div className={s.page}>
      <div className={s.container}>
        <div className={s.inner}>
          <div className={s.title}>Your Wallet</div>
          <div className={s.balance}>
            <div className={s.balance_inner}>
              <div className={s.balance_title}>
                <span>BNB</span> Balance
              </div>
              <div className={s.balance_bnb}>0.000 BNB</div>
              <div className={s.balance_usd}>$0.0 USD</div>
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
                <div className={s.balance_bnb}>0.000 LESS</div>
                <div className={s.balance_usd}>$0.0 USD</div>
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
                <Button long>Stake</Button>
              </div>
            </div>
            <div className={s.balance}>
              <div className={s.balance_inner}>
                <div className={s.balance_title}>
                  Stacked <span>Less</span> Balance
                </div>
                <div className={s.balance_bnb}>0.000 LESS</div>
                <div className={s.balance_usd}>$0.0 USD</div>
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
                <Button long>Unstake</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StakingPage;
