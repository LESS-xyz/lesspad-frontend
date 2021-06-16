import s from './PoolsInVoting.module.scss';
import TokenCard from '../../../components/TokenCard/index';
import { CardConditions } from '../../../types/index';
import logo1 from '../../../assets/img/sections/token-card/logo-1.png';

const PoolsiInVoting: React.FC = () => {
  return (
    <section className={s.block}>
      <div className={s.container}>
        <div className={s.inner}>
          <div className={s.title}>Pools in Voting</div>
          <div className={s.cards}>
            <TokenCard
              type={CardConditions.inVoting}
              name="Tease Fans"
              logo={logo1}
              cost="0.00067"
              totalAmount={800}
              currentAmount={400}
              minPercent={25}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PoolsiInVoting;
