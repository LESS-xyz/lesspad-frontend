import s from './PageMain.module.scss';

import TopBlock from './TopBlock';
import FeaturedProject from './FeaturedProjects';
import PoolsinVoting from './PoolsinVoting/index';
import FeaturedAlumni from './FeaturedAlumni';

const PageMain: React.FC = () => {
  return (
    <main className={s.page}>
      <TopBlock />
      <FeaturedProject />
      <PoolsinVoting />
      <FeaturedAlumni />
    </main>
  );
};

export default PageMain;
