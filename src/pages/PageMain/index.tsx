import s from './PageMain.module.scss';
import TopBlock from './TopBlock';
import FeaturedProject from './FeaturedProjects';
import PoolsinVoting from './PoolsinVoting/index';
import FeaturedAlumni from './FeaturedAlumni';
import logo1 from '../../assets/img/sections/alumni-logos/logo-1.svg';

const alumniLogos = [logo1, logo1, logo1, logo1, logo1, logo1, logo1, logo1];

const PageMain: React.FC = () => {
  return (
    <main className={s.page}>
      <TopBlock />
      <FeaturedProject />
      <PoolsinVoting />
      <FeaturedAlumni logos={alumniLogos} title="Featured Alumni" />
    </main>
  );
};

export default PageMain;
