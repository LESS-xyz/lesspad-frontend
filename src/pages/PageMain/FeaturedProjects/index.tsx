import s from './FeaturedProjects.module.scss';
import TokenCard from '../../../components/TokenCard/index';
import { CardConditions } from '../../../types/index';

import logo1 from '../../../assets/img/sections/token-card/logo-1.png';
import logo2 from '../../../assets/img/sections/token-card/logo-2.png';

const FeaturedProject: React.FC = () => {
  return (
    <section className={s.page}>
      <div className={s.container}>
        <div className={s.inner}>
          <div className={s.title}>Featured Projects</div>
          <div className={s.cards}>
            <TokenCard
              type={CardConditions.closed}
              logo={logo2}
              name="XOLO Finance"
              cost="0.002"
              totalAmount={800}
              currentAmount={800.20}
              minPercent={25}
            />
            <TokenCard
              type={CardConditions.notOpened}
              logo={logo2}
              name="XOLO Finance"
              cost="0.002"
              totalAmount={2000}
              currentAmount={0}
              minPercent={28.57}
            />
            <TokenCard
              type={CardConditions.inVoting}
              logo={logo1}
              name="XOLO Finance"
              cost="0.006"
              totalAmount={4555}
              currentAmount={234}
              minPercent={0}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProject;
