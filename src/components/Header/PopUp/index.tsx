import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';

import bnbLogo from '../../../assets/img/icons/bnb-logo.svg';
import ethLogo from '../../../assets/img/icons/eth-logo.svg';
import maticLogo from '../../../assets/img/icons/matic-logo.svg';

import s from './PopUp.module.scss';

interface IPopUpProps {
  setCurrentCrypto?: (a: string) => void;
  setIsPopUpOpen: Dispatch<SetStateAction<boolean>>;
  refButton?: any;
  style?: any;
}

const chains: any = {
  bnbt: {
    chainId: '0x61',
    chainName: 'Binance Smart Chain Testnet',
    nativeCurrency: {
      name: 'tBNB',
      symbol: 'tBNB',
      decimals: 18,
    },
    rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
    blockExplorerUrls: ['https://testnet.bscscan.com'],
  },
  tmatic: {
    chainId: '0x13881',
    chainName: 'Matic Testnet Mumbai',
    nativeCurrency: {
      name: 'tMATIC',
      symbol: 'tMATIC',
      decimals: 18,
    },
    rpcUrls: ['https://rpc-mumbai.matic.today'],
    blockExplorerUrls: ['https://matic.network/'],
  },
};

const PopUp: React.FC<IPopUpProps> = (props) => {
  const { setCurrentCrypto = () => {}, setIsPopUpOpen, refButton, style = {} } = props;

  const [isOpen, setIsOpen] = useState(false);

  const refPopup = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsOpen(true);
  }, []);

  const options = [
    { key: 'Ethereum', title: 'Ethereum', logo: ethLogo },
    { key: 'Binance-Smart-Chain', title: 'Binance Smart Chain', logo: bnbLogo },
    { key: 'Matic', title: 'Polygon (Matic)', logo: maticLogo },
  ];

  const switchChain = async (chainName: string) => {
    try {
      await (window as any).ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chains[chainName].chainId }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await (window as any).ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [chains[chainName]],
          });
        } catch (e) {
          console.log('SwitchError error:', e);
        }
      }
    }
  };

  const handleClick = (key: string) => {
    // setCurrentCrypto(title.length > 8 ? `${title.slice(0, 7)}...` : title);
    switchChain(key);
    setCurrentCrypto(key);
    setIsPopUpOpen(false);
  };

  const handleClickOutside = (e: any) => {
    if (!refPopup?.current?.contains(e.target) && !refButton?.current?.contains(e.target)) {
      setIsPopUpOpen(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`${s.popup} ${isOpen && s.active}`} ref={refPopup} style={style}>
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
