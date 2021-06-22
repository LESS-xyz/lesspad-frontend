import { useState } from 'react';
import s from './CreatePool.module.scss';
import cancelIcon from '../../assets/img/icons/cancel.svg';
import Calendar from '../../components/Calendar/index';
import calendarImg from '../../assets/img/icons/calendar.svg';

interface IInputProps {
  title: string;
  value: string;
  onChange: (str: string) => void;
  invalid?: boolean;
  subtitle?: string;
}

const Input: React.FC<IInputProps> = ({ title, value, onChange, invalid, subtitle }) => {
  const [inputVal, setInputVal] = useState(value);
  const handleChange = (str: string) => {
    setInputVal(str);
    onChange(str);
  };
  return (
    <div className={`${s.input} ${invalid ? s.invalid : ''}`}>
      <div className={s.input_title}>{title}</div>
      <input required value={inputVal} onChange={(e) => handleChange(e.target.value)} type="text" />
      {subtitle && <div className={s.input_subtitle}>{subtitle}</div>}
      {invalid && (
        <div className={s.invalid_err}>
          <div className={s.invalid_err__img}>
            <img src={cancelIcon} alt="cancelIcon" />
          </div>
          <div className={s.invalid_err__text}>Invalid address</div>
        </div>
      )}
    </div>
  );
};

const CreatePoolPage: React.FC = () => {
  const [presaleType, setPresaleType] = useState('Public');

  const [tokenContractValue, setTokenContractValue] = useState('');
  const [tokenPriceValue, setTokenPriceValue] = useState('');
  // на макете одинаковые названия инпутов, поэтому такие именования стейта
  const [tokenContractValue2, setTokenContractValue2] = useState('');
  const [tokenContractValue3, setTokenContractValue3] = useState('');
  const [tokenContractValue4, setTokenContractValue4] = useState('');
  const [tokenContractValue5, setTokenContractValue5] = useState('');
  const [tokenContractValue6, setTokenContractValue6] = useState('');
  const [tokenContractValue7, setTokenContractValue7] = useState('');
  const [tokenContractValue8, setTokenContractValue8] = useState('');

  // стейт дат
  const [date1, setDate1] = useState<Date | null>(null);
  const [date2, setDate2] = useState<Date | null>(null);
  const [isCalendar1, setIsCalendar1] = useState(false);
  const [isCalendar2, setIsCalendar2] = useState(false);

  // form submit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({
      presaleType,
      tokenContractValue,
      tokenPriceValue,
      tokenContractValue2,
      tokenContractValue3,
      tokenContractValue4,
      tokenContractValue5,
      tokenContractValue6,
      tokenContractValue7,
      tokenContractValue8,
      date1,
      date2,
    });
  };

  return (
    <section className={s.page}>
      <div className={s.container}>
        <div className={s.inner}>
          <div className={s.title}>Create Pool</div>
          <div className={s.presale_type}>
            <div className={s.presale_type__title}>presale type</div>
            <div className={s.presale_type__inner}>
              <div
                tabIndex={0}
                role="button"
                className={`${s.presale_type__button} ${presaleType === 'Public' && s.active}`}
                onClick={() => setPresaleType('Public')}
                onKeyDown={() => setPresaleType('Public')}
              >
                Public
              </div>
              <div
                tabIndex={-1}
                role="button"
                className={`${s.presale_type__button} ${presaleType === 'Certified' && s.active}`}
                onClick={() => setPresaleType('Certified')}
                onKeyDown={() => setPresaleType('Certified')}
              >
                Certified
              </div>
            </div>
          </div>
          <div className={s.page_body}>
            <form action="" onSubmit={(e) => handleSubmit(e)}>
              <Input
                value={tokenContractValue}
                onChange={setTokenContractValue}
                title="BEP20 Token Contract"
              />
              <Input value={tokenPriceValue} onChange={setTokenPriceValue} title="Token Price" />
              <div className={s.small_inputs}>
                <Input
                  value={tokenContractValue2}
                  onChange={setTokenContractValue2}
                  title="BEP20 Token Contract"
                />
                <Input
                  value={tokenContractValue3}
                  onChange={setTokenContractValue3}
                  title="BEP20 Token Contract"
                />
              </div>
              <Input
                value={tokenContractValue4}
                onChange={setTokenContractValue4}
                title="BEP20 Token Contract"
              />
              <Input
                value={tokenContractValue5}
                onChange={setTokenContractValue5}
                title="BEP20 Token Contract"
              />
              {/* date pickers */}
              <div className={s.small_inputs}>
                <div className={s.datePicker}>
                  <div className={s.datePicker_title}>Date 1</div>
                  <div className={s.datePicker_inner}>
                    <div className={s.datePicker_value}>{date1?.toLocaleDateString()}</div>
                    <div
                      className={s.datePicker_img}
                      role="button"
                      tabIndex={0}
                      onClick={() => setIsCalendar1(true)}
                      onKeyDown={() => setIsCalendar1(true)}
                    >
                      <img src={calendarImg} alt="calendarImg" />
                    </div>
                  </div>
                  <div className={s.datePicker_subtitle}>In Your Timezone</div>
                </div>
                <div className={s.datePicker}>
                  <div className={s.datePicker_title}>Date 1</div>
                  <div className={s.datePicker_inner}>
                    <div className={s.datePicker_value}>{date2?.toLocaleDateString()}</div>
                    <div
                      className={s.datePicker_img}
                      role="button"
                      tabIndex={-1}
                      onClick={() => setIsCalendar2(true)}
                      onKeyDown={() => setIsCalendar2(true)}
                    >
                      <img src={calendarImg} alt="calendarImg" />
                    </div>
                  </div>
                  <div className={s.datePicker_subtitle}>In Your Timezone</div>
                </div>
              </div>
              {/* date pickers end */}
              <Input
                invalid
                value={tokenContractValue6}
                onChange={setTokenContractValue6}
                title="BEP20 Token Contract"
              />
              <Input
                value={tokenContractValue7}
                onChange={setTokenContractValue7}
                title="BEP20 Token Contract"
              />
              <Input
                value={tokenContractValue8}
                onChange={setTokenContractValue8}
                title="BEP20 Token Contract"
              />
              <div className={s.button}>
                <button type="submit" className={s.button_submit}>
                  Next
                </button>
              </div>
            </form>
          </div>
          {isCalendar1 && (
            <div className={s.calender}>
              <Calendar
                onChange={(date: Date) => setDate1(date)}
                closeCalendar={() => setIsCalendar1(false)}
              />
            </div>
          )}
          {isCalendar2 && (
            <div className={s.calender}>
              <Calendar
                onChange={(date: Date) => setDate2(date)}
                closeCalendar={() => setIsCalendar2(false)}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CreatePoolPage;
