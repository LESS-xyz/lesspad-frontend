import React, { useState } from 'react';
import dayjs from 'dayjs';

import calendarImg from '../../assets/img/icons/calendar.svg';
import cancelIcon from '../../assets/img/icons/cancel.svg';
import Calendar from '../Calendar';

import s from './DateInput.module.scss';

interface IDateInputProps {
  title: string;
  value: number;
  onChange: (str: number) => void;
  error?: string | null;
  required?: boolean;
  subtitle?: string;
}

const DateInput: React.FC<IDateInputProps> = (props) => {
  const { title, value, onChange, error, subtitle = 'In Your Timezone' } = props;
  const [inputVal, setInputVal] = useState<number>(value);
  const [isCalendar, setIsCalendar] = useState<boolean>(false);

  const handleChange = (str: number) => {
    setInputVal(str);
    onChange(str);
  };

  return (
    <div className={s.datePicker}>
      <div className={s.datePicker_title}>{title}</div>

      <div className={s.datePicker_inner}>
        <div className={s.datePicker_value}>{dayjs(inputVal).format('DD MMM YYYY HH:mm')}</div>
        <div
          className={s.datePicker_img}
          role="button"
          tabIndex={0}
          onClick={() => setIsCalendar(true)}
          onKeyDown={() => {}}
        >
          <img src={calendarImg} alt="calendarImg" />
        </div>
      </div>

      {subtitle && <div className={s.datePicker_subtitle}>{subtitle}</div>}
      {error && (
        <div className={s.invalid_err}>
          <div className={s.invalid_err__img}>
            <img src={cancelIcon} alt="cancelIcon" />
          </div>
          <div className={s.invalid_err__text}>{error}</div>
        </div>
      )}

      {isCalendar && (
        <div className={s.calendar}>
          <Calendar
            defaultTimestamp={inputVal}
            onChange={(date: number) => handleChange(date)}
            closeCalendar={() => setIsCalendar(false)}
          />
        </div>
      )}
    </div>
  );
};

export default DateInput;
