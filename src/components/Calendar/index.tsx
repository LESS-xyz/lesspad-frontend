import React, { useState } from 'react';

import arrow from '../../assets/img/icons/arrow-calendar.svg';

import s from './Calendar.module.scss';

interface ICalendarProps {
  onChange: (date: number) => void;
  closeCalendar: () => void;
}

const Calendar: React.FC<ICalendarProps> = ({ onChange, closeCalendar }) => {
  const monthes = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  // сегодняшняя дата
  const currentDate = new Date();

  // текущий месяц
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());

  // текущий год
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());

  // кол-во дней в месяце
  const daysInMonth = 33 - new Date(currentYear, currentMonth, 33).getDate();

  // первый день в месяце: Понедельник, вторник, ...?
  let firstDayInMonth = new Date(currentYear, currentMonth, 1).getDay();
  if (firstDayInMonth === 0) {
    firstDayInMonth = 6;
  } else firstDayInMonth -= 1;
  // понед = 0; воск = 6 ☝🏽

  // массив с объектами дат для каждого дня в месяце
  const dataForCalendar = [];

  // заполняем массив null до первого дня в месяце
  for (let i = 0; i < firstDayInMonth; i += 1) {
    dataForCalendar.push(null);
  }
  // заполняем месяц
  for (let i = 0; i < daysInMonth; i += 1) {
    dataForCalendar.push(new Date(currentYear, currentMonth, i + 1));
  }

  const handleNextMonthChange = () => {
    if (currentMonth + 1 > 11) {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handlePrevMonthChange = () => {
    if (currentMonth < 1) {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleDayPick = (day: Date) => {
    onChange(day.getTime());
    closeCalendar();
  };

  return (
    <div className={s.calendar}>
      <div className={s.calendar_header}>
        <div className={s.calendar_header__currentDate}>
          {monthes[currentMonth]} {currentYear}
        </div>
        <div className={s.calendar_header__arrows}>
          <div
            role="button"
            tabIndex={0}
            className={s.calendar_header__arrow}
            onClick={handlePrevMonthChange}
            onKeyDown={handlePrevMonthChange}
          >
            <img src={arrow} alt="arrow" />
          </div>
          <div
            role="button"
            tabIndex={0}
            className={s.calendar_header__arrow}
            onClick={handleNextMonthChange}
            onKeyDown={handleNextMonthChange}
          >
            <img src={arrow} alt="arrow" />
          </div>
        </div>
      </div>
      <div className={s.calendar_weekDays}>
        <div className={s.calendar_weekDays__day}>Mo</div>
        <div className={s.calendar_weekDays__day}>Tu</div>
        <div className={s.calendar_weekDays__day}>We</div>
        <div className={s.calendar_weekDays__day}>Th</div>
        <div className={s.calendar_weekDays__day}>Fr</div>
        <div className={s.calendar_weekDays__day}>Sa</div>
        <div className={s.calendar_weekDays__day}>Su</div>
      </div>
      <div className={s.calendar_body}>
        {dataForCalendar.map((day) => (
          <div
            role="button"
            tabIndex={0}
            onClick={() => day !== null && handleDayPick(day)}
            onKeyDown={() => day !== null && handleDayPick(day)}
            className={`${s.calendar_body__cell} ${day === null ? s.nullish : ''}`}
          >
            {day ? day.getDate() : ''}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
