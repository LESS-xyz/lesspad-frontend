import { BigNumber as BN } from 'bignumber.js/bignumber';
import Web3 from 'web3';

import config from '../../config';
import ERC20Abi from '../../data/abi/ERC20Abi';
import { convertHexToString, convertToWei } from '../../utils/ethereum';

type TypeConstructorProps = {
  web3Provider: any;
  chainType: string;
};

type TypeGetInfoProps = {
  contractAddress: string;
};

type TypeClaimTokensProps = {
  contractAddress: string;
  userAddress: string;
};

type TypeVoteProps = {
  userAddress: string;
  contractAddress: string;
  stakingAmount: string;
  signature: string;
  yes: boolean;
  date: number | string;
  totalStakedAmount: string;
};

type TypeRegisterProps = {
  userAddress: string;
  contractAddress: string;
  tier: string;
  stakedAmount: string;
  signature: string;
  // totalStakedAmount: string;
  timestamp: string;
};

type TypeInvestProps = {
  userAddress: string;
  contractAddress: string;
  amount: string;
  signature: string;
  userBalance: string;
  timestamp: number;
  poolPercentages: number[];
  stakingTiers: number[];
};

type TypeInvestmentsProps = {
  userAddress: string;
  contractAddress: string;
  tokenDecimals: number;
};

type TypeInvestmentsEthProps = {
  userAddress: string;
  contractAddress: string;
};

export default class ContractPresalePublicService {
  public web3: any;

  public contractAddress: any;

  public contractAbi: any;

  public contract: any;

  public contractName: any;

  constructor(props: TypeConstructorProps) {
    const { web3Provider, chainType } = props;
    const { addresses, IS_MAINNET_OR_TESTNET, abis }: any = config;
    const addressesOfNetType = addresses[IS_MAINNET_OR_TESTNET];
    const abisOfNetType = abis[IS_MAINNET_OR_TESTNET];
    this.web3 = new Web3(web3Provider);
    // this.web3.eth.handleRevert = true;
    this.contractName = 'PresalePublic';
    this.contractAddress = addressesOfNetType[chainType][this.contractName];
    this.contractAbi = abisOfNetType[chainType][this.contractName];
    this.contract = new this.web3.eth.Contract(this.contractAbi, this.contractAddress);
  }

