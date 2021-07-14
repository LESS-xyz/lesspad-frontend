import React from 'react';

import s from './TokenCard.module.scss';

export interface ITokenCardProps {
  logo: string;
  daysTillOpen: number;
  name: string;
  subtitle: string;
  website: string;
  telegram: string;
  whitePaper: string;
  blockchainLogo: string;
  chain: string;
  type: 'public' | 'certified';
  fundingToken: string;
  status: 'ended' | 'in voting' | 'not opened';
}

const TokenCard: React.FC<ITokenCardProps> = ({
  logo,
  daysTillOpen,
  name,
  subtitle,
  website,
  telegram,
  whitePaper,
  blockchainLogo,
  chain,
  type,
  fundingToken,
  status,
}) => {
  return (
    <div className={s.card}>
      <div className={s.card_header}>
        <div className={s.card_header__logo}>
          <img src={logo} alt="token-logo" />
        </div>
        <div className={s.card_header__info}>
          <div className={s.card_header__info_days}>
            opens in {daysTillOpen} {daysTillOpen > 1 ? 'days' : 'day'}
          </div>
          <div className={s.card_header__info_name}>{name}</div>
          <div className={s.card_header__info_subtitle}>{subtitle}</div>
        </div>
      </div>
      <div className={s.card_links}>
        <a href={website} target="_blank" rel="noreferrer" className={s.card_links__link}>
          <span>Website</span>
        </a>
        <a href={telegram} target="_blank" rel="noreferrer" className={s.card_links__link}>
          <span>Telegram</span>
        </a>
        <a href={whitePaper} target="_blank" rel="noreferrer" className={s.card_links__link}>
          <span>White Paper</span>
        </a>
      </div>
      <div className={s.card_body}>
        <div className={s.card_body__logo}>
          <img src={blockchainLogo} alt="blockchainLogo" />
        </div>
        <div className={s.card_body__info}>
          <div className={s.card_body__info_item}>
            <div className={s.card_body__info_item__title}>Chain</div>
            <div className={s.card_body__info_item__value}>{chain} Network</div>
          </div>
          <div className={s.card_body__info_item}>
            <div className={s.card_body__info_item__title}>Type</div>
            <div className={s.card_body__info_item__value}>{type}</div>
          </div>
          <div className={s.card_body__info_item}>
            <div className={s.card_body__info_item__title}>Funding token</div>
            <div className={s.card_body__info_item__value}>{fundingToken}</div>
          </div>
          <div className={s.card_body__info_item}>
            <div className={s.card_body__info_item__title}>Status</div>
            <div className={s.card_body__info_item__value}>{status}</div>
          </div>
        </div>
      </div>
      <div className={s.card_footer__wrap}>
        <div className={s.card_footer}>
          <div className={s.card_footer__top}>
            <div className={s.card_footer__top_liquidity}>Liquidity Allocation</div>
            <div className={s.card_footer_gradient}>
              <span>60 %</span>
            </div>
          </div>
          <div className={s.card_footer_gradient}>
            <span>1 BNB = 0,00001 XCO</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenCard;
