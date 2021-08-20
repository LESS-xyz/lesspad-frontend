import { BigNumber as BN } from 'bignumber.js/bignumber';
import web3 from 'web3';

export const convertFromWei = (amount: string | number, decimals: string | number) => {
  try {
    const tenBN = new BN(10);
    const decimalsBN = new BN(decimals);
    const result = new BN(amount).div(tenBN.pow(decimalsBN)).toString(10);
    return result;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const convertToWei = (amount: string | number, decimals: string | number) => {
  try {
    const tenBN = new BN(10);
    const decimalsBN = new BN(decimals);
    const result = new BN(amount).multipliedBy(tenBN.pow(decimalsBN)).toString(10);
    return result;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const convertHexToString = (hex: string) => {
  const removedZeros = hex.replace(/00/g, '');
  return web3.utils.toAscii(removedZeros);
};
