export default [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_bscsInfoAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_bscsToken',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_safeStakingPool',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'presaleId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'creator',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'tokenAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'timeForLiquidity',
        type: 'uint256',
      },
    ],
    name: 'CertifiedAutoPresaleCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'presaleId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'creator',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'tokenAddress',
        type: 'address',
      },
    ],
    name: 'CertifiedPresaleCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'presaleId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'creator',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'presaleAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'tokenAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'timeForLiquidity',
        type: 'uint256',
      },
    ],
    name: 'PublicPresaleCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'Received',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_address',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: '_canSign',
        type: 'bool',
      },
    ],
    name: 'addOrRemoveSigner',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'tokenAddress',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'tokenPriceInWei',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'hardCapInWei',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'softCapInWei',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'openVotingTime',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'openTime',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'closeTime',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: '_tokenAmount',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: '_signature',
            type: 'bytes',
          },
          {
            internalType: 'uint256',
            name: '_timestamp',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'WETHAddress',
            type: 'address',
          },
        ],
        internalType: 'struct PresaleFactory.PresaleInfo',
        name: '_info',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'listingPriceInWei',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'lpTokensLockDurationInDays',
            type: 'uint256',
          },
          {
            internalType: 'uint8',
            name: 'liquidityPercentageAllocation',
            type: 'uint8',
          },
          {
            internalType: 'uint256',
            name: 'liquidityAllocationTime',
            type: 'uint256',
          },
        ],
        internalType: 'struct PresaleFactory.PresalePancakeSwapInfo',
        name: '_cakeInfo',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'bytes32',
            name: 'saleTitle',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'linkTelegram',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'linkGithub',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'linkTwitter',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'linkWebsite',
            type: 'bytes32',
          },
          {
            internalType: 'string',
            name: 'linkLogo',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'description',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'whitepaper',
            type: 'string',
          },
        ],
        internalType: 'struct PresaleFactory.PresaleStringInfo',
        name: '_stringInfo',
        type: 'tuple',
      },
    ],
    name: 'createPresalePublic',
    outputs: [
      {
        internalType: 'uint256',
        name: 'presaleId',
        type: 'uint256',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_address',
        type: 'address',
      },
    ],
    name: 'isSigner',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address payable',
        name: '_newFactory',
        type: 'address',
      },
    ],
    name: 'migrateTo',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'safeLibrary',
    outputs: [
      {
        internalType: 'contract LessLibrary',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'safeStakingPool',
    outputs: [
      {
        internalType: 'contract Staking',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_lib',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_staking',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_token',
        type: 'address',
      },
    ],
    name: 'setLibStakingToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'token',
    outputs: [
      {
        internalType: 'contract ERC20',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    stateMutability: 'payable',
    type: 'receive',
  },
];
