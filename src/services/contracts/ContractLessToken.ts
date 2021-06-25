import Web3 from 'web3';
import config from '../../config';

type TypeConstructorProps = {
  web3Provider: any;
  chainType: string;
};

type TypeStakeProps = {
  userAddress: string;
};

export default class ContractLessToken {
  public web3: any;
  public contractAddress: string;
  public contractAddressStaking: string;
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
    this.contractAddressStaking = addressesOfNetType[chainType].Staking;
    this.contractAbi = abisOfNetType[chainType][this.contractName];
  }

  public decimals = async () => {
    try {
      // console.log('ContractPresalePublicService getInfo:', this.contractAbi, this.contractAddress)
      const contract = new this.web3.eth.Contract(this.contractAbi, this.contractAddress);
      const result = await contract.methods.decimals().call();
      return result;
    } catch (e) {
      console.error('ContractLessToken decimals:', e);
      return null;
    }
  };

  public balanceOf = async ({ userAddress }: TypeStakeProps) => {
    try {
      // console.log('ContractPresalePublicService getInfo:', this.contractAbi, this.contractAddress)
      const contract = new this.web3.eth.Contract(this.contractAbi, this.contractAddress);
      const result = await contract.methods.balanceOf(userAddress).call();
      return result;
    } catch (e) {
      console.error('ContractLessToken balanceOf:', e);
      return null;
    }
  };

  public allowance = async ({ userAddress }: TypeStakeProps) => {
    try {
      // console.log('ContractPresalePublicService getInfo:', this.contractAbi, this.contractAddress)
      const contract = new this.web3.eth.Contract(this.contractAbi, this.contractAddress);
      const result = await contract.methods.allowance(userAddress, this.contractAddressStaking).call();
      return result;
    } catch (e) {
      console.error('ContractLessToken decimals:', e);
      return null;
    }
  };

  public approve = async ({ userAddress, amount }: any) => {
    try {
      // console.log('ContractPresalePublicService getInfo:', this.contractAbi, this.contractAddress)
      const contract = new this.web3.eth.Contract(this.contractAbi, this.contractAddress);
      const result = await contract.methods.approve(this.contractAddressStaking, amount).send({ from: userAddress });
      return result;
    } catch (e) {
      console.error('ContractLessToken decimals:', e);
      return null;
    }
  };
}
