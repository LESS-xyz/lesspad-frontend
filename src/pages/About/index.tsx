import s from './About.module.scss';
import TopBlock from './TopBlock/index';
import PoweredBy from './PoweredBy/index';
import Features from './Features/index';
import FiveTiers from './FiveTiers/index';
import logo1 from '../../assets/img/sections/alumni-logos/logo-1.svg';
import Partners from '../PageMain/FeaturedAlumni';

const partnersLogos = [logo1, logo1, logo1, logo1, logo1, logo1, logo1, logo1];

const AboutPage: React.FC = () => {
  return (
    <div className={s.page}>
      <TopBlock />
      <PoweredBy />
      <Features />
      <FiveTiers />
      <Partners logos={partnersLogos} title="Our partners" />
    </div>
  );
};

export default AboutPage;
