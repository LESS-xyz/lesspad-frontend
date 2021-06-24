import { useState } from 'react';
import s from './CreatePool.module.scss';
import Calendar from '../../components/Calendar/index';
import calendarImg from '../../assets/img/icons/calendar.svg';
import Input from '../../components/Input/index';
import Checkbox from '../../components/Checkbox/index';

const CreatePoolPage: React.FC = () => {
  const [tokenContractValue, setTokenContractValue] = useState('');
  const [tokenPriceValue, setTokenPriceValue] = useState('');
  // инпуты для Public type
  const [softCapValue, setSoftCapValue] = useState('');
  const [hardCapValue, setHardCapValue] = useState('');
  const [date1, setDate1] = useState<Date | null>(null);
  const [date2, setDate2] = useState<Date | null>(null);
  const [liquidityPercent, setLiquidityPercent] = useState('');
  const [pricePerTokenOnTheExchanger, setPricePerTokenOnTheExchanger] = useState('');
  const [timeToPlaceLiquidity, setTimeToPlaceLiquidity] = useState('');
  const [numberOfDaysToLockLPTokens, setNumberOfDaysToLockLPTokens] = useState('');
  const [vestingPercent, setVestingPercent] = useState('');

  // инпут для Certified type
  const [whitelistValues, setWhitelistValues] = useState('');

  // стейт календарей открыт/закрыт
  const [isCalendar1, setIsCalendar1] = useState(false);
  const [isCalendar2, setIsCalendar2] = useState(false);

  // чекбоксы
  const [isPublic, setIsPublic] = useState(true);
  const [isLiquidity, setIsLiquidity] = useState(false);
  const [isAutomatically, setIsAutomatically] = useState(false);
  const [isVesting, setIsVesting] = useState(false);
  const [isWhiteList, setIsWhiteList] = useState(false);

  // form submit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({
      isPublic,
      tokenContractValue,
      tokenPriceValue,
      softCapValue,
      hardCapValue,
      date1,
      date2,
      liquidityPercent,
      pricePerTokenOnTheExchanger,
      timeToPlaceLiquidity,
      numberOfDaysToLockLPTokens,
      whitelistValues,
      isLiquidity,
      isAutomatically,
      isVesting,
      vestingPercent,
    });
  };

  return (
    <section className={s.page}>
      <div className={s.container}>
        <div className={s.inner}>
          <div className={s.title}>Create Pool</div>
          <Checkbox
            checkboxTitle="presale type"
            optionOne="Public"
            optionTwo="Certified"
            onChange={setIsPublic}
            defaultValue={isPublic}
          />
          <div className={s.page_body}>
            <form action="" onSubmit={(e) => handleSubmit(e)}>
              <Input
                value={tokenContractValue}
                onChange={setTokenContractValue}
                title="BEP20 Token Contract"
              />
              <Input value={tokenPriceValue} onChange={setTokenPriceValue} title="Token Price" />
              <div className={s.small_inputs}>
                <Input value={softCapValue} onChange={setSoftCapValue} title="Soft Cap" />
                <Input value={hardCapValue} onChange={setHardCapValue} title="Hard Cap" />
              </div>
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
                      onKeyDown={() => {}}
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
                      onKeyDown={() => {}}
                    >
                      <img src={calendarImg} alt="calendarImg" />
                    </div>
                  </div>
                  <div className={s.datePicker_subtitle}>In Your Timezone</div>
                </div>
              </div>
              {/* date pickers end */}
              {!isPublic && (
                <Checkbox
                  defaultValue={isLiquidity}
                  onChange={setIsLiquidity}
                  checkboxTitle="liquidity / without liquidity"
                  optionOne="Liquidity"
                  optionTwo="Without liquidity"
                />
              )}

              {/* Liquidity inputs */}
              {(isPublic || isLiquidity) && (
                <>
                  <Input
                    value={liquidityPercent}
                    onChange={setLiquidityPercent}
                    title="Liquidity Percent"
                  />
                  <Input
                    value={pricePerTokenOnTheExchanger}
                    onChange={setPricePerTokenOnTheExchanger}
                    title="Price Per Token On The Exchanger"
                  />
                  <Input
                    invalid
                    value={timeToPlaceLiquidity}
                    onChange={setTimeToPlaceLiquidity}
                    title="Time To Place Liquidity"
                  />
                  <Input
                    value={numberOfDaysToLockLPTokens}
                    onChange={setNumberOfDaysToLockLPTokens}
                    title="Number Of Days To Lock LP Tokens"
                  />
                  {!isPublic && (
                    <Checkbox
                      defaultValue={isAutomatically}
                      onChange={setIsAutomatically}
                      checkboxTitle="Automatically / Not Automatically"
                      optionOne="Automatically"
                      optionTwo="Not Automatically"
                    />
                  )}
                  {/* Liquidity inputs end */}
                </>
              )}
              {!isPublic && (
                <>
                  <Checkbox
                    defaultValue={isWhiteList}
                    onChange={setIsWhiteList}
                    checkboxTitle="Whitelist / without whitelist"
                    optionOne="Whitelist"
                    optionTwo="Without whitelist"
                  />
                  {isWhiteList && (
                    <Input title="Adresses" value={whitelistValues} onChange={setWhitelistValues} />
                  )}
                  <Checkbox
                    defaultValue={isVesting}
                    onChange={setIsVesting}
                    checkboxTitle="vesting / without vesting"
                    optionOne="Vesting"
                    optionTwo="Without vesting"
                  />
                  {isVesting && (
                    <Input
                      title="Vesting Percent"
                      value={vestingPercent}
                      onChange={setVestingPercent}
                    />
                  )}
                </>
              )}
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
