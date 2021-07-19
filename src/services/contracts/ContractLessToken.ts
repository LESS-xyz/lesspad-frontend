import Web3 from 'web3';

import config from '../../config';

type TypeConstructorProps = {
  web3Provider: any;
  chainType: string;
};

type TypeStakeProps = {
  userAddress: string;
  spender: string;
};

export default class ContractLessToken {
  public web3: any;

  public contractAddress: string;

  public contractAbi: any;

  public contractName: string;

  constructor(props: TypeConstructorProps) {
    const { web3Provider, chainType } = props;
    const { addresses, isMainnetOrTestnet, abis }: any = config;
    const addressesOfNetType = addresses[isMainnetOrTestnet];
    const abisOfNetType = abis[isMainnetOrTestnet];
    this.web3 = new Web3(web3Provider);
    this.contractName = 'LessToken';
    this.contractAddress = addressesOfNetType[chainType][this.contractName];
    this.contractAbi = abisOfNetType[chainType][this.contractName];
  }

  public decimals = async (): Promise<number | null> => {
    try {
      const contract = new this.web3.eth.Contract(this.contractAbi, this.contractAddress);
      return await contract.methods.decimals().call();
    } catch (e) {
      console.error('ContractLessToken decimals:', e);
      return null;
    }
  };

  public totalSupply = async (): Promise<any> => {
    try {
      // console.log('ContractPresalePublicService getInfo:', this.contractAbi, this.contractAddress)
      const contract = new this.web3.eth.Contract(this.contractAbi, this.contractAddress);
      return await contract.methods.totalSupply().call();
    } catch (e) {
      console.error('ContractLessToken totalSupply:', e);
      return null;
    }
  };

  public balanceOf = async ({ userAddress }: TypeStakeProps): Promise<any> => {
    try {
      // console.log('ContractPresalePublicService getInfo:', this.contractAbi, this.contractAddress)
      const contract = new this.web3.eth.Contract(this.contractAbi, this.contractAddress);
      return await contract.methods.balanceOf(userAddress).call();
    } catch (e) {
      console.error('ContractLessToken balanceOf:', e);
      return null;
    }
  };

  public allowance = async ({ userAddress, spender }: TypeStakeProps): Promise<any> => {
    try {
      // console.log('ContractPresalePublicService getInfo:', this.contractAbi, this.contractAddress)
      const contract = new this.web3.eth.Contract(this.contractAbi, this.contractAddress);
      return await contract.methods.allowance(userAddress, spender).call();
    } catch (e) {
      console.error('ContractLessToken allowance:', e);
      return null;
    }
  };

  public approve = async ({ userAddress, spender, amount }: any): Promise<any> => {
    try {
      // console.log('ContractPresalePublicService getInfo:', this.contractAbi, this.contractAddress)
      const contract = new this.web3.eth.Contract(this.contractAbi, this.contractAddress);
      return await contract.methods.approve(spender, amount).send({ from: userAddress });
    } catch (e) {
      console.error('ContractLessToken approve:', e);
      return null;
    }
  };
}
