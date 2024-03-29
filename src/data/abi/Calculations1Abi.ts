export default [
  {
    inputs: [
      { internalType: 'uint256', name: '_hardCap', type: 'uint256' },
      { internalType: 'uint256', name: '_tokenPrice', type: 'uint256' },
      { internalType: 'uint256', name: '_liqPrice', type: 'uint256' },
      { internalType: 'uint256', name: '_liqPerc', type: 'uint256' },
      { internalType: 'uint8', name: '_decimalsToken', type: 'uint8' },
      { internalType: 'uint8', name: '_decimalsNativeToken', type: 'uint8' },
    ],
    name: 'countAmountOfTokens',
    outputs: [{ internalType: 'uint256[]', name: '', type: 'uint256[]' }],
    stateMutability: 'pure',
    type: 'function',
  },
];
