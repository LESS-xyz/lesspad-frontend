import s from './Search.module.scss';
import searcgImg from '../../assets/img/icons/search.svg';
import { useState } from 'react';

interface IInputProps {
  onChange: (str: string) => void;
  value: string;
  placeholder?: string;
  big?: boolean;
}

const Search: React.FC<IInputProps> = ({ onChange, value, placeholder, big }) => {
  const [inputValue, setInputValue] = useState(value);
  const handleOnChange = (str: string) => {
    setInputValue(str);
    onChange(str);
  };
  return (
    <div className={`${s.input} ${big && s.big}`}>
      <div className={s.input_img}>
        <img src={searcgImg} alt="searcgImg" />
      </div>
      <input
        value={inputValue}
        onChange={(e) => handleOnChange(e.target.value)}
        type="text"
        placeholder={placeholder}
      />
    </div>
  );
};

export default Search;
