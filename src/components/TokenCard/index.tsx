import s from './TokenCard.module.scss';
import { CardConditions, cryptos } from '../../types/index';
import ProgressBar from '../ProgressBar/index';
import Icon from '../Icon/index';
import { Link } from 'react-router-dom';

import thumbup from '../../assets/img/sections/token-card/thumb-up.svg';
import telegramActive from '../../assets/img/icons/telegram-active.svg';
import telegramDisabled from '../../assets/img/icons/telegram-disabled.svg';
import chainActive from '../../assets/img/icons/chain-active.svg';
import chainDisabled from '../../assets/img/icons/chain-disabled.svg';
import shareGradient from '../../assets/img/icons/share-gradient.svg';
import shareWhite from '../../assets/img/icons/share-white.svg';
import shareGrey from '../../assets/img/icons/share-grey.svg';
import BNBwhite from '../../assets/img/icons/BNB-white.svg';
import BNBgradient from '../../assets/img/icons/BNB-gradient.svg';
import ETHwhite from '../../assets/img/icons/ETH-white.svg';
import ETHgradient from '../../assets/img/icons/ETH-gradient.svg';
import POLKADOTwhite from '../../assets/img/icons/polkadot-white.svg';
import POLKADOTgradient from '../../assets/img/icons/polkadot-gradient.svg';

interface ITokenCardProps {
  type: CardConditions;
  cryptoType: cryptos;
  logo: string;
  name: string;
  cost: string;
  totalAmount: number;
  currentAmount: number;
  minPercent: number;
  liquidityPercent: number;
  daysBeforeOpening: number;
  telegramLink?: string;
  chainLink?: string;
  yesCounter?: number;
  noCounter?: number;
}

const iconsHeader = {
  BNB: BNBgradient,
  ETH: ETHgradient,
  POLKADOT: POLKADOTgradient,
};
const iconsHeaderWhite = {
  BNB: BNBwhite,
  ETH: ETHwhite,
  POLKADOT: POLKADOTwhite,
};

const iconsHeader2 = {
  notOpened: shareGrey,
  closed: shareWhite,
  inVoting: shareGradient,
};

const TokenCard: React.FC<ITokenCardProps> = ({
  type,
  logo,
  name,
  cost,
  totalAmount,
  currentAmount,
  minPercent,
  yesCounter,
  noCounter,
  liquidityPercent,
  telegramLink,
  chainLink,
  daysBeforeOpening,
  cryptoType,
}) => {
  return (
    <Link to="/pool" className={s.card}>
      <div className={s.inner}>
        <div className={`${s.header} ${s[type]}`}>
          <div className={s.header_icon}>
            {type === CardConditions.closed ? (
              <img src={iconsHeaderWhite[cryptoType]} alt="crypto-icon" />
            ) : (
              <img src={iconsHeader[cryptoType]} alt="crypto-icon" />
            )}
          </div>
          <div className={s.header_title}>
            opens in {daysBeforeOpening} {daysBeforeOpening > 1 ? 'days' : 'day'}
          </div>
          <div className={s.header_icon}>
            <img src={iconsHeader2[type]} alt="" />
          </div>
        </div>
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
                  <div className={s.thumbup_img}>
                    <img src={thumbup} alt="thumbup" />
                  </div>
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
                <div className={s.progress_bar__info} style={{ width: '70%' }}>
                  <div className={s.progress_bar__info_left}>Yes: {yesCounter}</div>
                  <div className={s.progress_bar__info_right}>No: {noCounter}</div>
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
              <div className={s.liquidity_percent}>{liquidityPercent}%</div>
              <div className={s.footer_links}>
                <div className={s.footer_link}>
                  <a href={telegramLink}>
                    <Icon onHover={telegramActive} defaultIcon={telegramDisabled} />
                  </a>
                </div>
                <div className={s.footer_link}>
                  <a href={chainLink}>
                    <Icon onHover={chainActive} defaultIcon={chainDisabled} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TokenCard;
