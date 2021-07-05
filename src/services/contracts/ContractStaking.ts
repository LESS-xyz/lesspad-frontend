import Web3 from 'web3';

import config from '../../config';

type TypeConstructorProps = {
  web3Provider: any;
  chainType: string;
};

type TypeGetStakedBalanceProps = {
  userAddress: string;
};

type TypeStakeProps = {
  userAddress: string;
  amount: string;
};

export default class ContractStakingService {
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
    this.contractName = 'Staking';
    this.contractAddress = addressesOfNetType[chainType][this.contractName];
    this.contractAbi = abisOfNetType[chainType][this.contractName];
  }

  public getStakedBalance = async ({ userAddress }: TypeGetStakedBalanceProps) => {
    try {
      // console.log('ContractPresalePublicService getInfo:', this.contractAbi, this.contractAddress)
      const contract = new this.web3.eth.Contract(this.contractAbi, this.contractAddress);
      const result = await contract.methods.accountInfos(userAddress).call();
      return result.balance;
    } catch (e) {
      console.error('ContractStakingService getStakingBalance:', e);
      return null;
    }
  };

  public stake = async ({ amount, userAddress }: TypeStakeProps) => {
    try {
      // console.log('ContractPresalePublicService getInfo:', this.contractAbi, this.contractAddress)
      const contract = new this.web3.eth.Contract(this.contractAbi, this.contractAddress);
      const result = await contract.methods.stake(amount).send({ from: userAddress });
      return result;
    } catch (e) {
      console.error('ContractStakingService stake:', e);
      return null;
    }
  };

  public unstake = async ({ amount, userAddress }: TypeStakeProps) => {
    try {
      // console.log('ContractPresalePublicService getInfo:', this.contractAbi, this.contractAddress)
      const contract = new this.web3.eth.Contract(this.contractAbi, this.contractAddress);
      const result = await contract.methods.unstake(amount).send({ from: userAddress });
      return result;
    } catch (e) {
      console.error('ContractStakingService stake:', e);
      return null;
    }
  };
}
