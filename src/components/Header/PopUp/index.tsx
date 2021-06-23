import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import s from './PopUp.module.scss';
import ethLogo from '../../../assets/img/icons/eth-logo.svg';
import bnbLogo from '../../../assets/img/icons/bnb-logo.svg';
import maticLogo from '../../../assets/img/icons/matic-logo.svg';

interface IPopUpProps {
  setCurrentCrypto?: (a: string) => void;
  setIsPopUpOpen: Dispatch<SetStateAction<boolean>>;
}

const PopUp: React.FC<IPopUpProps> = (props) => {
  const { setCurrentCrypto = () => {}, setIsPopUpOpen } = props;

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(true);
  }, []);

  const options = [
    { key: 'Ethereum', title: 'Ethereum', logo: ethLogo },
    { key: 'Binance-Smart-Chain', title: 'Binance Smart Chain', logo: bnbLogo },
    { key: 'Matic', title: 'Polygon (Matic)', logo: maticLogo },
  ];

  const handleClick = (key: string) => {
    // setCurrentCrypto(title.length > 8 ? `${title.slice(0, 7)}...` : title);
    setCurrentCrypto(key);
    setIsPopUpOpen(false);
  };

  return (
    <div className={`${s.popup} ${isOpen && s.active}`}>
      <div className={s.inner}>
        {options.map((option, index) => (
          <div
            key={option.key}
            className={s.option}
            tabIndex={index}
            role="button"
            onKeyDown={() => {}}
            onClick={() => handleClick(option.key)}
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
