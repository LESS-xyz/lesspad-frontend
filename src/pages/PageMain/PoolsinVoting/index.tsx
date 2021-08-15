import React from 'react';
import { useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';

import bnbLogo from '../../../assets/img/icons/bnb-logo.svg';
import logo1 from '../../../assets/img/sections/token-card/logo-1.png';
import TokenCard, { ITokenCardProps } from '../../../components/TokenCard';

import s from './PoolsInVoting.module.scss';

const PoolsiInVoting: React.FC = () => {
  const { pools } = useSelector(({ pool }: any) => pool);

  return (
    <section className={s.block}>
      <div className={s.container}>
        <div className={s.inner}>
          <div className={s.title}>Pools in Voting</div>
          <div className={s.cards}>
            {pools
              .map((item: any) => {
                const { address = '', title = '', isCertified } = item;
                const props: ITokenCardProps = {
                  address,
                  logo: logo1,
                  daysTillOpen: 3,
                  name: title,
                  subtitle: 'Participant',
                  website: 'https://github.com/',
                  telegram: 'https://t.me/durov',
                  whitePaper: 'https://bitcoin.org/ru/bitcoin-paper',
                  blockchainLogo: bnbLogo,
                  chain: 'BNB',
                  type: 'public',
                  fundingToken: 'BNB',
                  status: 'in voting',
                  isCertified,
                };
                return <TokenCard key={uuid()} {...props} />;
              })
              .slice(0, 3)}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PoolsiInVoting;
