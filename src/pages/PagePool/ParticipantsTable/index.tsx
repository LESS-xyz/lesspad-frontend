import React, { memo, useCallback, useEffect, useState } from 'react';

import Pagination from '../../../components/Pagination/index';
import { BackendService } from '../../../services/Backend';

import s from './ParticipantTable.module.scss';

const Backend = new BackendService();

type Tiers = 'pawns' | 'bishops' | 'rooks' | 'queens' | 'kings';

// пример даты для отрисовки
// const participationDataExample = {
//   pawns: [
//     'x788787987879879879879798',
//     'x788787987879879879879798',
//     'x788787987879879879879798',
//     'x788787987879879879879798',
//     'x788787987879879879879798',
//   ],
//   bishops: [
//     'xdfsd4f5sdfdfds',
//     'xdfsd4f5sdfdfds',
//     'xdfsd4f5sdfdfds',
//     'xdfsd4f5sdfdfds',
//     'xdfsd4f5sdfdfds',
//   ],
//   rooks: [
//     'xdsssssssssdffsdfds',
//     'xdsssssssssdffsdfds',
//     'xdsssssssssdffsdfds',
//     'xdsssssssssdffsdfds',
//     'xdsssssssssdffsdfds',
//   ],
//   queens: [
//     'x54fsdfdsdsf312dsf',
//     'x54fsdfdsdsf312dsf',
//     'x54fsdfdsdsf312dsf',
//     'x54fsdfdsdsf312dsf',
//     'x54fsdfdsdsf312dsf',
//   ],
//   kings: [
//     'xfdsfdsfdsfdsfdssfd',
//     'xfdsfdsfdsfdsfdssfd',
//     'xfdsfdsfdsfdsfdssfd',
//     'xfdsfdsfdsfdsfdssfd',
//     'xfdsfdsfdsfdsfdssfd',
//   ],
// };

// пример даты для отрисовки
// const winnersExample = ['x445466646446545', 'x445466646446545', 'x445466646446545'];

interface IParticipantsTable {
  poolAddress: string;
}

const ParticipantsTable: React.FC<IParticipantsTable> = (props) => {
  const { poolAddress } = props;
  const [activeTier, setActiveTier] = useState<Tiers>('pawns');

  const [page, setPage] = useState<number>(0);

  const [participants, setParticipants] = useState<any>({
    pawns: [],
    bishops: [],
    rooks: [],
    queens: [],
    kings: [],
  });
  const [winners, setWinners] = useState<any>({
    pawns: [],
    bishops: [],
    rooks: [],
    queens: [],
    kings: [],
  });

  const [participantsFiltered, setParticipantsFiltered] = useState<any>([]);
  const [winnersFiltered, setWinnersFiltered] = useState<any>([]);

  const data = participants[activeTier];
  const itemsOnPage = 12;
  let countOfPages = +(data.length / itemsOnPage).toFixed();
  const moduloOfPages = data.length % itemsOnPage;
  if (moduloOfPages > 0) countOfPages += 1;

  const isPawns = activeTier === 'pawns';
  const isBishops = activeTier === 'bishops';

  const getTiersAndWinners = useCallback(async () => {
    try {
      const resultGetTiersAndWinners = await Backend.getTiersAndWinners({
        pool: poolAddress,
      });
      console.log('PagePool getTiersAndWinners:', resultGetTiersAndWinners);
      if (!resultGetTiersAndWinners.data) throw new Error('Participants and winners error');
      const { participants: newParticipants, winners: newWinners } = resultGetTiersAndWinners.data;
      const {
        tier_1: pawns,
        tier_2: bishops,
        tier_3: rooks,
        tier_4: queens,
        tier_5: kings,
      } = newParticipants;
      const { winners_1, winners_2 } = newWinners;
      const newParticipantsFormatted = {
        pawns,
        bishops,
        rooks,
        queens,
        kings,
      };
      const newWinnersFormatted = {
        pawns: winners_1,
        bishops: winners_2,
        rooks: [],
        queens: [],
        kings: [],
      };
      setParticipants(newParticipantsFormatted);
      setWinners(newWinnersFormatted);
    } catch (e) {
      console.error(e);
    }
  }, [poolAddress]);

  const filterData = useCallback(() => {
    try {
      const newParticipants = participants[activeTier];
      const newWinners = winners[activeTier];
      const newParticipantsFiltered = newParticipants.filter((item: any, index: number) => {
        if (index < page * itemsOnPage || index >= (page + 1) * itemsOnPage) return false;
        return true;
      });
      const newWinnersFiltered = newWinners.filter((item: any, index: number) => {
        if (index < page * itemsOnPage || index >= (page + 1) * itemsOnPage) return false;
        return true;
      });
      setWinnersFiltered(newParticipantsFiltered);
      setParticipantsFiltered(newWinnersFiltered);
    } catch (e) {
      console.error(e);
    }
  }, [activeTier, page, participants, winners]);

  const handleChangePage = (p: number) => {
    setPage(p);
  };

  const handleChangeTier = (tier: Tiers) => {
    setActiveTier(tier);
  };

  useEffect(() => {
    if (!Backend) return;
    getTiersAndWinners();
  }, [getTiersAndWinners]);

  useEffect(() => {
    filterData();
  }, [page, filterData]);

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
            {/*Participants*/}
            <div className={s.table_body_adresses__left}>
              <div className={s.table_body_adresses__title}>Participants</div>
              {participantsFiltered.length ? (
                participantsFiltered.map((participant) => (
                  <div className={s.participant}>{participant}</div>
                ))
              ) : (
                <div>No data</div>
              )}
            </div>

            {/*Winners*/}
            {(isPawns || isBishops) && (
              <div className={s.table_body_adresses__right}>
                <div className={`${s.table_body_adresses__title} ${s.winner}`}>
                  <span>Lottery winners</span>
                </div>
                {winnersFiltered.length ? (
                  winnersFiltered.map((winner) => (
                    <div className={`${s.participant} ${s.winner}`}>
                      <span>{winner}</span>
                    </div>
                  ))
                ) : (
                  <div>No data</div>
                )}
              </div>
            )}
          </div>
          <div className={s.table_body_pagination}>
            <Pagination countOfPages={countOfPages} onChange={handleChangePage} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(ParticipantsTable);