  public getInfo = async ({ contractAddress }: TypeGetInfoProps): Promise<any> => {
    try {
      const contract = new this.web3.eth.Contract(this.contractAbi, contractAddress);
      const generalInfo = await contract.methods.generalInfo().call();
      const uniswapInfo = await contract.methods.uniswapInfo().call();
      const stringInfo = await contract.methods.stringInfo().call();
      const intermediate = await contract.methods.intermediate().call();
      console.log('ContractPresalePublicService getInfo:', {
        generalInfo,
        uniswapInfo,
        stringInfo,
        intermediate,
      });
      const tokenAddress = generalInfo.token;
      const contractToken = new this.web3.eth.Contract(ERC20Abi, tokenAddress);
      const decimals = await contractToken.methods.decimals().call();
      const tokenSymbol = await contractToken.methods.symbol().call();
      const {
        creator,
        token,
        tokenPriceInWei,
        softCapInWei,
        hardCapInWei,
        tokensForSaleLeft,
        tokensForLiquidityLeft,
        openTimePresale,
        closeTimePresale,
        openTimeVoting,
        closeTimeVoting,
        collectedFee,
      } = generalInfo;
      const {
        saleTitle,
        linkTelegram,
        linkGithub,
        linkTwitter,
        linkWebsite,
        linkLogo,
        description,
        whitepaper,
      } = stringInfo;
      const {
        listingPriceInWei,
        lpTokensLockDurationInDays,
        liquidityPercentageAllocation,
        liquidityAllocationTime,
        unlockTime,
      } = uniswapInfo;
      const {
        approved,
        beginingAmount,
        cancelled,
        liquidityAdded,
        participants,
        raisedAmount,
        yesVotes,
        noVotes,
        lastTotalStakedAmount,
      } = intermediate;
      // format
      const pow = new BN(10).pow(new BN(decimals));
      const tokenPrice = +new BN(tokenPriceInWei).div(pow);
      const softCapFormatted = +new BN(softCapInWei).div(pow);
      const hardCapFormatted = +new BN(hardCapInWei).div(pow);
      const tokensForSaleLeftInEth = +new BN(tokensForSaleLeft).div(pow);
      const tokensForLiquidityLeftInEth = +new BN(tokensForLiquidityLeft).div(pow);
      const listingPriceInEth = +new BN(listingPriceInWei).div(pow);
      const beginingAmountInEth = +new BN(beginingAmount).div(pow);
      const raisedAmountInEth = +new BN(raisedAmount).div(pow); // todo: decimals of native token
      // result
      return {
        // general
        creator,
        token,
        tokenSymbol,
        tokenPrice,
        softCap: softCapFormatted,
        hardCap: hardCapFormatted,
        tokensForSaleLeft: tokensForSaleLeftInEth,
        tokensForLiquidityLeft: tokensForLiquidityLeftInEth,
        openTimePresale: openTimePresale * 1000,
        closeTimePresale: closeTimePresale * 1000,
        openTimeVoting: openTimeVoting * 1000,
        closeTimeVoting: closeTimeVoting * 1000,
        collectedFee,
        // string
        saleTitle: convertHexToString(saleTitle),
        linkTelegram: convertHexToString(linkTelegram),
        linkGithub: convertHexToString(linkGithub),
        linkTwitter: convertHexToString(linkTwitter),
        linkWebsite: convertHexToString(linkWebsite),
        linkLogo,
        description,
        whitepaper,
        // uniswap
        listingPrice: listingPriceInEth,
        lpTokensLockDurationInDays,
        liquidityPercentageAllocation,
        liquidityAllocationTime: liquidityAllocationTime * 1000,
        unlockTime,
        // intermediate
        approved,
        beginingAmount: beginingAmountInEth,
        cancelled,
        liquidityAdded,
        participants,
        raisedAmount: raisedAmountInEth,
        yesVotes,
        noVotes,
        lastTotalStakedAmount,
      };
    } catch (e) {
      console.error('ContractPresalePublicService getInfo:', e);
      return null;
    }
  };

  public getUserRegister = async (contractAddress: string, userAddress: string) => {
    try {
      const contract = new this.web3.eth.Contract(this.contractAbi, contractAddress);
      const result = contract.methods.whitelistTier(userAddress).call();
      return result;
    } catch (e) {
      console.error('ContractPresalePublicService getUserRegister:', e);
      return null;
    }
  };

  public getMyVote = async (contractAddress: string, userAddress: string): Promise<any> => {
    try {
      const contract = new this.web3.eth.Contract(this.contractAbi, contractAddress);
      const vote = await contract.methods.voters(userAddress).call();

      return vote;
    } catch (e) {
      console.error('ContractPresalePublicService getMyVote:', e);
      return null;
    }
  };

  public vote = async (props: TypeVoteProps) => {
    try {
      const {
        userAddress,
        contractAddress,
        yes,
        stakingAmount,
        signature,
        date,
        totalStakedAmount,
      } = props;
      // console.log('ContractPresalePublicService vote:', props);
      const contract = new this.web3.eth.Contract(this.contractAbi, contractAddress);
      return contract.methods
        .vote(yes, stakingAmount, date, signature, totalStakedAmount)
        .send({ from: userAddress });
    } catch (e) {
      console.error('ContractPresalePublicService vote:', e);
      return null;
    }
  };

  public invest = async (props: TypeInvestProps) => {
    try {
      const {
        userAddress,
        contractAddress,
        amount,
        userBalance,
        signature,
        timestamp,
        // poolPercentages,
        // stakingTiers,
      } = props;
      console.log('ContractPresalePublicService vote props:', props);
      const contract = new this.web3.eth.Contract(this.contractAbi, contractAddress);
      return contract.methods
        .invest(signature, userBalance, timestamp)
        .send({ from: userAddress, value: amount });
    } catch (e) {
      console.error('ContractPresalePublicService invest:', e);
      return null;
    }
  };

  public collectFundsRaised = async (props: TypeInvestProps) => {
    try {
      const { userAddress, contractAddress } = props;
      // console.log('ContractPresalePublicService collectFundsRaised props:', props);
      const contract = new this.web3.eth.Contract(this.contractAbi, contractAddress);
      return contract.methods.collectFundsRaised().send({ from: userAddress });
    } catch (e) {
      console.error('ContractPresalePublicService collectFundsRaised:', e);
      return null;
    }
  };

