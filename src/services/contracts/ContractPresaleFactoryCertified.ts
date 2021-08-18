// import BigNumber from 'bignumber.js/bignumber';
// import { ethers } from 'ethers';
import Web3 from 'web3';

import config from '../../config';

type TypeConstructorProps = {
  web3Provider: any;
  chainType: string;
};

type TypeGetInfoProps = {
  userAddress: string;
  presaleInfo: any;
  presalePancakeSwapInfo: any;
  presaleStringInfo: any;
  certifiedAddition: any;
  usdtToEthFee: any;
};

export default class ContractPresaleFactoryCertifiedService {
  public web3: any;

  public web3Provider: any;

  public contractAddress: any;

  public contractAbi: any;

  public contractName: any;

  constructor(props: TypeConstructorProps) {
    const { web3Provider, chainType } = props;
    const { addresses, isMainnetOrTestnet, abis }: any = config;
    const addressesOfNetType = addresses[isMainnetOrTestnet];
    const abisOfNetType = abis[isMainnetOrTestnet];
    this.contractName = 'PresaleFactoryCertified';
    this.web3 = new Web3(web3Provider);
    this.web3Provider = web3Provider;
    this.contractAddress = addressesOfNetType[chainType][this.contractName];
    this.contractAbi = abisOfNetType[chainType][this.contractName];
  }

  public createPresaleCertified = (props: TypeGetInfoProps) => {
    try {
      const {
        userAddress,
        presaleInfo,
        presalePancakeSwapInfo,
        presaleStringInfo,
        certifiedAddition,
        usdtToEthFee,
      } = props;
      const presaleStringInfoFormatted = presaleStringInfo.map((item: string, ii: number) => {
        const hex = this.web3.utils.asciiToHex(item);
        // console.log('hex:', hex, hex.length);
        const newLength = 66 - hex.length;
        if (newLength <= 0) return hex;
        const zeros = new Array(66 - hex.length).fill('0').join('');
        if (ii <= 4) return hex + zeros;
        return item;
      });
      console.log('ContractPresaleFactoryCertified createPresaleCertified:', {
        props,
        presaleStringInfoFormatted,
      });
      const contract = new this.web3.eth.Contract(this.contractAbi, this.contractAddress);
      return contract.methods
        .createPresaleCertified(
          presaleInfo,
          certifiedAddition,
          presalePancakeSwapInfo,
          presaleStringInfoFormatted,
        )
        .send({
          from: userAddress,
          value: usdtToEthFee,
        });
      // const provider = new ethers.providers.JsonRpcProvider(this.web3Provider).getSigner(
      //   userAddress,
      // );
      // const contract = new ethers.Contract(this.contractAddress, this.contractAbi, provider);
      // return contract.createPresaleCertified(
      //   presaleInfo,
      //   certifiedAddition,
      //   presalePancakeSwapInfo,
      //   presaleStringInfoFormatted,
      //   {
      //     from: userAddress,
      //     value: usdtToEthFee,
      //   },
      // );
    } catch (e) {
      console.error('ContractPresaleFactoryCertified createPresaleCertified:', e);
      return null;
    }
  };
}
