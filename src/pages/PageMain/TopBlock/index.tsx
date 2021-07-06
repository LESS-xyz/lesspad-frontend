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
              <div className={s.title}>
                Multi-Chain Decentralized <br /> Fundraising Capital
              </div>
              <div className={s.subtitle}>
                Filter through the messy landscape where rugs overshadow the great potential of a
                growing ecosystem. Join the first community-oriented network for raising capital on
                BSC
              </div>
              <div className={s.buttons}>
                <Button big fullWidth={isMobile} to="/pools">
                  View All Pools
                </Button>
                <Button
                  href="https://exchange.pancakeswap.finance/#/swap?outputCurrency=0xb698ac9bc82c718d8eba9590564b9a5aa53d58e6"
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
