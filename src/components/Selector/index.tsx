import { useState } from 'react';
import s from './Selector.module.scss';
import arrow from '../../assets/img/icons/arrow-gradient-fill.svg';

interface ISelectorProps {
  defaultOption: string;
  othersOptions: string[];
  fn?: any;
}

const Selector: React.FC<ISelectorProps> = ({ defaultOption, othersOptions, fn }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentOption, setCurrentOption] = useState(defaultOption);
  const [otherOptions, setOtherOptions] = useState(othersOptions);
  return (
    <div className={s.selector}>
      <div
        role="button"
        tabIndex={0}
        onKeyDown={() => setIsOpen(!isOpen)}
        onClick={() => setIsOpen(!isOpen)}
        className={s.currentOption}
      >
        {currentOption}
        <img src={arrow} alt="arrow" />
      </div>
      {isOpen && (
        <>
          {otherOptions.map((option) => (
            <div
              role="button"
              tabIndex={-1}
              onKeyDown={() => setIsOpen(false)}
              onClick={() => {
                setOtherOptions([...otherOptions.filter((opt) => opt !== option), currentOption]);
                setIsOpen(false);
                setCurrentOption(option);
                fn(option);
              }}
              className={s.option}
            >
              {option}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default Selector;
