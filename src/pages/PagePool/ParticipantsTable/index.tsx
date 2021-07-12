import React, { useState } from 'react';

import Pagination from '../../../components/Pagination/index';

import s from './ParticipantTable.module.scss';

type Tiers = 'pawns' | 'bishops' | 'rooks' | 'queens' | 'kings';

// пример даты для отрисовки
const participationDataExample = {
  pawns: [
    'x788787987879879879879798',
    'x788787987879879879879798',
    'x788787987879879879879798',
    'x788787987879879879879798',
    'x788787987879879879879798',
  ],
  bishops: [
    'xdfsd4f5sdfdfds',
    'xdfsd4f5sdfdfds',
    'xdfsd4f5sdfdfds',
    'xdfsd4f5sdfdfds',
    'xdfsd4f5sdfdfds',
  ],
  rooks: [
    'xdsssssssssdffsdfds',
    'xdsssssssssdffsdfds',
    'xdsssssssssdffsdfds',
    'xdsssssssssdffsdfds',
    'xdsssssssssdffsdfds',
  ],
  queens: [
    'x54fsdfdsdsf312dsf',
    'x54fsdfdsdsf312dsf',
    'x54fsdfdsdsf312dsf',
    'x54fsdfdsdsf312dsf',
    'x54fsdfdsdsf312dsf',
  ],
  kings: [
    'xfdsfdsfdsfdsfdssfd',
    'xfdsfdsfdsfdsfdssfd',
    'xfdsfdsfdsfdsfdssfd',
    'xfdsfdsfdsfdsfdssfd',
    'xfdsfdsfdsfdsfdssfd',
  ],
};

// пример даты для отрисовки
const winnersExample = ['x445466646446545', 'x445466646446545', 'x445466646446545'];

const ParticipantsTable: React.FC = () => {
  const [activeTier, setActiveTier] = useState<Tiers>('pawns');

  const handleChangeTier = (tier: Tiers) => {
    setActiveTier(tier);
  };

  return (
    <section className={s.block}>
      <div className={s.title}>Participants</div>
      <div className={s.table}>
        <div className={s.table_header}>
          <div className={s.table_header__button}>
            <div
              onKeyDown={() => {}}
              role="button"
              tabIndex={0}
              className={`${s.table_header__button_inner} ${activeTier === 'pawns' && s.active}`}
              onClick={() => handleChangeTier('pawns')}
            >
              Pawns
            </div>
          </div>
          <div className={s.table_header__button}>
            <div
              onKeyDown={() => {}}
              role="button"
              tabIndex={0}
              className={`${s.table_header__button_inner} ${activeTier === 'bishops' && s.active}`}
              onClick={() => handleChangeTier('bishops')}
            >
              Bishops
            </div>
          </div>
          <div className={s.table_header__button}>
            <div
              onKeyDown={() => {}}
              role="button"
              tabIndex={0}
              className={`${s.table_header__button_inner} ${activeTier === 'rooks' && s.active}`}
              onClick={() => handleChangeTier('rooks')}
            >
              Rooks
            </div>
          </div>
          <div className={s.table_header__button}>
            <div
              onKeyDown={() => {}}
              role="button"
              tabIndex={0}
              className={`${s.table_header__button_inner} ${activeTier === 'queens' && s.active}`}
              onClick={() => handleChangeTier('queens')}
            >
              Queens
            </div>
          </div>
          <div className={s.table_header__button}>
            <div
              onKeyDown={() => {}}
              role="button"
              tabIndex={0}
              className={`${s.table_header__button_inner} ${activeTier === 'kings' && s.active}`}
              onClick={() => handleChangeTier('kings')}
            >
              Kings
            </div>
          </div>
        </div>
        <div className={s.table_body}>
          <div className={s.table_body_adresses}>
            <div className={s.table_body_adresses__left}>
              <div className={s.table_body_adresses__title}>Participants</div>
              {participationDataExample[activeTier].map((data) => (
                <div className={s.participant}>{data}</div>
              ))}
            </div>
            {/* для первых двух тиров показываем список победителей */}
            <div className={s.table_body_adresses__right}>
              {(activeTier === 'pawns' || activeTier === 'bishops') && (
                <div className={`${s.table_body_adresses__title} ${s.winner}`}>
                  <span>Lottery winners</span>
                </div>
              )}
              {(activeTier === 'pawns' || activeTier === 'bishops') &&
                winnersExample.map((winner) => (
                  <div className={`${s.participant} ${s.winner}`}>
                    <span>{winner}</span>
                  </div>
                ))}
            </div>
          </div>
          <div className={s.table_body_pagination}>
            <Pagination countOfPages={4} onChange={() => {}} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ParticipantsTable;
