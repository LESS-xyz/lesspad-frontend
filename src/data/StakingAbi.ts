// export default [
//   {
//     inputs: [
//       { internalType: 'address', name: '_safeToken', type: 'address' },
//       { internalType: 'address', name: '_safeLibrary', type: 'address' },
//     ],
//     stateMutability: 'nonpayable',
//     type: 'constructor',
//   },
//   {
//     anonymous: false,
//     inputs: [
//       { indexed: true, internalType: 'address', name: 'from', type: 'address' },
//       { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
//     ],
//     name: 'Staked',
//     type: 'event',
//   },
//   {
//     anonymous: false,
//     inputs: [
//       { indexed: true, internalType: 'address', name: 'from', type: 'address' },
//       { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
//     ],
//     name: 'Unstaked',
//     type: 'event',
//   },
//   {
//     inputs: [{ internalType: 'address', name: '', type: 'address' }],
//     name: 'accountInfos',
//     outputs: [
//       { internalType: 'uint256', name: 'balance', type: 'uint256' },
//       { internalType: 'uint256', name: 'lastStakedTimestamp', type: 'uint256' },
//       { internalType: 'uint256', name: 'lastUnstakedTimestamp', type: 'uint256' },
//     ],
//     stateMutability: 'view',
//     type: 'function',
//   },
//   {
//     inputs: [{ internalType: 'address', name: 'staker', type: 'address' }],
//     name: 'getAccountInfo',
//     outputs: [
//       { internalType: 'uint256', name: '', type: 'uint256' },
//       { internalType: 'uint256', name: '', type: 'uint256' },
//       { internalType: 'uint256', name: '', type: 'uint256' },
//     ],
//     stateMutability: 'view',
//     type: 'function',
//   },
//   {
//     inputs: [],
//     name: 'getStakedAmount',
//     outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
//     stateMutability: 'view',
//     type: 'function',
//   },
//   {
//     inputs: [],
//     name: 'safeLibrary',
//     outputs: [{ internalType: 'contract LessLibrary', name: '', type: 'address' }],
//     stateMutability: 'view',
//     type: 'function',
//   },
//   {
//     inputs: [],
//     name: 'safeToken',
//     outputs: [{ internalType: 'contract IERC20', name: '', type: 'address' }],
//     stateMutability: 'view',
//     type: 'function',
//   },
//   {
//     inputs: [{ internalType: 'address', name: '_newInfo', type: 'address' }],
//     name: 'setLibraryAddress',
//     outputs: [],
//     stateMutability: 'nonpayable',
//     type: 'function',
//   },
//   {
//     inputs: [{ internalType: 'uint256', name: '_amount', type: 'uint256' }],
//     name: 'stake',
//     outputs: [],
//     stateMutability: 'nonpayable',
//     type: 'function',
//   },
//   {
//     inputs: [{ internalType: 'uint256', name: '_amount', type: 'uint256' }],
//     name: 'unstake',
//     outputs: [],
//     stateMutability: 'nonpayable',
//     type: 'function',
//   },
// ];

// export default [
//   {
//     inputs: [
//       { internalType: 'address', name: '_safeToken', type: 'address' },
//       { internalType: 'address', name: '_safeLibrary', type: 'address' },
//     ],
//     stateMutability: 'nonpayable',
//     type: 'constructor',
//   },
//   {
//     anonymous: false,
//     inputs: [
//       { indexed: true, internalType: 'address', name: 'from', type: 'address' },
//       { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
//     ],
//     name: 'Staked',
//     type: 'event',
//   },
//   {
//     anonymous: false,
//     inputs: [
//       { indexed: true, internalType: 'address', name: 'from', type: 'address' },
//       { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
//     ],
//     name: 'Unstaked',
//     type: 'event',
//   },
//   {
//     inputs: [{ internalType: 'address', name: '', type: 'address' }],
//     name: 'accountInfos',
//     outputs: [
//       { internalType: 'uint256', name: 'balance', type: 'uint256' },
//       { internalType: 'uint256', name: 'lastStakedTimestamp', type: 'uint256' },
//       { internalType: 'uint256', name: 'lastUnstakedTimestamp', type: 'uint256' },
//     ],
//     stateMutability: 'view',
//     type: 'function',
//   },
//   {
//     inputs: [{ internalType: 'address', name: 'staker', type: 'address' }],
//     name: 'getAccountInfo',
//     outputs: [
//       { internalType: 'uint256', name: '', type: 'uint256' },
//       { internalType: 'uint256', name: '', type: 'uint256' },
//       { internalType: 'uint256', name: '', type: 'uint256' },
//     ],
//     stateMutability: 'view',
//     type: 'function',
//   },
//   {
//     inputs: [],
//     name: 'getStakedAmount',
//     outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
//     stateMutability: 'view',
//     type: 'function',
//   },
//   {
//     inputs: [],
//     name: 'safeLibrary',
//     outputs: [{ internalType: 'contract LessLibrary', name: '', type: 'address' }],
//     stateMutability: 'view',
//     type: 'function',
//   },
//   {
//     inputs: [],
//     name: 'safeToken',
//     outputs: [{ internalType: 'contract IERC20', name: '', type: 'address' }],
//     stateMutability: 'view',
//     type: 'function',
//   },
//   {
//     inputs: [{ internalType: 'address', name: '_newInfo', type: 'address' }],
//     name: 'setLibraryAddress',
//     outputs: [],
//     stateMutability: 'nonpayable',
//     type: 'function',
//   },
//   {
//     inputs: [{ internalType: 'uint256', name: '_amount', type: 'uint256' }],
//     name: 'stake',
//     outputs: [],
//     stateMutability: 'nonpayable',
//     type: 'function',
//   },
//   {
//     inputs: [{ internalType: 'uint256', name: '_amount', type: 'uint256' }],
//     name: 'unstake',
//     outputs: [],
//     stateMutability: 'nonpayable',
//     type: 'function',
//   },
// ];

