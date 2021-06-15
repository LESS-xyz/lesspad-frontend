import s from './TopBlock.module.scss';
import Button from '../../../components/Button/index';

const TopBlock: React.FC = () => {
  return (
    <section className={s.top}>
      <div className={s.container}>
        <div className={s.inner}>
          <div className={s.block}>
            <div className={s.title}>
              Multi-Chain Decenetralized <br /> Fundraising Capital
            </div>
            <div className={s.subtitle}>
              Filter through the messy landscape where rugs overshadow the great potential of a
              growing ecosystem. Join the first community-oriented network for raising capital on
              BSC
            </div>
            <div className={s.buttons}>
              <Button big>View All Pools</Button>
              <Button big>Buy Less</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopBlock;
