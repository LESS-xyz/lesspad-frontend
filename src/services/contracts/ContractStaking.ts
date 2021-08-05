import { BigNumber as BN } from 'bignumber.js/bignumber';
import Web3 from 'web3';

import config from '../../config';
import { convertFromWei } from '../../utils/ethereum';

import ContractLessTokenService from './ContractLessToken';
import ContractLpTokenService from './ContractLPToken';

type TypeConstructorProps = {
  web3Provider: any;
  chainType: string;
  userAddress: string;
};

type TypeGetStakedBalanceProps = {
  userAddress: string;
};

type TypeStakesProps = {
  stakeId: string;
};

type TypeGetLessRewardsOnStakeProps = {
  stakeId: string;
};

type TypeGetUserStakeIdsProps = {
  userAddress: string;
};

type TypeGetStakeListProps = {
  userAddress: string;
  index: number;
};

type TypeStakeProps = {
  userAddress: string;
  lpAmount: number;
  lessAmount: number;
};

type TypeUnstakeProps = {
  stakeId: string;
};

export default class ContractStakingService {
  public web3: any;

  public contractAddress: any;

  public userAddress: string;

  public contractAbi: any;

  public contract: any;

  public contractName: any;

  public ContractLessToken: any;

  public ContractLpToken: any;

  constructor(props: TypeConstructorProps) {
    const { web3Provider, chainType, userAddress } = props;
    const { addresses, isMainnetOrTestnet, abis }: any = config;
    const addressesOfNetType = addresses[isMainnetOrTestnet];
    const abisOfNetType = abis[isMainnetOrTestnet];
    this.web3 = new Web3(web3Provider);
    this.contractName = 'Staking';
    this.contractAddress = addressesOfNetType[chainType][this.contractName];
    this.contractAbi = abisOfNetType[chainType][this.contractName];
    this.userAddress = userAddress;
    this.contract = new this.web3.eth.Contract(this.contractAbi, this.contractAddress);
    this.ContractLessToken = new ContractLessTokenService({ web3Provider, chainType });
    this.ContractLpToken = new ContractLpTokenService({ web3Provider, chainType });
  }

  public getMinStakeTime = async (): Promise<any> => {
    try {
      const result = await this.contract.methods.minStakeTime().call();
      return +result * 1000;
    } catch (e) {
      console.error('ContractStakingService getMinStakeTime:', e);
      return null;
    }
  };

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

  // // get stake balance of user by address, also time of last stake and lat unstake
  // public getStakedInfo = async (props: TypeGetStakeListProps): Promise<any> => {
  //   try {
  //     const { userAddress } = props;
  //     const contract = new this.web3.eth.Contract(this.contractAbi, this.contractAddress);
  //     const result = await contract.methods.getStakedInfo(userAddress).call();
  //     console.log('ContractStakingService getStakedInfo:', result);
  //     const { 0: stakedBalance, 1: lastStakeTime, 2: lastUnstakeTime } = result;
  //     return { stakedBalance, lastStakeTime, lastUnstakeTime };
  //   } catch (e) {
  //     console.error('ContractStakingService getStakedInfo:', e);
  //     return null;
  //   }
  // };

  // get stake balance of user by address, also time of last stake and lat unstake
  public getUserTier = async (props: TypeGetStakeListProps): Promise<any> => {
    try {
      const { userAddress } = props;
      const contract = new this.web3.eth.Contract(this.contractAbi, this.contractAddress);
      const result = await contract.methods.getUserTier(userAddress).call();
      console.log('ContractStakingService getUserTier:', result);
      return result;
    } catch (e) {
      console.error('ContractStakingService getUserTier:', e);
      return null;
    }
  };

  // get ids of all user's stakes
  public getUserStakeIds = async (props: TypeGetUserStakeIdsProps): Promise<any> => {
    try {
      const { userAddress } = props;
      const result = await this.contract.methods.getUserStakeIds(userAddress).call();
      return result;
    } catch (e) {
      console.error('ContractStakingService getUserStakeIds:', e);
      return null;
    }
  };

  // get stake info by it's id
  public stakes = async (props: TypeStakesProps): Promise<any> => {
    try {
      const { stakeId } = props;
      const stake = await this.contract.methods.stakes(stakeId).call();
      const { stakedLess, stakedLp, startTime } = stake;
      // format
      const decimalsLess = await this.ContractLessToken.decimals();
      const stakedLessInEth = convertFromWei(stakedLess, decimalsLess);
      const decimalsLp = await this.ContractLpToken.decimals();
      const stakedLpInEth = convertFromWei(stakedLp, decimalsLp);
      const startTimeInMs = startTime * 1000;
      // result
      return { stakedLess: stakedLessInEth, stakedLp: stakedLpInEth, startTime: startTimeInMs };
    } catch (e) {
      console.error('ContractStakingService stakes:', e);
      return null;
    }
  };

  // todo: remove
  // get stake of user by address and index
  public getStakeList = async (props: TypeGetStakeListProps): Promise<any> => {
    try {
      const { userAddress, index } = props;
      const contract = new this.web3.eth.Contract(this.contractAbi, this.contractAddress);
      return await contract.methods.stakeList(userAddress, index).call();
    } catch (e) {
      console.error('ContractStakingService getStakeList:', e);
      return null;
    }
  };

