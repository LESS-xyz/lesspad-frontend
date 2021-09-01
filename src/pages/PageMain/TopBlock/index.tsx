import React from 'react';
import useMedia from 'use-media';

import Button from '../../../components/Button/index';

import s from './TopBlock.module.scss';

const TopBlock: React.FC = () => {
  const isMobile = useMedia({ maxWidth: 768 });

  return (
    <section className={s.top}>
      <div className={s.bg_img}>
        <div className={s.container}>
          <div className={s.inner}>
            <div className={s.block}>
              <div className={s.title}>Lesspad</div>
              <div className={s.subtitle}>
                A decentralized, community owned IDO launchpad bringing opportunity to early stage,
                innovative projects across all major protocols
              </div>
              <div className={s.buttons}>
                <Button big fullWidth={isMobile} to="/pools">
                  View All Pools
                </Button>
                <Button
                  href="https://app.uniswap.org/#/swap?outputCurrency=0x62786eeacc9246b4018e0146cb7a3efeacd9459d&use=V2"
                  big
                  fullWidth={isMobile}
                >
                  Buy Less
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopBlock;
