import Web3 from 'web3';

import config from '../../config';

const { BN }: any = Web3.utils;

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
  public getLessBalanceByAddress = async (props: TypeGetStakedBalanceProps): Promise<any> => {
    try {
      const { userAddress } = props;
      const contract = new this.web3.eth.Contract(this.contractAbi, this.contractAddress);
      return await contract.methods.getLessBalanceByAddress(userAddress).call();
    } catch (e) {
      console.error('ContractStakingService getLessBalance:', e);
      return null;
    }
  };

  // get balance of staked Less LP
  public getLpBalanceByAddress = async (props: TypeGetStakedBalanceProps): Promise<any> => {
    try {
      const { userAddress } = props;
      const contract = new this.web3.eth.Contract(this.contractAbi, this.contractAddress);
      return await contract.methods.getLpBalanceByAddress(userAddress).call();
    } catch (e) {
      console.error('ContractStakingService getLPBalance:', e);
      return null;
    }
  };

  // how many stakes user has done
  public getAmountOfUsersStakes = async (props: TypeGetStakedBalanceProps): Promise<any> => {
    try {
      const { userAddress } = props;
      const contract = new this.web3.eth.Contract(this.contractAbi, this.contractAddress);
      return await contract.methods.getAmountOfUsersStakes(userAddress).call();
    } catch (e) {
      console.error('ContractStakingService getAmountOfUsersStakes:', e);
      return null;
    }
  };

  public getLessRewards = async (props: TypeGetStakedBalanceProps): Promise<any> => {
    try {
      const { userAddress } = props;
      const stakedLess = await this.getLessBalanceByAddress({ userAddress });
      const contract = new this.web3.eth.Contract(this.contractAbi, this.contractAddress);
      const totalLessRewards = await contract.methods.totalLessRewards().call();
      const totalLessRewardsBN = new BN(totalLessRewards);
      const allLess = await contract.methods.allLess().call();
      const allLessBN = new BN(allLess);
      const result = new BN(stakedLess).mul(totalLessRewardsBN).div(allLessBN).toString(10);
      return result;
    } catch (e) {
      console.error('ContractStakingService getLessRewards:', e);
      return null;
    }
  };

  public getLpRewards = async (props: TypeGetStakedBalanceProps): Promise<any> => {
    try {
      const { userAddress } = props;
      const stakedLp = await this.getLpBalanceByAddress({ userAddress });
      const contract = new this.web3.eth.Contract(this.contractAbi, this.contractAddress);
      const totalLpRewards = await contract.methods.totalLpRewards().call();
      const totalLpRewardsBN = new BN(totalLpRewards);
      const allLp = await contract.methods.allLp().call();
      const allLpBN = new BN(allLp);
      const result = new BN(stakedLp).mul(totalLpRewardsBN).div(allLpBN).toString(10);
      return result;
    } catch (e) {
      console.error('ContractStakingService getLpRewards:', e);
      return null;
    }
  };

  public stake = async ({ userAddress, lpAmount, lessAmount }: TypeStakeProps): Promise<any> => {
    try {
      const contract = new this.web3.eth.Contract(this.contractAbi, this.contractAddress);
      return await contract.methods.stake(lpAmount, lessAmount).send({ from: userAddress });
    } catch (e) {
      console.error('ContractStakingService stake:', e);
      return null;
    }
  };

  public unstake = async ({
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
