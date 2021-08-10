import Web3 from 'web3';

import config from '../../config';

type TypeConstructorProps = {
  web3Provider: any;
  chainType: string;
};

export default class ContractCalculationsService {
  public web3: any;

  public contractAbi: any;

  public contractName: string;

  public contractAddress: string;

  public contractLessLibraryAddress: string;

  public contract: any;

  constructor(props: TypeConstructorProps) {
    this.contractName = 'Calculations';

    const { web3Provider, chainType } = props;
    this.web3 = new Web3(web3Provider);

    const { isMainnetOrTestnet, abis, addresses }: any = config;
    const abisOfNetType = abis[isMainnetOrTestnet];
    const addressesOfNetType = addresses[isMainnetOrTestnet];
    this.contractAbi = abisOfNetType[chainType][this.contractName];
    this.contractAddress = addressesOfNetType[chainType][this.contractName];
    this.contract = new this.web3.eth.Contract(this.contractAbi, this.contractAddress);
    this.contractLessLibraryAddress = addressesOfNetType[chainType].LessLibrary;
  }

  public usdtToEthFee = async (): Promise<number | null> => {
    try {
      return await this.contract.methods.usdtToEthFee(this.contractLessLibraryAddress).call();
    } catch (e) {
      console.error('ContractCalculationsService usdtToEthFee:', e);
      return null;
    }
  };
}
