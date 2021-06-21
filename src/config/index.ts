const IS_PRODUCTION = true;
const IS_TESTING_ON_ROPSTEN = false;
const SHOW_CONSOLE_LOGS = false;

export default {
  IS_PRODUCTION,
  IS_TESTING_ON_ROPSTEN,
  SHOW_CONSOLE_LOGS,
  version: IS_PRODUCTION ? 'Mainnet beta' : IS_TESTING_ON_ROPSTEN ? 'Ropsten beta' : 'Kovan beta',
  isMainnetOrTestnet: IS_PRODUCTION ? 'mainnet' : 'testnet',
  netType: IS_PRODUCTION ? 'mainnet' : IS_TESTING_ON_ROPSTEN ? 'ropsten' : 'kovan',
  links: {
    twitter: 'https://twitter.com/bitgeario',
    telegram: 'https://t.me/bitgear',
    medium: 'https://medium.com/bitgear.io ',
    github: 'https://github.com/',
    reddit: 'https://www.reddit.com/',
    discord: 'https://discord.gg/',
    email: 'support@mail.com',
    policy: '',
  },
  apis: {
    alchemy: IS_PRODUCTION
      ? 'https://eth.alchemyapi.io/v2/'
      : IS_TESTING_ON_ROPSTEN
      ? 'https://eth-ropsten.alchemyapi.io/v2/'
      : 'https://eth-kovan.alchemyapi.io/v2/',
  },
  keys: {
    infura: '',
  },
  chainIds: {
    mainnet: {
      'Ethereum': {
        name: 'Mainnet',
        // first id should be a number 1. other ids cause error in tradeLimit function.
        id: [1, '0x1', '0x01'],
      },
      'Binance-Smart-Chain': {
        name: 'Binance smart chain',
        id: [56, '0x38'],
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
    },
  },
  addresses: {
    // 0x contract
    mainnet: {
      // allowanceTarget: '0xdef1c0ded9bec7f1a1670819833240f027b25eff',
    },
    kovan: {
      // allowanceTarget: '0xdef1c0ded9bec7f1a1670819833240f027b25eff',
    },
    ropsten: {
      // allowanceTarget: '0xdef1c0ded9bec7f1a1670819833240f027b25eff',
    },
  },
};
