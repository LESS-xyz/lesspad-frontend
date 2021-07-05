import React from 'react';

import s from './style.module.scss';

const Page404: React.FC = () => {
  return (
    <section className={s.page}>
      <div className={s.container}>
        <div className={s.inner}>
          <div className={s.title}>Page does not exist</div>
        </div>
      </div>
    </section>
  );
};

export default Page404;
