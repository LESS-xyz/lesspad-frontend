export default [
  {
    inputs: [{ internalType: 'address', name: '_bscsInfoAddress', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'uint256', name: 'presaleId', type: 'uint256' },
      { indexed: false, internalType: 'address', name: 'creator', type: 'address' },
      { indexed: false, internalType: 'address', name: 'tokenAddress', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'timeForLiquidity', type: 'uint256' },
    ],
    name: 'CertifiedAutoPresaleCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'uint256', name: 'presaleId', type: 'uint256' },
      { indexed: false, internalType: 'address', name: 'creator', type: 'address' },
      { indexed: false, internalType: 'address', name: 'tokenAddress', type: 'address' },
    ],
    name: 'CertifiedPresaleCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'from', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'Received',
    type: 'event',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'tokenAddress', type: 'address' },
          { internalType: 'uint256', name: 'tokenPriceInWei', type: 'uint256' },
          { internalType: 'uint256', name: 'hardCapInWei', type: 'uint256' },
          { internalType: 'uint256', name: 'softCapInWei', type: 'uint256' },
          { internalType: 'uint256', name: 'openTime', type: 'uint256' },
          { internalType: 'uint256', name: 'closeTime', type: 'uint256' },
          { internalType: 'uint256', name: '_tokenAmount', type: 'uint256' },
          { internalType: 'bytes', name: '_signature', type: 'bytes' },
          { internalType: 'uint256', name: '_timestamp', type: 'uint256' },
          { internalType: 'uint8[4]', name: 'poolPercentages', type: 'uint8[4]' },
          { internalType: 'uint256[5]', name: 'stakingTiers', type: 'uint256[5]' },
        ],
        internalType: 'struct PresaleFactoryCertified.PresaleInfo',
        name: '_info',
        type: 'tuple',
      },
      {
        components: [
          { internalType: 'bool', name: 'liquidity', type: 'bool' },
          { internalType: 'bool', name: 'automatically', type: 'bool' },
          { internalType: 'uint8', name: 'vesting', type: 'uint8' },
          { internalType: 'address[]', name: 'whitelist', type: 'address[]' },
          { internalType: 'address', name: 'nativeToken', type: 'address' },
        ],
        internalType: 'struct PresaleFactoryCertified.CertifiedAddition',
        name: '_addition',
        type: 'tuple',
      },
      {
        components: [
          { internalType: 'uint256', name: 'listingPriceInWei', type: 'uint256' },
          { internalType: 'uint256', name: 'lpTokensLockDurationInDays', type: 'uint256' },
          { internalType: 'uint8', name: 'liquidityPercentageAllocation', type: 'uint8' },
          { internalType: 'uint256', name: 'liquidityAllocationTime', type: 'uint256' },
        ],
        internalType: 'struct PresaleFactoryCertified.PresalePancakeSwapInfo',
        name: '_cakeInfo',
        type: 'tuple',
      },
      {
        components: [
          { internalType: 'bytes32', name: 'saleTitle', type: 'bytes32' },
          { internalType: 'bytes32', name: 'linkTelegram', type: 'bytes32' },
          { internalType: 'bytes32', name: 'linkGithub', type: 'bytes32' },
          { internalType: 'bytes32', name: 'linkTwitter', type: 'bytes32' },
          { internalType: 'bytes32', name: 'linkWebsite', type: 'bytes32' },
          { internalType: 'string', name: 'linkLogo', type: 'string' },
          { internalType: 'string', name: 'description', type: 'string' },
          { internalType: 'string', name: 'whitepaper', type: 'string' },
        ],
        internalType: 'struct PresaleFactoryCertified.PresaleStringInfo',
        name: '_stringInfo',
        type: 'tuple',
      },
    ],
    name: 'createPresaleCertified',
    outputs: [{ internalType: 'uint256', name: 'presaleId', type: 'uint256' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address payable', name: '_newFactory', type: 'address' }],
    name: 'migrateTo',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'safeLibrary',
    outputs: [{ internalType: 'contract LessLibrary', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  { stateMutability: 'payable', type: 'receive' },
];