// export default [
//   {
//     inputs: [
//       { internalType: 'address', name: '_safeToken', type: 'address' },
//       { internalType: 'address', name: '_safeLibrary', type: 'address' },
//     ],
//     stateMutability: 'nonpayable',
//     type: 'constructor',
//   },
//   {
//     anonymous: false,
//     inputs: [
//       { indexed: true, internalType: 'address', name: 'from', type: 'address' },
//       { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
//     ],
//     name: 'Staked',
//     type: 'event',
//   },
//   {
//     anonymous: false,
//     inputs: [
//       { indexed: true, internalType: 'address', name: 'from', type: 'address' },
//       { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
//     ],
//     name: 'Unstaked',
//     type: 'event',
//   },
//   {
//     inputs: [{ internalType: 'address', name: '', type: 'address' }],
//     name: 'accountInfos',
//     outputs: [
//       { internalType: 'uint256', name: 'balance', type: 'uint256' },
//       { internalType: 'uint256', name: 'lastStakedTimestamp', type: 'uint256' },
//       { internalType: 'uint256', name: 'lastUnstakedTimestamp', type: 'uint256' },
//     ],
//     stateMutability: 'view',
//     type: 'function',
//   },
//   {
//     inputs: [{ internalType: 'address', name: 'staker', type: 'address' }],
//     name: 'getAccountInfo',
//     outputs: [
//       { internalType: 'uint256', name: '', type: 'uint256' },
//       { internalType: 'uint256', name: '', type: 'uint256' },
//       { internalType: 'uint256', name: '', type: 'uint256' },
//     ],
//     stateMutability: 'view',
//     type: 'function',
//   },
//   {
//     inputs: [],
//     name: 'getStakedAmount',
//     outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
//     stateMutability: 'view',
//     type: 'function',
//   },
//   {
//     inputs: [],
//     name: 'safeLibrary',
//     outputs: [{ internalType: 'contract LessLibrary', name: '', type: 'address' }],
//     stateMutability: 'view',
//     type: 'function',
//   },
//   {
//     inputs: [],
//     name: 'safeToken',
//     outputs: [{ internalType: 'contract IERC20', name: '', type: 'address' }],
//     stateMutability: 'view',
//     type: 'function',
//   },
//   {
//     inputs: [{ internalType: 'address', name: '_newInfo', type: 'address' }],
//     name: 'setLibraryAddress',
//     outputs: [],
//     stateMutability: 'nonpayable',
//     type: 'function',
//   },
//   {
//     inputs: [{ internalType: 'uint256', name: '_amount', type: 'uint256' }],
//     name: 'stake',
//     outputs: [],
//     stateMutability: 'nonpayable',
//     type: 'function',
//   },
//   {
//     inputs: [{ internalType: 'uint256', name: '_amount', type: 'uint256' }],
//     name: 'unstake',
//     outputs: [],
//     stateMutability: 'nonpayable',
//     type: 'function',
//   },
// ];

export default [
  {
    inputs: [
      { internalType: 'address', name: '_safeToken', type: 'address' },
      { internalType: 'address', name: '_safeLibrary', type: 'address' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'from', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'Staked',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'from', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'Unstaked',
    type: 'event',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'accountInfos',
    outputs: [
      { internalType: 'uint256', name: 'balance', type: 'uint256' },
      { internalType: 'uint256', name: 'lastStakedTimestamp', type: 'uint256' },
      { internalType: 'uint256', name: 'lastUnstakedTimestamp', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'staker', type: 'address' }],
    name: 'getAccountInfo',
    outputs: [
      { internalType: 'uint256', name: '', type: 'uint256' },
      { internalType: 'uint256', name: '', type: 'uint256' },
      { internalType: 'uint256', name: '', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getStakedAmount',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'safeLibrary',
    outputs: [{ internalType: 'contract LessLibrary', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'safeToken',
    outputs: [{ internalType: 'contract IERC20', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_newInfo', type: 'address' }],
    name: 'setLibraryAddress',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_amount', type: 'uint256' }],
    name: 'stake',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_amount', type: 'uint256' }],
    name: 'unstake',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
