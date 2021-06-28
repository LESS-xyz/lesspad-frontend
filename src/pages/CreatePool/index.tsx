import { useState } from 'react';
import s from './CreatePool.module.scss';
import Calendar from '../../components/Calendar/index';
import calendarImg from '../../assets/img/icons/calendar.svg';
import Input from '../../components/Input/index';
import Checkbox from '../../components/Checkbox/index';
import { useContractsContext } from "../../contexts/ContractsContext";
import { useSelector } from "react-redux";
import BigNumber from "bignumber.js/bignumber";

const CreatePoolPage: React.FC = () => {
  const { ContractPresaleFactory } = useContractsContext();

  const defaultOpenTime = new Date().getTime();
  const defaultCloseTime = new Date().getTime() + 1000 * 60 * 60 * 24;
  const defaultLiquidityAllocationTime = new Date().getTime() + 1000 * 60 * 60 * 48;

  const [saleTitle, setSaleTitle] = useState<string>('Rnb');
  const [description, setDescription] = useState<string>('');
  const [tokenAddress, setTokenAddress] = useState<string>('0xa372d1d35041714092900B233934fB2D002755E2');
  const [tokenPriceInWei, setTokenPriceInWei] = useState<string>('1000000000000000000');
  // инпуты для Public type
  const [softCapInWei, setSoftCapInWei] = useState<string>('1000000000000000000');
  const [hardCapInWei, setHardCapInWei] = useState<string>('2000000000000000000');
  const [openTime, setOpenTime] = useState<number>(defaultOpenTime);
  const [closeTime, setCloseTime] = useState<number>(defaultCloseTime);
  const [liquidityPercent, setLiquidityPercent] = useState<string>('0');
  const [liquidityPercentageAllocation, setLiquidityPercentageAllocation] = useState<string>('0');
  const [listingPriceInWei, setListingPriceInWei] = useState<string>('0');
  const [lpTokensLockDurationInDays, setLpTokensLockDurationInDays] = useState('0');
  const [vestingPercent, setVestingPercent] = useState<string>('0');
  const [liquidityAllocationTime, setLiquidityAllocationTime] = useState<number>(defaultLiquidityAllocationTime);
  // инпут для Certified type
  const [whitelist, setWhitelist] = useState<string>('');
  // links
  const [linkLogo, setLinkLogo] = useState<string>('');
  const [linkWebsite, setLinkWebsite] = useState<string>('');
  const [linkTelegram, setLinkTelegram] = useState<string>('');
  const [linkGithub, setLinkGithub] = useState<string>('');
  const [linkTwitter, setLinkTwitter] = useState<string>('');
  const [whitepaper, setWhitepaper] = useState<string>('');
  // стейт календарей открыт/закрыт
  const [isCalendar1, setIsCalendar1] = useState<boolean>(false);
  const [isCalendar2, setIsCalendar2] = useState<boolean>(false);
  const [isCalendarLiquidityAllocationTime, setIsCalendarLiquidityAllocationTime] = useState<boolean>(false);
  // чекбоксы
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [isLiquidity, setIsLiquidity] = useState<boolean>(false);
  const [isAutomatically, setIsAutomatically] = useState<boolean>(false);
  const [isVesting, setIsVesting] = useState<boolean>(false);
  const [isWhiteListed, setIsWhiteListed] = useState<boolean>(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);

  const { address: userAddress } = useSelector(({ user }: any) => user);

  const minInvestInWei = new BigNumber(10).pow(10).toString(10); // todo
  const maxInvestInWei = new BigNumber(10).pow(20).toString(10); // todo
  // const presaleType = isPublic ? 1 : 0;
  // const whitelistArray = whitelist ? whitelist.split(',') : [];

  const handleError = (value: any, message?: string) => {
    if (isFormSubmitted && !value) return message || 'Enter value';
    return undefined;
  }

  const validateForm = () => {
    if (!saleTitle) return false;
    if (!tokenAddress) return false;
    if (!tokenPriceInWei) return false;
    if (!softCapInWei) return false;
    if (!hardCapInWei) return false;
    if (!maxInvestInWei) return false;
    if (!minInvestInWei) return false;
    if (!openTime) return false;
    if (!closeTime) return false;
    // if (!presaleType) return false;
    // if (!liquidityPercent) return false;
    // if (!whitelistArray) return false;
    // if (!listingPriceInWei) return false;
    // if (!lpTokensLockDurationInDays) return false;
    // if (!liquidityPercentageAllocation) return false;
    // if (!liquidityAllocationTime) return false;
    return true;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('handleSubmit:', { vestingPercent })
    if (!validateForm()) {
      setIsFormSubmitted(true);
      // return; // todo
    }
    // struct PresaleInfo {
    //   address tokenAddress;
    //   uint256 tokenPriceInWei;
    //   uint256 hardCapInWei;
    //   uint256 softCapInWei;
    //   uint256 openTime;
    //   uint256 closeTime;
    // }
    //
    // struct CertifiedAddition {
    //   bool liquidity;
    //   bool automatically;
    //   bool vesting;
    //   bool whitelisted;
    //   address[] whitelist;
    // }
    //
    // struct PresalePancakeSwapInfo {
    //   uint256 listingPriceInWei;
    //   uint256 lpTokensLockDurationInDays;
    //   uint8 liquidityPercentageAllocation;
    //   uint256 liquidityAllocationTime;
    // }
    //
    // struct PresaleStringInfo {
    //   bytes32 saleTitle;
    //   bytes32 linkTelegram;
    //   bytes32 linkGithub;
    //   bytes32 linkTwitter;
    //   bytes32 linkWebsite;
    //   string linkLogo;
    //   string description;
    //   string whitepaper;
    // }

    // порядок полей менять нельзя!
    const presaleInfo = [
      tokenAddress,
      tokenPriceInWei,
      hardCapInWei,
      softCapInWei,
      // maxInvestInWei,
      // minInvestInWei, // 5
      openTime,
      closeTime,
      // presaleType,
      // isLiquidity,
      // isAutomatically, // 10
      // isWhiteListed,
      // whitelistArray,
      // isVesting,
    ]
    // порядок полей менять нельзя!
    const presalePancakeSwapInfo = [
      listingPriceInWei,
      lpTokensLockDurationInDays,
      liquidityPercentageAllocation,
      liquidityAllocationTime,
    ]
    // порядок полей менять нельзя!
    const presaleStringInfo = [
      saleTitle,
      linkTelegram,
      linkGithub,
      linkTwitter,
      linkWebsite,
      linkLogo,
      description,
      whitepaper,
    ]

    console.log({ isPublic, presaleInfo, presalePancakeSwapInfo, presaleStringInfo })
    setIsFormSubmitted(true);
    const resultCreatePresalePublic = await ContractPresaleFactory.createPresalePublic({
      userAddress, presaleInfo, presalePancakeSwapInfo, presaleStringInfo
    })
    console.log('CreatePool handleSubmit', resultCreatePresalePublic)
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
                title="Sale title"
                value={saleTitle}
                onChange={setSaleTitle}
                error={handleError(saleTitle)}
              />
              <Input
                title="Description"
                value={description}
                onChange={setDescription}
              />
              <Input
                title="Token Contract Address"
                value={tokenAddress}
                onChange={setTokenAddress}
                error={handleError(tokenAddress)}
              />
              <Input
                title="Token Price (in wei)"
                value={tokenPriceInWei}
                onChange={setTokenPriceInWei}
                error={handleError(tokenPriceInWei)}
              />
              <div className={s.small_inputs}>
                <Input
                  title="Soft Cap (in wei)"
                  value={softCapInWei}
                  onChange={setSoftCapInWei}
                  error={handleError(softCapInWei)}
                />
                <Input
                  title="Hard Cap (in wei)"
                  value={hardCapInWei}
                  onChange={setHardCapInWei}
                  error={handleError(hardCapInWei)}
                />
              </div>
              {/* date pickers */}
              <div className={s.small_inputs}>
                <div className={s.datePicker}>
                  <div className={s.datePicker_title}>Open date</div>
                  <div className={s.datePicker_inner}>
                    <div className={s.datePicker_value}>{new Date(openTime)?.toLocaleDateString()}</div>
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
                  <div className={s.datePicker_title}>Close date</div>
                  <div className={s.datePicker_inner}>
                    <div className={s.datePicker_value}>{new Date(closeTime)?.toLocaleDateString()}</div>
                    <div
                      className={s.datePicker_img}
                      role="button"
                      tabIndex={-1}
                      onClick={() => setIsCalendarLiquidityAllocationTime(true)}
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
                    title="Liquidity Percent"
                    value={liquidityPercent}
                    onChange={setLiquidityPercent}
                    // error={handleError(liquidityPercent)}
                  />
                  <Input
                    title="Liquidity Percentage allocation"
                    value={liquidityPercentageAllocation}
                    onChange={setLiquidityPercentageAllocation}
                    // error={handleError(liquidityPercentageAllocation)}
                  />
                  <Input
                    title="Listing price (in wei)"
                    value={listingPriceInWei}
                    onChange={setListingPriceInWei}
                    // error={handleError(listingPriceInWei)}
                  />
                  <Input
                    title="Number Of Days To Lock LP Tokens"
                    value={lpTokensLockDurationInDays}
                    onChange={setLpTokensLockDurationInDays}
                    // error={handleError(lpTokensLockDurationInDays)}
                  />
                  <div className={s.datePicker}>
                    <div className={s.datePicker_title}>Liquidity Allocation Time</div>
                    <div className={s.datePicker_inner}>
                      <div className={s.datePicker_value}>{new Date(liquidityAllocationTime)?.toLocaleDateString()}</div>
                      <div
                        className={s.datePicker_img}
                        role="button"
                        tabIndex={0}
                        onClick={() => setIsCalendarLiquidityAllocationTime(true)}
                        onKeyDown={() => {}}
                      >
                        <img src={calendarImg} alt="calendarImg" />
                      </div>
                    </div>
                    <div className={s.datePicker_subtitle}>In Your Timezone</div>
                  </div>
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
                    defaultValue={isWhiteListed}
                    onChange={setIsWhiteListed}
                    checkboxTitle="Whitelist / without whitelist"
                    optionOne="Whitelist"
                    optionTwo="Without whitelist"
                  />
                  {isWhiteListed && (
                    <Input
                      title="Adresses"
                      value={whitelist}
                      onChange={setWhitelist}
                    />
                  )}
                  <Checkbox
                    defaultValue={isVesting}
                    onChange={setIsVesting}
                    checkboxTitle="vesting / without vesting"
                    optionOne="Vesting"
                    optionTwo="Without vesting"
                  />
                  {isVesting && (
                    <>
                      <Input
                        title="Vesting Percent"
                        value={vestingPercent}
                        onChange={setVestingPercent}
                      />
                    </>
                  )}
                </>
              )}

              <Input
                value={linkLogo}
                onChange={setLinkLogo}
                title="Link to logo"
              />
              <Input
                value={linkWebsite}
                onChange={setLinkWebsite}
                title="Link to Website"
              />
              <Input
                value={linkTelegram}
                onChange={setLinkTelegram}
                title="Link to Telegram"
              />
              <Input
                value={linkGithub}
                onChange={setLinkGithub}
                title="Link to Github"
              />
              <Input
                value={linkTwitter}
                onChange={setLinkTwitter}
                title="Link to Twitter"
              />
              <Input
                value={whitepaper}
                onChange={setWhitepaper}
                title="Whitepaper"
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
                onChange={(date: number) => setOpenTime(date)}
                closeCalendar={() => setIsCalendar1(false)}
              />
            </div>
          )}
          {isCalendar2 && (
            <div className={s.calender}>
              <Calendar
                onChange={(date: number) => setCloseTime(date)}
                closeCalendar={() => setIsCalendar2(false)}
              />
            </div>
          )}
          {isCalendarLiquidityAllocationTime && (
            <div className={s.calender}>
              <Calendar
                onChange={(date: number) => setLiquidityAllocationTime(date)}
                closeCalendar={() => setIsCalendarLiquidityAllocationTime(false)}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CreatePoolPage;
