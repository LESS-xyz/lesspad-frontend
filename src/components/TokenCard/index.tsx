import s from './TokenCard.module.scss';
import { CardConditions } from '../../types/index';
import ProgressBar from '../ProgressBar/index';

interface ITokenCardProps {
  type: CardConditions;
  logo: string;
  name: string;
  cost: string;
  totalAmount: number;
  currentAmount: number;
  minPercent: number;
}

const TokenCard: React.FC<ITokenCardProps> = ({
  type,
  logo,
  name,
  cost,
  totalAmount,
  currentAmount,
  minPercent,
}) => {
  return (
    <div className={s.card}>
      <div className={s.wrapper}>
        <div className={s.inner}>
          <div className={`${s.header} ${s[type]}`}>opens in 2 days</div>
          <div className={s.card_container}>
            <div className={s.token_info}>
              <div className={s.token_logo}>
                <img src={logo} alt="token-logo" />
              </div>
              <div className={s.token_name}>{name}</div>
            </div>

            <div className={s.token_cost}>
              <div className={s.token_price}>{cost} BNB per Token</div>
              {type === CardConditions.closed && (
                <div className={s.token_fees}>{currentAmount} BNB</div>
              )}
            </div>

            <div className={s.body}>
              <div className={s.progress_bar}>
                <ProgressBar totalAmount={totalAmount} currentAmount={currentAmount} type={type} />
                {type === CardConditions.inVoting && (
                  <div className={s.progress_bar__extra}>
                    {Math.round((currentAmount / totalAmount) * 100)}%
                  </div>
                )}
              </div>

              {type === CardConditions.closed && (
                <>
                  <div className={s.progress_bar__info}>
                    <div className={s.progress_bar__info_left}>
                      {((currentAmount / totalAmount) * 100).toFixed(2)}%
                    </div>
                    <div className={s.progress_bar__info_right}>
                      {currentAmount.toFixed(2)} / {totalAmount.toFixed(2)}
                    </div>
                  </div>
                  <div className={s.progress_bar__subinfo}>
                    <div className={s.progress_bar__subinfo_left}>Min {minPercent.toFixed(2)}%</div>
                    <div className={s.progress_bar__subinfo_right}>BNB</div>
                  </div>
                </>
              )}

              {type === CardConditions.notOpened && (
                <>
                  <div className={s.progress_bar__info}>
                    <div className={s.progress_bar__info_left}>Min {minPercent}%</div>
                    <div className={s.progress_bar__info_right}>
                      {currentAmount.toFixed(2)} / {totalAmount.toFixed(2)}
                    </div>
                  </div>
                  <div className={s.progress_bar__subinfo}>
                    Yes - No Votes {'>'} 15% of max supply
                  </div>
                </>
              )}

              {type === CardConditions.inVoting && (
                <>
                  <div className={s.progress_bar__info}>
                    <div className={s.progress_bar__info_left}>Yes counter</div>
                    <div className={s.progress_bar__info_right}>No counter</div>
                  </div>
                  <div className={s.progress_bar__subinfo}>
                    Yes - No Votes {'>'} 15% of max supply
                  </div>
                </>
              )}
            </div>

            <div className={s.footer}>
              <div className={s.first_line}>
                <div className={s.footer_title}>Liquidity Allocation</div>
                <div className={s.footer_title}>Connect</div>
              </div>
              <div className={s.second_line}>
                <div className={s.liquidity_percent}>60%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenCard;
