// import BigNumber from 'bignumber.js/bignumber';
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
  usdtToEthFee: string;
};

export default class ContractPresaleFactoryService {
  public web3: any;

  public contractAddress: any;

  public contractAbi: any;

  public contractName: any;

  constructor(props: TypeConstructorProps) {
    const { web3Provider, chainType } = props;
    const { addresses, IS_MAINNET_OR_TESTNET, abis }: any = config;
    const addressesOfNetType = addresses[IS_MAINNET_OR_TESTNET];
    const abisOfNetType = abis[IS_MAINNET_OR_TESTNET];
    this.web3 = new Web3(web3Provider);
    this.contractName = 'PresaleFactory';
    this.contractAddress = addressesOfNetType[chainType][this.contractName];
    this.contractAbi = abisOfNetType[chainType][this.contractName];
  }

  public createPresalePublic = (props: TypeGetInfoProps) => {
    try {
      const {
        userAddress,
        presaleInfo,
        presalePancakeSwapInfo,
        presaleStringInfo,
        usdtToEthFee,
      } = props;
      const presaleStringInfoFormatted = presaleStringInfo.map((item: string, ii: number) => {
        if (ii > 4) return item;
        const hex = this.web3.utils.asciiToHex(item);
        console.log('hex:', hex, hex.length);
        const newLength = 66 - hex.length;
        if (newLength <= 0) return hex;
        const zeros = new Array(66 - hex.length).fill('0').join('');
        return hex + zeros;
      });
      console.log('ContractPresaleFactoryService createPresalePublic:', {
        usdtToEthFee,
        userAddress,
        presaleStringInfoFormatted,
      });
      const contract = new this.web3.eth.Contract(this.contractAbi, this.contractAddress);
      return contract.methods
        .createPresale(presaleInfo, presalePancakeSwapInfo, presaleStringInfoFormatted)
        .send({
          from: userAddress,
          value: usdtToEthFee,
        });
    } catch (e) {
      console.error('ContractPresaleFactoryService createPresalePublic:', e);
      return null;
    }
  };
}
