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
const INFURA_KEY = 'bf1db577e6bb42bf93893e1ea5dd1630';

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
        PresalePublic: '0x4140591320F65Ac133F8fb350455be2A1fc90951',
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
        Calculations: '0x88f487A9D4426f1D1ae0F27A76af1ac68AAEec94',
        LessToken: '0x87feef975fd65f32A0836f910Fd13d9Cf4553690',
        LPToken: '0x4fe142c6CBD294ef96DbBa8a837CdE3035850A97',
        Staking: '0xE4D00cA4eceFB3bEE229FFf97ffF3de3bBAD4B4B',
        LessLibrary: '0xc0F0352a566681790D76D32842537D06032D36Bb',
        PresaleFactory: '0x2900756111e324f6493CbFfc1b678D6531D29A09',
        PresaleFactoryCertified: '0x513b747467786DFE863bF4cefEbCCfAcE6b782b1',
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
