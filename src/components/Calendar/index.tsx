import React, { useState } from 'react';
import dayjs from 'dayjs';

import arrow from '../../assets/img/icons/arrow-calendar.svg';

import s from './Calendar.module.scss';

interface ICalendarProps {
  defaultTimestamp?: number;
  onChange: (date: number) => void;
  closeCalendar: () => void;
}

const Calendar: React.FC<ICalendarProps> = (props) => {
  const { defaultTimestamp, onChange, closeCalendar } = props;
  const refCalendar = React.useRef<HTMLDivElement>(null);
  const refBody = React.useRef<HTMLDivElement>(null);

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
  let defaultDay = dayjs(dayjs(currentDate).format('MM/DD/YYYY')).valueOf();
  let defaultHours = +dayjs(defaultTimestamp).format('H');
  let defaultMinutes = +dayjs(currentDate).format('m');
  if (defaultTimestamp) {
    defaultDay = dayjs(dayjs(defaultTimestamp).format('MM/DD/YYYY')).valueOf();
    defaultHours = +dayjs(defaultTimestamp).format('H');
    defaultMinutes = +dayjs(defaultTimestamp).format('m');
  }
  // defaultHours = +defaultHours * 60 * 60 * 1000;
  // defaultMinutes = +defaultMinutes * 60 * 1000;
  console.log('Calendar:', { defaultDay, defaultHours, defaultMinutes });

  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [day, setDay] = useState(defaultDay);
  const [hours, setHours] = useState(defaultHours);
  const [minutes, setMinutes] = useState(defaultMinutes);

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

  const handleDayPick = (newDay: Date) => {
    console.log('handleDayPick:', newDay.getTime(), new Date(newDay).toLocaleString());
    setDay(newDay.getTime());
  };

  const handleClose = () => {
    closeCalendar();
  };

  const handleClickOutside = (e: any) => {
    if (!refCalendar?.current?.contains(e.target) && !refBody?.current?.contains(e.target)) {
      console.log('handleClickOutside:');
      handleClose();
    }
  };

  const handleChangeHours = (e: any) => {
    setHours(e.target.value);
  };

  const handleChangeMinutes = (e: any) => {
    setMinutes(e.target.value);
  };

  React.useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    onChange(day + hours * 60 * 60 * 1000 + minutes * 60 * 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [day, hours, minutes]);

  return (
    <div className={s.calendar} ref={refCalendar}>
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
      <div className={s.calendar_body} ref={refBody}>
        {dataForCalendar.map((dayItem) => (
          <div
            key={dayItem?.toString() || Math.random()}
            role="button"
            tabIndex={0}
            onClick={() => dayItem !== null && handleDayPick(dayItem)}
            onKeyDown={() => dayItem !== null && handleDayPick(dayItem)}
            className={`${s.calendar_body__cell} ${dayItem === null ? s.nullish : ''}`}
          >
            {dayItem ? dayItem.getDate() : ''}
          </div>
        ))}
      </div>
      <div className={s.time}>
        <div className={s.hours}>
          <input
            className={s.inputHours}
            type="text"
            placeholder="24"
            value={hours}
            onChange={handleChangeHours}
          />
          <div>Hours</div>
        </div>
        <div className={s.minutes}>
          <input
            className={s.inputMinutes}
            type="text"
            placeholder="00"
            value={minutes}
            onChange={handleChangeMinutes}
          />
          <div>Minutes</div>
        </div>
      </div>
      <div>Format of time: 24H</div>
    </div>
  );
};

export default Calendar;
