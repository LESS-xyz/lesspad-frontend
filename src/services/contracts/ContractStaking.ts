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
  lpAmount: number;
  lessAmount: number;
};

type TypeUnstakeProps = {
  userAddress: string;
  lpAmount: number;
  lessAmount: number;
  lpRewards: number;
  lessRewards: number;
  stakeId: number;
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

  // get balance of staked Less
  public getLessBalance = async ({ userAddress }: TypeGetStakedBalanceProps): Promise<any> => {
    try {
      const contract = new this.web3.eth.Contract(this.contractAbi, this.contractAddress);
      return await contract.methods.getLessBalanceByAddress(userAddress).call();
    } catch (e) {
      console.error('ContractStakingService getLessBalance:', e);
      return null;
    }
  };

  // get balance of staked Less LP
  public getLPBalance = async ({ userAddress }: TypeGetStakedBalanceProps): Promise<any> => {
    try {
      const contract = new this.web3.eth.Contract(this.contractAbi, this.contractAddress);
      return await contract.methods.getLpBalanceByAddress(userAddress).call();
    } catch (e) {
      console.error('ContractStakingService getLPBalance:', e);
      return null;
    }
  };

  // public getTotalLessRewards = async ({ userAddress })

  public stakeTokens = async ({
    userAddress,
    lpAmount,
    lessAmount,
  }: TypeStakeProps): Promise<any> => {
    try {
      const contract = new this.web3.eth.Contract(this.contractAbi, this.contractAddress);
      return await contract.methods.stake(lpAmount, lessAmount).send({ from: userAddress });
    } catch (e) {
      console.error('ContractStakingService stake:', e);
      return null;
    }
  };

  public unstakeTokens = async ({
    userAddress,
    lpAmount,
    lessAmount,
    lpRewards,
    lessRewards,
    stakeId,
  }: TypeUnstakeProps): Promise<any> => {
    try {
      const contract = new this.web3.eth.Contract(this.contractAbi, this.contractAddress);
      return await contract.methods
        .unstake(lpAmount, lessAmount, lpRewards, lessRewards, stakeId)
        .send({ from: userAddress });
    } catch (e) {
      console.error('ContractStakingService stake:', e);
      return null;
    }
  };
}
