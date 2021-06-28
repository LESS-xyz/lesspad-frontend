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
};

export default class ContractPresaleFactoryService {
  public web3: any;
  public contractAddress: any;
  public contractAbi: any;
  public contractName: any;

  constructor(props: TypeConstructorProps) {
    const { web3Provider, chainType } = props;
    const { addresses, isMainnetOrTestnet, abis }: any = config;
    const addressesOfNetType = addresses[isMainnetOrTestnet];
    const abisOfNetType = abis[isMainnetOrTestnet];
    this.web3 = new Web3(web3Provider);
    this.contractName = 'PresaleFactory';
    this.contractAddress = addressesOfNetType[chainType][this.contractName];
    this.contractAbi = abisOfNetType[chainType][this.contractName];
  }

  public createPresalePublic = async (props: TypeGetInfoProps) => {
    try {
      const { userAddress, presaleInfo, presalePancakeSwapInfo, presaleStringInfo } = props;
      const valueInWei = this.web3.utils.toWei('0.05', 'ether');
      const presaleStringInfoFormatted = presaleStringInfo.map((item: string, ii: number) => {
        const hex = this.web3.utils.toHex(item);
        const zeros = new Array(66 - hex.length).fill('0').join('');
        if (ii <= 4) return hex + zeros;
        return item;
      });
      console.log('ContractPresaleFactoryService createPresalePublic:', { valueInWei, userAddress, presaleStringInfoFormatted });
      const contract = new this.web3.eth.Contract(this.contractAbi, this.contractAddress);
      const result = await contract.methods.createPresalePublic(
        presaleInfo,
        presalePancakeSwapInfo,
        presaleStringInfoFormatted
      ).send({
        from: userAddress,
        value: valueInWei
      });
      return result;
    } catch (e) {
      console.error('ContractPresaleFactoryService createPresalePublic:', e);
      return null;
    }
  };
}
