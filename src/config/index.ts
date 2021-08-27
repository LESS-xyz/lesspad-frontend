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
const SHOW_FORM_VALUES_MINE = false;
const SHOW_CERTIFIED_PRESALE = true;
const IS_FORM_EXISTING_VALUES_VALIDATION_ENABLED = false;
const IS_FORM_TIME_VALIDATION_ENABLED = false;

const INFURA_KEY = 'bf1db577e6bb42bf93893e1ea5dd1630';

const NOW = Date.now();
const MINUTE = 1000 * 60;
const HOUR = MINUTE * 60;
const DAY = IS_PRODUCTION ? MINUTE * 60 * 24 : MINUTE * 5;
const BLOCK_DURATION = IS_PRODUCTION ? MINUTE * 10 : MINUTE * 5;

// time
const VOTING_DURATION = IS_PRODUCTION ? DAY * 3 : DAY; // todo add getVotingTime from contract, check ms/s
const REGISTRATION_DURATION = DAY;
const TIER_DURATION = IS_PRODUCTION ? MINUTE * 60 * 15 : MINUTE * 5;
const PRESALE_DURATION = TIER_DURATION * 5;
const LIQUIDITY_ALLOCATION_DURATION = IS_PRODUCTION ? HOUR : MINUTE * 10;
// time certified
const APPROVE_DURATION_ON_CERTIFIED = IS_PRODUCTION ? DAY * 3 : DAY;
const REGISTRATION_DURATION_ON_CERTIFIED = DAY; // на приватном регистрации нет, там сразу есть вайтлист
const TIER_DURATION_ON_CERTIFIED = IS_PRODUCTION ? MINUTE * 60 * 15 : MINUTE * 5;
const PRESALE_DURATION_ON_CERTIFIED = TIER_DURATION * 5;
const PRESALE_DURATION_ON_CERTIFIED_PRIVATE = DAY;
const LIQUIDITY_ALLOCATION_DURATION_ON_CERTIFIED = IS_PRODUCTION ? HOUR : MINUTE * 10;

const TIER_PERCENTAGES = [30, 20, 15, 25, 10]; // Tier 5 >>> Tier 1

// const chainsInfo: any = [
//   { key: 'Ethereum', title: 'Ethereum', symbol: 'ETH', logo: ethLogo },
//   { key: 'Binance-Smart-Chain', title: 'Binance Smart Chain', symbol: 'BNB', logo: bnbLogo },
//   { key: 'Matic', title: 'Polygon (Matic)', symbol: 'MATIC', logo: maticLogo },
// ];

