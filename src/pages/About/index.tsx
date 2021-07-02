import React from 'react';
import { Helmet } from 'react-helmet';

import logo1 from '../../assets/img/sections/alumni-logos/logo-1.svg';
import Partners from '../PageMain/FeaturedAlumni';

import Features from './Features/index';
import FiveTiers from './FiveTiers/index';
import PoweredBy from './PoweredBy/index';
import TopBlock from './TopBlock/index';

import s from './About.module.scss';

const partnersLogos = [logo1, logo1, logo1, logo1, logo1, logo1, logo1, logo1];

const AboutPage: React.FC = () => {
  return (
    <div className={s.page}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>About | Lesspad</title>
        <meta
          name="description"
          content="Multi-Chain Decentralized
Fundraising Capital"
        />
      </Helmet>

      <TopBlock />
      <PoweredBy />
      <Features />
      <FiveTiers />
      <Partners logos={partnersLogos} title="Our partners" />
    </div>
  );
};

export default AboutPage;
