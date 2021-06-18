import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import s from './PopUp.module.scss';
import ethLogo from '../../../assets/img/icons/eth-logo.svg';
import bnbLogo from '../../../assets/img/icons/bnb-logo.svg';
import polkaLogo from '../../../assets/img/icons/polkadot-logo.svg';

interface IPopUpProps {
  setCurrentCrypto: Dispatch<SetStateAction<string>>;
  setIsPopUpOpen: Dispatch<SetStateAction<boolean>>;
}

const PopUp: React.FC<IPopUpProps> = ({ setCurrentCrypto, setIsPopUpOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    setIsOpen(true);
  }, []);

  const options = [
    { title: 'Ethereum', logo: ethLogo },
    { title: 'Binance Smart Chain', logo: bnbLogo },
    { title: 'PolkaDot', logo: polkaLogo },
  ];

  const handleClick = (title: string) => {
    // setCurrentCrypto(title.length > 8 ? `${title.slice(0, 7)}...` : title);
    setCurrentCrypto(title);
    setIsPopUpOpen(false);
  };
  return (
    <div className={`${s.popup} ${isOpen && s.active}`}>
      <div className={s.inner}>
        {options.map((option, index) => (
          <div
            key={option.title}
            className={s.option}
            tabIndex={index}
            role="button"
            onKeyDown={() => handleClick(option.title)}
            onClick={() => handleClick(option.title)}
          >
            <div className={s.option_img}>
              <img src={option.logo} alt="ethLogo" />
            </div>
            <div className={s.option_text}>{option.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopUp;