  public getLessRewards = async (props: TypeGetStakedBalanceProps): Promise<any> => {
    try {
      const { userAddress } = props;
      const userStakeIds = await this.getUserStakeIds({ userAddress });
      let fullReward = new BN(0);
      for (let i = 0; i < userStakeIds.length; i += 1) {
        const stakeId = userStakeIds[i];
        const reward = await this.getLessRewardOnStake({ stakeId });
        fullReward = fullReward.plus(new BN(reward));
      }
      return fullReward.toString(10);
    } catch (e) {
      console.error('ContractStakingService getLessRewards:', e);
      return null;
    }
  };

  public getLpRewards = async (props: TypeGetStakedBalanceProps): Promise<any> => {
    try {
      const { userAddress } = props;
      const userStakeIds = await this.getUserStakeIds({ userAddress });
      let fullReward = new BN(0);
      for (let i = 0; i < userStakeIds.length; i += 1) {
        const stakeId = userStakeIds[i];
        const reward = await this.getLpRewardOnStake({ stakeId });
        fullReward = fullReward.plus(new BN(reward));
      }
      return fullReward.toString(10);
    } catch (e) {
      console.error('ContractStakingService getLpRewards:', e);
      return null;
    }
  };

  public getLessRewardOnStake = async (props: TypeGetLessRewardsOnStakeProps): Promise<any> => {
    try {
      const { stakeId } = props;
      const rewards = await this.contract.methods.getLessRewradsAmount(stakeId).call();
      const decimals = await this.ContractLessToken.decimals();
      const pow = new BN(10).pow(new BN(decimals));
      const result = new BN(rewards).div(pow).toString(10);
      return result;
    } catch (e) {
      console.error('ContractStakingService getLessRewardOnStake:', e);
      return null;
    }
  };

  public getLpRewardOnStake = async (props: TypeGetLessRewardsOnStakeProps): Promise<any> => {
    try {
      const { stakeId } = props;
      const rewards = await this.contract.methods.getLpRewradsAmount(stakeId).call();
      const decimals = await this.ContractLpToken.decimals();
      const pow = new BN(10).pow(new BN(decimals));
      const result = new BN(rewards).div(pow).toString(10);
      return result;
    } catch (e) {
      console.error('ContractStakingService getLpRewardOnStake:', e);
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

  // public unstake = async ({
  //   userAddress,
  //   lpAmount,
  //   lessAmount,
  //   lpRewards,
  //   lessRewards,
  // }: TypeUnstakeProps): Promise<any> => {
  //   try {
  //     const contract = new this.web3.eth.Contract(this.contractAbi, this.contractAddress);
  //     let lpAmountCounter = lpAmount;
  //     let lessAmountCounter = lessAmount;
  //     let lpRewardsCounter = lpRewards;
  //     let lessRewardsCounter = lessRewards;
  //     const amountOfUsersStakes = await this.getAmountOfUsersStakes({ userAddress });
  //     for (let i = 0; i < amountOfUsersStakes; i += 1) {
  //       const stake = await this.getStakeList({ userAddress, index: i });
  //       let { stakedLess, stakedLp, lpEarned, lessEarned } = stake;
  //       const { stakeId } = stake;
  //       console.log('ContractStakingService unstake', { i, stakedLess, stakedLp });
  //       // next iterate, if this stake was unstaked
  //       if (stakedLp + stakedLess + lpEarned + lessEarned === 0) continue;
  //       // amounts shouldnt be less than 0
  //       if (lpAmountCounter <= 0) stakedLp = 0;
  //       if (lessAmountCounter <= 0) stakedLess = 0;
  //       if (lpRewardsCounter <= 0) lpEarned = 0;
  //       if (lessRewardsCounter <= 0) lessEarned = 0;
  //       if (stakedLp + stakedLess + lpEarned + lessEarned === 0) return null;
  //       // if amount is less or equal to stake
  //       if (lpAmountCounter <= stakedLp) stakedLp = lpAmountCounter;
  //       if (lessAmountCounter <= stakedLess) stakedLess = lessAmountCounter;
  //       if (lpRewardsCounter <= lpEarned) lpEarned = lpRewardsCounter;
  //       if (lessRewardsCounter <= lessEarned) lessEarned = lessRewardsCounter;
  //       try {
  //         const result = await contract.methods
  //           .unstake(stakedLp, stakedLess, lpRewards, lessRewards, stakeId)
  //           .send({ from: userAddress });
  //         console.log('ContractStakingService unstake', result);
  //         lpAmountCounter -= stakedLp;
  //         lessAmountCounter -= stakedLess;
  //         lpRewardsCounter -= lpEarned;
  //         lessRewardsCounter -= lessEarned;
  //       } catch (e) {
  //         console.error(e);
  //       }
  //     }
  //     return null;
  //   } catch (e) {
  //     console.error('ContractStakingService stake:', e);
  //     return null;
  //   }
  // };

  public unstake = async (props: TypeUnstakeProps): Promise<any> => {
    try {
      const { stakeId } = props;
      return await this.contract.methods.unstake(stakeId).send({ from: this.userAddress });
    } catch (e) {
      console.error('ContractStakingService unstake:', e);
      return null;
    }
  };
}
