export default [
  {
    inputs: [
      { internalType: 'address payable', name: '_factory', type: 'address' },
      { internalType: 'address', name: '_library', type: 'address' },
      { internalType: 'address', name: '_platformOwner', type: 'address' },
      { internalType: 'address', name: '_devAddress', type: 'address' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'addLiquidity',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'approvePresale',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'cancelPresale',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'certifiedAddition',
    outputs: [
      { internalType: 'bool', name: 'liquidity', type: 'bool' },
      { internalType: 'bool', name: 'automatically', type: 'bool' },
      { internalType: 'uint8', name: 'vesting', type: 'uint8' },
      { internalType: 'address', name: 'nativeToken', type: 'address' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_newOpenTime', type: 'uint256' },
      { internalType: 'uint256', name: '_newCloseTime', type: 'uint256' },
    ],
    name: 'changePresaleTime',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  { inputs: [], name: 'claimTokens', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'claimed',
    outputs: [
      { internalType: 'uint256', name: 'amountClaimed', type: 'uint256' },
      { internalType: 'uint256', name: 'lastTimeClaimed', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  { inputs: [], name: 'collectFee', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  {
    inputs: [],
    name: 'collectFundsRaised',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'factoryAddress',
    outputs: [{ internalType: 'address payable', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'generalInfo',
    outputs: [
      { internalType: 'address', name: 'creator', type: 'address' },
      { internalType: 'address', name: 'token', type: 'address' },
      { internalType: 'uint256', name: 'tokenPriceInWei', type: 'uint256' },
      { internalType: 'uint256', name: 'hardCapInWei', type: 'uint256' },
      { internalType: 'uint256', name: 'softCapInWei', type: 'uint256' },
      { internalType: 'uint256', name: 'tokensForSaleLeft', type: 'uint256' },
      { internalType: 'uint256', name: 'tokensForLiquidityLeft', type: 'uint256' },
      { internalType: 'uint256', name: 'openTimePresale', type: 'uint256' },
      { internalType: 'uint256', name: 'closeTimePresale', type: 'uint256' },
      { internalType: 'uint256', name: 'collectedFee', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getPresaleId',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_tier', type: 'uint256' }],
    name: 'getWhitelist',
    outputs: [{ internalType: 'address[]', name: '', type: 'address[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'id',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address[2]', name: '_creatorToken', type: 'address[2]' },
      {
        internalType: 'uint256[8]',
        name: '_priceTokensForSaleLiquiditySoftHardOpenCloseFee',
        type: 'uint256[8]',
      },
    ],
    name: 'init',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'intermediate',
    outputs: [
      { internalType: 'bool', name: 'initiate', type: 'bool' },
      { internalType: 'bool', name: 'withdrawedFunds', type: 'bool' },
      { internalType: 'bool', name: 'approved', type: 'bool' },
      { internalType: 'bool', name: 'cancelled', type: 'bool' },
      { internalType: 'bool', name: 'liquidityAdded', type: 'bool' },
      { internalType: 'uint256', name: 'beginingAmount', type: 'uint256' },
      { internalType: 'uint256', name: 'raisedAmount', type: 'uint256' },
      { internalType: 'uint256', name: 'participants', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_tokenAmount', type: 'uint256' },
      { internalType: 'bytes', name: '_signature', type: 'bytes' },
      { internalType: 'uint256', name: '_stakedAmount', type: 'uint256' },
      { internalType: 'uint256', name: '_timestamp', type: 'uint256' },
    ],
    name: 'invest',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'investments',
    outputs: [
      { internalType: 'uint256', name: 'amountEth', type: 'uint256' },
      { internalType: 'uint256', name: 'amountTokens', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'isWhitelisting',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'lessLib',
    outputs: [{ internalType: 'contract LessLibrary', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'platformOwner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'poolPercentages',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'refundLpTokens',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_tokenAmount', type: 'uint256' },
      { internalType: 'uint256', name: '_tier', type: 'uint256' },
      { internalType: 'uint256', name: '_timestamp', type: 'uint256' },
      { internalType: 'bytes', name: '_signature', type: 'bytes' },
    ],
    name: 'register',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint8[4]', name: '_poolPercentages', type: 'uint8[4]' },
      { internalType: 'uint256[5]', name: '_stakingTiers', type: 'uint256[5]' },
    ],
    name: 'setArrays',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bool', name: '_liquidity', type: 'bool' },
      { internalType: 'bool', name: '_automatically', type: 'bool' },
      { internalType: 'uint8', name: '_vesting', type: 'uint8' },
      { internalType: 'address[]', name: '_whitelist', type: 'address[]' },
      { internalType: 'address', name: '_nativeToken', type: 'address' },
    ],
    name: 'setCertifiedAddition',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_id', type: 'uint256' }],
    name: 'setPresaleId',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: '_saleTitle', type: 'bytes32' },
      { internalType: 'bytes32', name: '_linkTelegram', type: 'bytes32' },
      { internalType: 'bytes32', name: '_linkGithub', type: 'bytes32' },
      { internalType: 'bytes32', name: '_linkTwitter', type: 'bytes32' },
      { internalType: 'bytes32', name: '_linkWebsite', type: 'bytes32' },
      { internalType: 'string', name: '_linkLogo', type: 'string' },
      { internalType: 'string', name: '_description', type: 'string' },
      { internalType: 'string', name: '_whitepaper', type: 'string' },
    ],
    name: 'setStringInfo',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'price', type: 'uint256' },
      { internalType: 'uint256', name: 'duration', type: 'uint256' },
      { internalType: 'uint8', name: 'percent', type: 'uint8' },
      { internalType: 'uint256', name: 'allocationTime', type: 'uint256' },
    ],
    name: 'setUniswapInfo',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'stakingTiers',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'stringInfo',
    outputs: [
      { internalType: 'bytes32', name: 'saleTitle', type: 'bytes32' },
      { internalType: 'bytes32', name: 'linkTelegram', type: 'bytes32' },
      { internalType: 'bytes32', name: 'linkGithub', type: 'bytes32' },
      { internalType: 'bytes32', name: 'linkTwitter', type: 'bytes32' },
      { internalType: 'bytes32', name: 'linkWebsite', type: 'bytes32' },
      { internalType: 'string', name: 'linkLogo', type: 'string' },
      { internalType: 'string', name: 'description', type: 'string' },
      { internalType: 'string', name: 'whitepaper', type: 'string' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'tickets',
    outputs: [
      { internalType: 'address', name: 'user', type: 'address' },
      { internalType: 'uint256', name: 'ticketAmount', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'uniswapInfo',
    outputs: [
      { internalType: 'uint256', name: 'listingPriceInWei', type: 'uint256' },
      { internalType: 'uint256', name: 'lpTokensLockDurationInDays', type: 'uint256' },
      { internalType: 'uint8', name: 'liquidityPercentageAllocation', type: 'uint8' },
      { internalType: 'uint256', name: 'liquidityAllocationTime', type: 'uint256' },
      { internalType: 'uint256', name: 'unlockTime', type: 'uint256' },
      { internalType: 'address', name: 'lpAddress', type: 'address' },
      { internalType: 'uint256', name: 'lpAmount', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    name: 'usedSignature',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '', type: 'uint256' },
      { internalType: 'uint256', name: '', type: 'uint256' },
    ],
    name: 'whitelist',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'whitelistTier',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address payable', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'withdrawInvestment',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  { stateMutability: 'payable', type: 'receive' },
];
