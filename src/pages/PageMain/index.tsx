import React from 'react';

import Button from '../../components/Button';
// import logo1 from '../../assets/img/sections/alumni-logos/logo-1.svg';
import PoweredBy from '../About/PoweredBy/index';

import PoolsinVoting from './PoolsinVoting/index';
// import FeaturedAlumni from './FeaturedAlumni';
import FeaturedProject from './FeaturedProjects';
import Features from './Features';
import Tiers from './Tiers';
import TopBlock from './TopBlock';

import s from './PageMain.module.scss';

// const partnersLogos = [logo1, logo1, logo1, logo1, logo1, logo1, logo1, logo1];

const PageMain: React.FC = () => {
  return (
    <main className={s.page}>
      <TopBlock />
      <PoweredBy className={s.darkBg} />
      <FeaturedProject />
      <PoolsinVoting />
      <Features />
      <Tiers />
      {/*<FeaturedAlumni logos={partnersLogos} title="Our Partners" />*/}

      <div className={s.container}>
        <div className={s.info}>
          <div className={s.info_inner}>
            <div className={s.info_left}>
              We aim to provide a seamless experience for fund raising and exposure on any major
              protocol
            </div>
            <div className={s.info_right}>
              <div className={s.info_right__text}>
                Funding? Exposure? <br /> LessPad has it all, click below!
              </div>
              <Button>Start application</Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PageMain;
