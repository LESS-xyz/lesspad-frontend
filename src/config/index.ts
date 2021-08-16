import CalculationsAbi from '../data/abi/CalculationsAbi';
import ERC20Abi from '../data/abi/ERC20Abi';
import LessLibraryAbi from '../data/abi/LessLibraryAbi';
import LPTokenAbi from '../data/abi/LPTokenAbi';
import PresaleCertifiedAbi from '../data/abi/PresaleCertifiedAbi';
import PresaleFactoryAbi from '../data/abi/PresaleFactoryAbi';
import PresaleFactoryCertifiedAbi from '../data/abi/PresaleFactoryCertifiedAbi';
import PresalePublicAbi from '../data/abi/PresalePublicAbi';
import StakingAbi from '../data/abi/StakingAbi';
import UniswapRouterAbi from '../data/abi/UniswapRouterAbi';

const IS_PRODUCTION = false;
const IS_TESTING_ON_ROPSTEN = false;
const SHOW_CONSOLE_LOGS = true;
const SHOW_FORM_VALUES = true;
const INFURA_KEY = 'bf1db577e6bb42bf93893e1ea5dd1630';

const NOW = Date.now(); // todo
const DAY = 1000 * 60 * 5; // todo
const TIER_TIME = IS_PRODUCTION ? 1000 * 60 * 60 : 1000 * 60 * 5; // todo:
const VOTING_TIME = IS_PRODUCTION ? DAY * 3 : DAY; // todo:
const REGISTRATION_TIME = DAY; // todo:

export default {
  IS_PRODUCTION,
  IS_TESTING_ON_ROPSTEN,
  SHOW_CONSOLE_LOGS,
  SHOW_FORM_VALUES,
  NOW,
  DAY,
  TIER_TIME,
  VOTING_TIME,
  REGISTRATION_TIME,
  version: IS_PRODUCTION ? 'Mainnet beta' : IS_TESTING_ON_ROPSTEN ? 'Ropsten beta' : 'Kovan beta',
  isMainnetOrTestnet: IS_PRODUCTION ? 'mainnet' : 'testnet',
  netType: IS_PRODUCTION ? 'mainnet' : IS_TESTING_ON_ROPSTEN ? 'ropsten' : 'kovan',
  links: {
    twitter: 'https://twitter.com/',
    telegram: 'https://t.me/',
    medium: 'https://medium.com/',
    github: 'https://github.com/',
    reddit: 'https://www.reddit.com/',
    discord: 'https://discord.gg/',
    email: 'support@mail.com',
    policy: '',
  },
  apis: {
    'backend': 'https://lesspad.rocknblock.io/api/v1',
    '0x': IS_PRODUCTION
      ? 'https://api.0x.org'
      : IS_TESTING_ON_ROPSTEN
      ? 'https://ropsten.api.0x.org/'
      : 'https://kovan.api.0x.org/',
  },
  keys: {
    infura: INFURA_KEY,
  },
  rpc: {
    'Ethereum': IS_PRODUCTION
      ? `https://mainnet.infura.io/v3/${INFURA_KEY}`
      : `https://kovan.infura.io/v3/${INFURA_KEY}`,
    'Binance-Smart-Chain': `https://bsc-dataseed.binance.org`,
    'Matic': `https://polygon-mainnet.infura.io/v3/${INFURA_KEY}`,
  },
  chainSymbols: {
    'Ethereum': 'ETH',
    'Binance-Smart-Chain': 'BNB',
    'Matic': 'MATIC',
  },
  explorers: {
    'Ethereum': IS_PRODUCTION ? 'https://etherscan.io' : 'https://kovan.etherscan.io',
    'Binance-Smart-Chain': 'https://bscscan.io',
    'Matic': 'https://polygonscan.com',
  },
  chainIds: {
    mainnet: {
      'Ethereum': {
        name: 'Ethereum',
        id: [1, '0x1', '0x01'],
      },
      'Binance-Smart-Chain': {
        name: 'Binance smart chain',
        id: [56, '0x38'],
      },
      'Matic': {
        name: 'Matic',
        id: [137, '0x137'],
      },
    },
    testnet: {
      'Ethereum': !IS_TESTING_ON_ROPSTEN
        ? {
            name: 'Kovan testnet',
            id: [42, '0x2a'],
          }
        : {
            name: 'Ropsten testnet',
            id: [3, '0x3'],
          },
      'Binance-Smart-Chain': {
        name: 'Binance smart chain testnet',
        id: [97, '0x61'],
      },
      // todo
      'Matic': {
        name: 'Matic testnet',
        id: [137, '0x137'],
      },
    },
  },
  addresses: {
    mainnet: {
      // todo
      Ethereum: {
        // Calculations: '0x62786eeacc9246b4018e0146cb7a3efeacd9459d',
        LessToken: '0x62786eeacc9246b4018e0146cb7a3efeacd9459d',
        LessLibrary: '0x46589Ab934277E44A5060f3273761b86396d5429',
        Staking: '0xE751ffdC2a684EEbcaB9Dc95fEe05c083F963Bf1',
        PresaleFactory: '0xB9733F217111A845A268d1D98EE91800907860e2',
        LPToken: '0x432dbbd09fee1dfb2cae40c5abc1a301a2ef76ee',
      },
      // 'Binance-Smart-Chain': {
      //   LessToken: '0xa372d1d35041714092900B233934fB2D002755E2',
      //   LessLibrary: '0x46589Ab934277E44A5060f3273761b86396d5429',
      //   Staking: '0xF4Fa7Fd880Eb889B4829126d89C4F09304B73270',
      //   PresaleFactory: '0xB9733F217111A845A268d1D98EE91800907860e2',
      //   PresalePublic: '0xeA63Bfc235c1f70BE88287BCed13A42550C40DF3',
      // },
    },
    testnet: {
      'Ethereum': {
        Calculations: '0x9Cdb409D0bE7442f3398ec196988813C35Cc0b57',
        LessToken: '0x87feef975fd65f32A0836f910Fd13d9Cf4553690',
        LPToken: '0x4fe142c6cbd294ef96dbba8a837cde3035850a97',
        Staking: '0xE4D00cA4eceFB3bEE229FFf97ffF3de3bBAD4B4B',
        LessLibrary: '0xa78C93A963C7C1d786EFf8CFbf54f37E0E9c12E1',
        PresaleFactory: '0xa8FD2169DFf71c22cB011c07196728B9FB75C58f',
        PresaleFactoryCertified: '0x30457a87c85b4fcf4127e1d07f64035493e52940',
        // PresalePublic: '0x4453Dc4B13b29A227fb3eE3E41Dd590410e1729b',
      },
      'Binance-Smart-Chain': {
        // todo
        // LessToken: '0xa372d1d35041714092900B233934fB2D002755E2',
        // LessLibrary: '0x46589Ab934277E44A5060f3273761b86396d5429',
        // Staking: '0xF4Fa7Fd880Eb889B4829126d89C4F09304B73270',
        // PresaleFactory: '0xB9733F217111A845A268d1D98EE91800907860e2',
        // PresalePublic: '0xeA63Bfc235c1f70BE88287BCed13A42550C40DF3',
      },
    },
  },
  abis: {
    mainnet: {
      Ethereum: {
        Calculations: CalculationsAbi,
        ERC20: ERC20Abi,
        LessToken: ERC20Abi,
        LPToken: LPTokenAbi,
        LessLibrary: LessLibraryAbi,
        Staking: StakingAbi,
        PresaleFactory: PresaleFactoryAbi,
        PresaleFactoryCertified: PresaleFactoryCertifiedAbi,
        PresalePublic: PresalePublicAbi,
        PresaleCertified: PresaleCertifiedAbi,
        UniswapRouter: UniswapRouterAbi,
      },
    },
    testnet: {
      Ethereum: {
        Calculations: CalculationsAbi,
        ERC20: ERC20Abi,
        LessToken: ERC20Abi,
        LPToken: LPTokenAbi,
        LessLibrary: LessLibraryAbi,
        Staking: StakingAbi,
        PresaleFactory: PresaleFactoryAbi,
        PresaleFactoryCertified: PresaleFactoryCertifiedAbi,
        PresalePublic: PresalePublicAbi,
        PresaleCertified: PresaleCertifiedAbi,
        UniswapRouter: UniswapRouterAbi,
      },
    },
  },
};