export default {
  IS_PRODUCTION,
  IS_TESTING_ON_ROPSTEN,
  SHOW_CONSOLE_LOGS,
  SHOW_FORM_VALUES,
  SHOW_FORM_VALUES_MINE,
  SHOW_CERTIFIED_PRESALE,
  IS_FORM_EXISTING_VALUES_VALIDATION_ENABLED,
  IS_FORM_TIME_VALIDATION_ENABLED,
  // time
  NOW,
  DAY,
  HOUR,
  MINUTE,
  TIER_DURATION,
  BLOCK_DURATION,
  VOTING_DURATION,
  REGISTRATION_DURATION,
  PRESALE_DURATION,
  LIQUIDITY_ALLOCATION_DURATION,
  //
  APPROVE_DURATION_ON_CERTIFIED,
  REGISTRATION_DURATION_ON_CERTIFIED,
  TIER_DURATION_ON_CERTIFIED,
  PRESALE_DURATION_ON_CERTIFIED,
  PRESALE_DURATION_ON_CERTIFIED_PRIVATE,
  LIQUIDITY_ALLOCATION_DURATION_ON_CERTIFIED,
  //
  TIER_PERCENTAGES,
  //
  VERSION: IS_PRODUCTION ? 'Mainnet beta' : IS_TESTING_ON_ROPSTEN ? 'Ropsten beta' : 'Kovan beta',
  IS_MAINNET_OR_TESTNET: IS_PRODUCTION ? 'mainnet' : 'testnet',
  NET_TYPE: IS_PRODUCTION ? 'mainnet' : IS_TESTING_ON_ROPSTEN ? 'ropsten' : 'kovan',
  LINKS: {
    twitter: 'https://twitter.com/',
    telegram: 'https://t.me/',
    medium: 'https://medium.com/',
    github: 'https://github.com/',
    reddit: 'https://www.reddit.com/',
    discord: 'https://discord.gg/',
    email: 'support@mail.com',
    policy: '',
  },
  APIS: {
    backend: 'https://lesspad.rocknblock.io/api/v1',
  },
  KEYS: {
    infura: INFURA_KEY,
  },
  RPC: {
    'Ethereum': IS_PRODUCTION
      ? `https://mainnet.infura.io/v3/${INFURA_KEY}`
      : `https://kovan.infura.io/v3/${INFURA_KEY}`,
    'Binance-Smart-Chain': `https://bsc-dataseed.binance.org`,
    'Matic': `https://polygon-mainnet.infura.io/v3/${INFURA_KEY}`,
  },
  CHAIN_SYMBOLS: {
    'Ethereum': 'ETH',
    'Binance-Smart-Chain': 'BNB',
    'Matic': 'MATIC',
  },
  EXPLORERS: {
    'Ethereum': IS_PRODUCTION ? 'https://etherscan.io' : 'https://kovan.etherscan.io',
    'Binance-Smart-Chain': 'https://bscscan.io',
    'Matic': 'https://polygonscan.com',
  },
  CHAIN_IDS: {
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
  CERTIFIED_PRESALE_CURRENCIES: {
    mainnet: {
      'Ethereum': {
        ETH: {
          address: '0x0000000000000000000000000000000000000000',
          decimals: 18,
        },
        USDT: {
          address: '0x07de306ff27a2b630b1141956844eb1552b956b5',
          decimals: 6,
        },
        USDC: {
          address: '0xb7a4f3e9097c08da09517b5ab877f7a917224ede',
          decimals: 6,
        },
      },
      'Binance-Smart-Chain': {
        BNB: {
          address: '',
          decimals: 18,
        },
        BUSD: {
          address: '',
          decimals: 18,
        },
      },
      'Matic': {
        MATIC: {
          address: '',
          decimals: 18,
        },
        WETH: {
          address: '',
          decimals: 18,
        },
        USDC: {
          address: '',
          decimals: 18,
        },
        QUICK: {
          address: '',
          decimals: 18,
        },
      },
    },
    testnet: {
      'Ethereum': {
        ETH: {
          address: '0x0000000000000000000000000000000000000000',
          decimals: 18,
        },
        USDT: {
          address: '0x07de306ff27a2b630b1141956844eb1552b956b5',
          decimals: 6,
        },
        USDC: {
          address: '0xb7a4f3e9097c08da09517b5ab877f7a917224ede',
          decimals: 6,
        },
      },
      'Binance-Smart-Chain': {
        BNB: {
          address: '',
          decimals: 18,
        },
        BUSD: {
          address: '',
          decimals: 18,
        },
      },
      'Matic': {
        MATIC: {
          address: '',
          decimals: 18,
        },
        WETH: {
          address: '',
          decimals: 18,
        },
        USDC: {
          address: '',
          decimals: 18,
        },
        QUICK: {
          address: '',
          decimals: 18,
        },
      },
    },
  },
  addresses: {
    mainnet: {
      Ethereum: {
        Calculations: '0x3561A02e1192B89e2415724f43521f898e867013',
        LessToken: '0x62786eeacc9246b4018e0146cb7a3efeacd9459d',
        LPToken: '0x432dbbd09fee1dfb2cae40c5abc1a301a2ef76ee',
        LessLibrary: '0x8ea0A4FC09cb381E18CE58673250ad47b6bED9cA',
        Staking: '0xE751ffdC2a684EEbcaB9Dc95fEe05c083F963Bf1',
        PresaleFactory: '0x2223af5287833BDC0c811Fb40AA37bE05401589c',
        PresaleFactoryCertified: '',
      },
    },
    testnet: {
      Ethereum: {
        Calculations: '0x9Cdb409D0bE7442f3398ec196988813C35Cc0b57',
        LessToken: '0x87feef975fd65f32A0836f910Fd13d9Cf4553690',
        LPToken: '0x4fe142c6cbd294ef96dbba8a837cde3035850a97',
        Staking: '0xE4D00cA4eceFB3bEE229FFf97ffF3de3bBAD4B4B',
        LessLibrary: '0xa78C93A963C7C1d786EFf8CFbf54f37E0E9c12E1',
        PresaleFactory: '0xa8FD2169DFf71c22cB011c07196728B9FB75C58f',
        PresaleFactoryCertified: '0x1Fc5C0aDb8e7a6d6491642b377c61bc78C3311f3',
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
  ZERO_ADDRESS: '0x0000000000000000000000000000000000000000',
};
