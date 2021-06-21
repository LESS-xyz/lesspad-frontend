import s from './TopBlock.module.scss';
import Button from '../../../components/Button/index';

const TopBlock: React.FC = () => {
  return (
    <section className={s.block}>
      <div className={s.block_bg}>
        <div className={s.container}>
          <div className={s.inner}>
            <div className={s.block_body}>
              <div className={s.title}>lesspad</div>
              <div className={s.subtitle}>
                A decentralized, community owned IDO launchpad bringing opportunity to early stage,
                innovative projects across all major protocols
              </div>
              <div className={s.buttons}>
                <Button long>Bridge</Button>
                <Button long>Launch App</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopBlock;
