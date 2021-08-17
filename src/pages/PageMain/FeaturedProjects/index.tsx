import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { v4 as uuid } from 'uuid';

import TokenCard, { ITokenCardProps } from '../../../components/TokenCard';
import config from '../../../config';

import s from './FeaturedProjects.module.scss';

const { NOW } = config;

const FeaturedProject: React.FC = () => {
  const { pools } = useSelector(({ pool }: any) => pool);

  const [presalesFiltered, setPresalesFiltered] = useState<any[]>([]);

  const filterProjects = useCallback(async () => {
    if (pools && pools.length !== 0) {
      try {
        const presalesInfoNew = pools.filter((item: any) => {
          const { openVotingTime = 0 } = item;
          const isFeatured = NOW < openVotingTime;
          if (!isFeatured) return false;
          return true;
        });
        // const presalesAddressesFilteredNew = presalesInfoNew.map((item: any) => item.address);
        setPresalesFiltered(presalesInfoNew);
      } catch (e) {
        console.error(e);
      }
    }
  }, [pools]);

  useEffect(() => {
    if (!pools || !pools.length) return;
    filterProjects();
  }, [filterProjects, pools, pools.length]);

  return (
    <section className={s.page}>
      <div className={s.container}>
        <div className={s.inner}>
          <div className={s.title}>Upcoming Projects</div>
          <div className={s.cards}>
            {presalesFiltered
              .map((item: any) => {
                const { address = '', isCertified } = item;
                const props: ITokenCardProps = {
                  address,
                  isCertified,
                };
                return <TokenCard key={uuid()} {...props} />;
              })
              .slice(0, 5)}
            <Link to="/create-pool" className={s.emptyCard} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProject;
