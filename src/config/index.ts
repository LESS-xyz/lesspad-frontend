import ERC20Abi from '../data/ERC20Abi';
import LessLibraryAbi from '../data/LessLibraryAbi';
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
        // LessToken: '0xa372d1d35041714092900b233934fb2d002755e2',
        // LessToken: '0xa372d1d35041714092900b233934fb2d002755e2',
        // LessToken: '0xE29dA66439BcBdB71D508f41bAd13250F561E38f',
        LessToken: '0x6d478B336D39707B57b4747d7cfca3386516B859',
        // LessLibrary: '0x42d58A23259Fb09A02384d80772Ee8236ef63732',
        // LessLibrary: '0x4b01de89936046228d87dad26b7796ea8f424fa4',
        // LessLibrary: '0x46d240A3627Ebf2F507C91c9aA604d6535cCb07a',
        LessLibrary: '0xe5a7797412Df5b9012B0f7b2BCAccEccc9ADf08e',
        // Staking: '0x2D01C2d1adA5D0311A8d16aDA865662a3658C91F',
        // Staking: '0xf3016a3c8ddd673535a058b2b86aa6299639e933',
        // Staking: '0x1756715185E7d1AF64ec555591A6B8ea64D07f8E',
        Staking: '0xaa6cb791e73f96983dc0ac87c6ac477eced79348',
        // PresaleFactory: '0xe9e9a8bacEC4894bDCBf4F63f57A9A5F0D8432BD',
        // PresaleFactory: '0x33918Fa73f367000c0911d8dD5949684e4ca3468',
        // PresaleFactory: '0x8DD3992F6968C08283F8cDB3f6e41d10dBa2Df5c',
        PresaleFactory: '0xF18212af9DB0F40EcCC076b00cd8a1Fe9B51477C',
        PresalePublic: '0xeA63Bfc235c1f70BE88287BCed13A42550C40DF3', // todo
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
        LessLibrary: LessLibraryAbi,
        Staking: StakingAbi,
        PresaleFactory: PresaleFactoryAbi,
        PresalePublic: PresalePublicAbi,
      },
    },
  },
};
