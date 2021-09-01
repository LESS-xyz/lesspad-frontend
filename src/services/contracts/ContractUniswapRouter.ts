import Web3 from 'web3';

import config from '../../config';

type TypeConstructorProps = {
  web3Provider: any;
  chainType: string;
  contractAddress: string;
};

export default class ContractUniswapRouterService {
  public web3: any;

  public contractAddress: any;

  public contractAbi: any;

  public contractName: any;

  constructor(props: TypeConstructorProps) {
    const { web3Provider, chainType, contractAddress } = props;
    const { IS_MAINNET_OR_TESTNET, abis }: any = config;
    const abisOfNetType = abis[IS_MAINNET_OR_TESTNET];
    this.web3 = new Web3(web3Provider);
    this.contractName = 'UniswapRouter';
    this.contractAddress = contractAddress;
    this.contractAbi = abisOfNetType[chainType][this.contractName];
  }

  public getWETHAddress = async () => {
    try {
      const contract = new this.web3.eth.Contract(this.contractAbi, this.contractAddress);
      const result = await contract.methods.WETH().call();
      return result;
    } catch (e) {
      console.error('ContractLessLibraryService getWETHAddress:', e);
      return null;
    }
  };
}
