export default [
  {
    inputs: [
      {
        internalType: 'contract IUniswapV2Pair',
        name: '_lp',
        type: 'address',
      },
      {
        internalType: 'contract IERC20',
        name: '_less',
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
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'staker',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'stakeId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'startTime',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'stakedLp',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'stakedLess',
        type: 'uint256',
      },
    ],
    name: 'Staked',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'staker',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'stakeId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'unstakeTime',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'unstakedLp',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'unstakedLess',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'lpRewards',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'lessRewards',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'isUnstakedEarlier',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'isUnstakedFully',
            type: 'bool',
          },
        ],
        indexed: false,
        internalType: 'struct LessStaking.Unstake',
        name: '',
        type: 'tuple',
      },
    ],
    name: 'Unstaked',
    type: 'event',
  },
  {
    inputs: [],
    name: 'SEC_IN_DAY',
    outputs: [
      {
        internalType: 'uint24',
        name: '',
        type: 'uint24',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'allLess',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'allLp',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'staker',
        type: 'address',
      },
    ],
    name: 'getLessBalanceByAddress',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'staker',
        type: 'address',
      },
    ],
    name: 'getLpBalanceByAddress',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
    ],
    name: 'getLpInLess',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getOverallBalanceInLess',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'staker',
        type: 'address',
      },
    ],
    name: 'getOverallBalanceInLessByAddress',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getOverallLP',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getOverallLess',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'lessPerLp',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'lessToken',
    outputs: [
      {
        internalType: 'contract IERC20',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'lpToken',
    outputs: [
      {
        internalType: 'contract IUniswapV2Pair',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'minDaysStake',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
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
    name: 'penaltyBurned',
    outputs: [
      {
        internalType: 'uint16',
        name: '',
        type: 'uint16',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'penaltyDistributed',
    outputs: [
      {
        internalType: 'uint16',
        name: '',
        type: 'uint16',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'setLessInLP',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_minDaysStake',
        type: 'uint256',
      },
    ],
    name: 'setMinDaysStake',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint16',
        name: 'distributed',
        type: 'uint16',
      },
      {
        internalType: 'uint16',
        name: 'burned',
        type: 'uint16',
      },
    ],
    name: 'setPenalty',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'lpAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'lessAmount',
        type: 'uint256',
      },
    ],
    name: 'stake',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'stakeIdLast',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'stakeList',
    outputs: [
      {
        internalType: 'uint256',
        name: 'stakeId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'startTime',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'stakedLp',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'stakedLess',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'lpRewardsWithdrawn',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'lessRewardsWithdrawn',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalLessRewards',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalLpRewards',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'lpAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'lessAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'lpRewards',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'lessRewards',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_stakeId',
        type: 'uint256',
      },
    ],
    name: 'unstake',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'lpAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'lessAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'lpRewards',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'lessRewards',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_stakeId',
        type: 'uint256',
      },
    ],
    name: 'unstakeWithoutPenalty',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
