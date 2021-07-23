import ERC20Abi from '../data/ERC20Abi';
import LessLibraryAbi from '../data/LessLibraryAbi';
import LPTokenAbi from '../data/LPTokenAbi';
import PresaleFactoryAbi from '../data/PresaleFactoryAbi';
import PresalePublicAbi from '../data/PresalePublicAbi';
import StakingAbi from '../data/StakingAbi';

const IS_PRODUCTION = false;
const IS_TESTING_ON_ROPSTEN = false;
const SHOW_CONSOLE_LOGS = true;

export default {
  IS_PRODUCTION,
  IS_TESTING_ON_ROPSTEN,
  SHOW_CONSOLE_LOGS,
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
    infura: '',
  },
  chainSymbols: {
    'Ethereum': 'ETH',
    'Binance-Smart-Chain': 'BNB',
    'Matic': 'MATIC',
  },
  explorers: {
    'Ethereum': 'https://etherscan.io',
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
      // 'Ethereum': {
      //   LessToken: '0xa372d1d35041714092900B233934fB2D002755E2',
      //   LessLibrary: '0x46589Ab934277E44A5060f3273761b86396d5429',
      //   Staking: '0xF4Fa7Fd880Eb889B4829126d89C4F09304B73270',
      //   PresaleFactory: '0xB9733F217111A845A268d1D98EE91800907860e2',
      //   PresalePublic: '0xeA63Bfc235c1f70BE88287BCed13A42550C40DF3',
      // },
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
        LessToken: '0x87feef975fd65f32A0836f910Fd13d9Cf4553690',
        LPToken: '0x4fe142c6CBD294ef96DbBa8a837CdE3035850A97',
        LessLibrary: '0xA0BDCb13fD00D7cEF0eb872C4537fbf3F379E5Bb',
        Staking: '0xfd99C422A81032a6E332533Afa64D6556Adaad6a',
        PresaleFactory: '0x451d4bC560404b0aF65f967B125c864EbD69559d',
        PresalePublic: '0xCaC38897188e2FD8A3655f183cf86521040108fE',
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
    mainnet: {},
    testnet: {
      Ethereum: {
        LessToken: ERC20Abi,
        LPToken: LPTokenAbi,
        LessLibrary: LessLibraryAbi,
        Staking: StakingAbi,
        PresaleFactory: PresaleFactoryAbi,
        PresalePublic: PresalePublicAbi,
      },
    },
  },
};
