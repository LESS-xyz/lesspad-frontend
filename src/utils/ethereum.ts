import { BigNumber as BN } from 'bignumber.js/bignumber';

export const convertFromWei = (amount: string | number, decimals: string | number) => {
  try {
    const tenBN = new BN(10);
    const decimalsBN = new BN(decimals);
    const result = new BN(amount).div(tenBN.pow(decimalsBN)).toFixed(3);
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
    const result = new BN(amount).multipliedBy(tenBN.pow(decimalsBN)).toFixed(3);
    return result;
  } catch (e) {
    console.error(e);
    return null;
  }
};