  public investments = async (props: TypeInvestmentsProps): Promise<any> => {
    try {
      const { userAddress, contractAddress, tokenDecimals } = props;
      // console.log('ContractPresalePublicService investments props:', props);
      const contract = new this.web3.eth.Contract(this.contractAbi, contractAddress);
      const result = await contract.methods.investments(userAddress).call();
      const { amountEth, amountTokens } = result;
      const pow = new BN(10).pow(new BN(18));
      const amountEthInEth = +new BN(amountEth).div(pow);
      const powToken = new BN(10).pow(new BN(tokenDecimals));
      const amountTokensInEth = +new BN(amountTokens).div(powToken);
      return {
        amountEth: amountEthInEth,
        amountTokens: amountTokensInEth,
      };
    } catch (e) {
      console.error('ContractPresalePublicService investments:', e);
      return null;
    }
  };

  public investmentsEth = async (props: TypeInvestmentsEthProps): Promise<any> => {
    try {
      const { userAddress, contractAddress } = props;
      // console.log('ContractPresalePublicService investments props:', props);
      const contract = new this.web3.eth.Contract(this.contractAbi, contractAddress);
      const result = await contract.methods.investments(userAddress).call();
      const { amountEth } = result;
      const pow = new BN(10).pow(new BN(18));
      const amountEthInEth = +new BN(amountEth).div(pow);
      return amountEthInEth;
    } catch (e) {
      console.error('ContractPresalePublicService investmentsEth:', e);
      return null;
    }
  };

  public register = async (props: TypeRegisterProps) => {
    try {
      const {
        contractAddress,
        userAddress,
        stakedAmount,
        signature,
        // totalStakedAmount,
        timestamp,
        tier,
      } = props;
      console.log('ContractPresalePublicService register:', props);
      const contract = new this.web3.eth.Contract(this.contractAbi, contractAddress);
      return contract.methods
        .register(stakedAmount, tier, timestamp, signature)
        .send({ from: userAddress });
    } catch (e) {
      console.error('ContractPresalePublicService register:', e);
      return null;
    }
  };

  public claimTokens = async (props: TypeClaimTokensProps) => {
    try {
      const { userAddress, contractAddress } = props;
      // console.log('ContractPresalePublicService claimTokens:', props);
      const contract = new this.web3.eth.Contract(this.contractAbi, contractAddress);
      return contract.methods.claimTokens().send({ from: userAddress });
    } catch (e) {
      console.error('ContractPresalePublicService claimTokens:', e);
      return null;
    }
  };

  public cancelPresale = async (props: TypeClaimTokensProps) => {
    try {
      const { userAddress, contractAddress } = props;
      // console.log('ContractPresalePublicService cancelPresale:', props);
      const contract = new this.web3.eth.Contract(this.contractAbi, contractAddress);
      return contract.methods.cancelPresale().send({ from: userAddress });
    } catch (e) {
      console.error('ContractPresalePublicService cancelPresale:', e);
      return null;
    }
  };

  public collectFee = async (props: TypeClaimTokensProps) => {
    try {
      const { userAddress, contractAddress } = props;
      // console.log('ContractPresalePublicService collectFee:', props);
      const contract = new this.web3.eth.Contract(this.contractAbi, contractAddress);
      return contract.methods.collectFee().send({ from: userAddress });
    } catch (e) {
      console.error('ContractPresalePublicService collectFee:', e);
      return null;
    }
  };

  public withdrawInvestment = async (props: TypeClaimTokensProps) => {
    try {
      const { userAddress, contractAddress } = props;
      // console.log('ContractPresalePublicService cancelPresale:', props);
      const contract = new this.web3.eth.Contract(this.contractAbi, contractAddress);
      const amountEth = await this.investmentsEth({ userAddress, contractAddress });
      const amountEthInWei = convertToWei(amountEth, 18);
      return contract.methods
        .withdrawInvestment(userAddress, amountEthInWei)
        .send({ from: userAddress });
    } catch (e) {
      console.error('ContractPresalePublicService cancelPresale:', e);
      return null;
    }
  };
}
