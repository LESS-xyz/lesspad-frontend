import s from './PageMain.module.scss';
import TopBlock from './TopBlock';

const PageMain: React.FC = () => {
  return (
    <section className={s.page}>
      <TopBlock />
    </section>
  );
};

export default PageMain;
