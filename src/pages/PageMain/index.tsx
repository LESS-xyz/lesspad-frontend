import React from 'react';

import logo1 from '../../assets/img/sections/alumni-logos/logo-1.svg';
import PoweredBy from '../About/PoweredBy/index';

import PoolsinVoting from './PoolsinVoting/index';
import FeaturedAlumni from './FeaturedAlumni';
import FeaturedProject from './FeaturedProjects';
import Features from './Features';
import Tiers from './Tiers';
import TopBlock from './TopBlock';

import s from './PageMain.module.scss';

const partnersLogos = [logo1, logo1, logo1, logo1, logo1, logo1, logo1, logo1];

const PageMain: React.FC = () => {
  return (
    <main className={s.page}>
      <TopBlock />
      <PoweredBy className={s.darkBg} />
      <FeaturedProject />
      <PoolsinVoting />
      <Features />
      <Tiers />
      <FeaturedAlumni logos={partnersLogos} title="Our Partners" />
    </main>
  );
};

export default PageMain;
