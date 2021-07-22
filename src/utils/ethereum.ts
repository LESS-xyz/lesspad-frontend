import web3 from 'web3';

const { BN }: any = web3.utils;

export const convertFromWei = (amount: string | number, decimals: string | number) => {
  try {
    const tenBN = web3.utils.toBN(10);
    const decimalsBN = web3.utils.toBN(decimals);
    const result = new BN(amount).div(tenBN.pow(decimalsBN)).toString(10);
    return result;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const convertToWei = (amount: string | number, decimals: string | number) => {
  try {
    const tenBN = web3.utils.toBN(10);
    const decimalsBN = web3.utils.toBN(decimals);
    const result = new BN(amount).mul(tenBN.pow(decimalsBN)).toString(10);
    return result;
  } catch (e) {
    console.error(e);
    return null;
  }
};
