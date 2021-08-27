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

type TypeGetIntermediateInfoProps = {
  tokenAddress: string;
  contractAddress: string;
};

type TypeClaimTokensProps = {
  contractAddress: string;
  userAddress: string;
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
  nativeTokenAmount: string;
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

export default class ContractPresaleCertifiedService {
  public web3: any;

  public contractAddress: any;

  public contractAbi: any;

  public contractName: any;

  public nativeTokens: any;

  constructor(props: TypeConstructorProps) {
    const { web3Provider, chainType } = props;
    const { addresses, IS_MAINNET_OR_TESTNET, CERTIFIED_PRESALE_CURRENCIES, abis }: any = config;
    const addressesOfNetType = addresses[IS_MAINNET_OR_TESTNET];
    const abisOfNetType = abis[IS_MAINNET_OR_TESTNET];
    this.web3 = new Web3(web3Provider);
    // this.web3.eth.handleRevert = true;
    this.contractName = 'PresaleCertified';
    this.contractAddress = addressesOfNetType[chainType][this.contractName];
    this.contractAbi = abisOfNetType[chainType][this.contractName];
    this.nativeTokens = CERTIFIED_PRESALE_CURRENCIES[IS_MAINNET_OR_TESTNET][chainType] || {};
  }

  public getInfo = async ({ contractAddress }: TypeGetInfoProps): Promise<any> => {
    try {
      const contract = new this.web3.eth.Contract(this.contractAbi, contractAddress);
      const generalInfo = await contract.methods.generalInfo().call();
      const uniswapInfo = await contract.methods.uniswapInfo().call();
      const stringInfo = await contract.methods.stringInfo().call();
      const intermediate = await contract.methods.intermediate().call();
      const certifiedAddition = await contract.methods.certifiedAddition().call();
      console.log('ContractPresaleCertified getInfo:', {
        generalInfo,
        uniswapInfo,
        stringInfo,
        intermediate,
        certifiedAddition,
      });
      const tokenAddress = generalInfo.token;
      const contractToken = new this.web3.eth.Contract(ERC20Abi, tokenAddress);
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
      const { liquidity, automatically, vesting, nativeToken, privatePresale } = certifiedAddition;
      // format
      const nativeTokenDecimals = this.nativeTokens[
        Object.keys(this.nativeTokens).find((key) => {
          return this.nativeTokens[key].address === nativeToken.toLowerCase();
        }) || ''
      ].decimals;
      const pow = new BN(10).pow(new BN(nativeTokenDecimals));
      const tokenPrice = +new BN(tokenPriceInWei).div(pow);
      const softCapFormatted = +new BN(softCapInWei).div(pow);
      const hardCapFormatted = +new BN(hardCapInWei).div(pow);
      const tokensForSaleLeftInEth = +new BN(tokensForSaleLeft).div(pow);
      const tokensForLiquidityLeftInEth = +new BN(tokensForLiquidityLeft).div(pow);
      const listingPriceInEth = +new BN(listingPriceInWei).div(new BN(10).pow(new BN(18)));
      const beginingAmountInEth = +new BN(beginingAmount).div(pow);
      const raisedAmountInEth = +new BN(raisedAmount).div(pow);
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
        // certified addition
        liquidity,
        automatically,
        vesting,
        nativeToken,
        privatePresale,
      };
    } catch (e) {
      console.error('ContractPresaleCertified getInfo:', e);
      return null;
    }
  };

  public getIntermediateInfo = async ({
    tokenAddress,
    contractAddress,
  }: TypeGetIntermediateInfoProps): Promise<any> => {
    try {
      const contract = new this.web3.eth.Contract(this.contractAbi, contractAddress);
      const intermediate = await contract.methods.intermediate().call();
      console.log('ContractPresaleCertified getIntermediateInfo:', {
        intermediate,
      });
      const contractToken = new this.web3.eth.Contract(ERC20Abi, tokenAddress);
      const decimals = await contractToken.methods.decimals().call();
      const {
        approved,
        cancelled,
        liquidityAdded,
        beginingAmount,
        raisedAmount,
        participants,
      } = intermediate;
      // format
      const pow = new BN(10).pow(new BN(decimals));
      const beginingAmountInEth = +new BN(beginingAmount).div(pow);
      const raisedAmountInEth = +new BN(raisedAmount).div(pow); // todo: decimals of native token
      // result
      return {
        approved,
        cancelled,
        liquidityAdded,
        beginingAmount: beginingAmountInEth,
        raisedAmount: raisedAmountInEth,
        participants,
      };
    } catch (e) {
      console.error('ContractPresaleCertified getIntermediateInfo:', e);
      return null;
    }
  };

  public getUserRegister = async (contractAddress: string, userAddress: string) => {
    try {
      const contract = new this.web3.eth.Contract(this.contractAbi, contractAddress);
      const result = contract.methods.whitelistTier(userAddress).call();
      return result;
    } catch (e) {
      console.error('ContractPresaleCertified getUserRegister:', e);
      return null;
    }
  };

  public invest = (props: TypeInvestProps) => {
    try {
      const {
        userAddress,
        contractAddress,
        amount,
        userBalance,
        signature,
        timestamp,
        nativeTokenAmount,
      } = props;
      console.log('ContractPresaleCertified invest props:', props);
      const contract = new this.web3.eth.Contract(this.contractAbi, contractAddress);
      return contract.methods
        .invest(nativeTokenAmount, signature, userBalance, timestamp)
        .send({ from: userAddress, value: amount });
    } catch (e) {
      console.error('ContractPresaleCertified invest:', e);
      return null;
    }
  };

  public collectFundsRaised = (props: TypeInvestProps) => {
    try {
      const { userAddress, contractAddress } = props;
      // console.log('ContractPresaleCertified collectFundsRaised props:', props);
      const contract = new this.web3.eth.Contract(this.contractAbi, contractAddress);
      return contract.methods.collectFundsRaised().send({ from: userAddress });
    } catch (e) {
      console.error('ContractPresaleCertified collectFundsRaised:', e);
      return null;
    }
  };

  public investments = async (props: TypeInvestmentsProps): Promise<any> => {
    try {
      const { userAddress, contractAddress, tokenDecimals } = props;
      // console.log('ContractPresaleCertified investments props:', props);
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
      console.error('ContractPresaleCertified investments:', e);
      return null;
    }
  };

  public investmentsEth = async (props: TypeInvestmentsEthProps): Promise<any> => {
    try {
      const { userAddress, contractAddress } = props;
      // console.log('ContractPresaleCertified investments props:', props);
      const contract = new this.web3.eth.Contract(this.contractAbi, contractAddress);
      const result = await contract.methods.investments(userAddress).call();
      const { amountEth } = result;
      const pow = new BN(10).pow(new BN(18));
      const amountEthInEth = +new BN(amountEth).div(pow);
      return amountEthInEth;
    } catch (e) {
      console.error('ContractPresaleCertified investmentsEth:', e);
      return null;
    }
  };

  public register = (props: TypeRegisterProps) => {
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
      // console.log('ContractPresaleCertified register:', props);
      const contract = new this.web3.eth.Contract(this.contractAbi, contractAddress);
      return contract.methods
        .register(stakedAmount, tier, timestamp, signature)
        .send({ from: userAddress });
    } catch (e) {
      console.error('ContractPresaleCertified register:', e);
      return null;
    }
  };

  public claimTokens = (props: TypeClaimTokensProps) => {
    try {
      const { userAddress, contractAddress } = props;
      // console.log('ContractPresaleCertified claimTokens:', props);
      const contract = new this.web3.eth.Contract(this.contractAbi, contractAddress);
      return contract.methods.claimTokens().send({ from: userAddress });
    } catch (e) {
      console.error('ContractPresaleCertified claimTokens:', e);
      return null;
    }
  };

  public cancelPresale = (props: TypeClaimTokensProps) => {
    try {
      const { userAddress, contractAddress } = props;
      // console.log('ContractPresaleCertified cancelPresale:', props);
      const contract = new this.web3.eth.Contract(this.contractAbi, contractAddress);
      return contract.methods.cancelPresale().send({ from: userAddress });
    } catch (e) {
      console.error('ContractPresaleCertified cancelPresale:', e);
      return null;
    }
  };

  public collectFee = (props: TypeClaimTokensProps) => {
    try {
      const { userAddress, contractAddress } = props;
      // console.log('ContractPresaleCertified collectFee:', props);
      const contract = new this.web3.eth.Contract(this.contractAbi, contractAddress);
      return contract.methods.collectFee().send({ from: userAddress });
    } catch (e) {
      console.error('ContractPresaleCertified collectFee:', e);
      return null;
    }
  };

  public withdrawInvestment = async (props: TypeClaimTokensProps) => {
    try {
      const { userAddress, contractAddress } = props;
      // console.log('ContractPresaleCertified cancelPresale:', props);
      const contract = new this.web3.eth.Contract(this.contractAbi, contractAddress);
      const amountEth = await this.investmentsEth({ userAddress, contractAddress });
      const amountEthInWei = convertToWei(amountEth, 18);
      return contract.methods
        .withdrawInvestment(userAddress, amountEthInWei)
        .send({ from: userAddress });
    } catch (e) {
      console.error('ContractPresaleCertified cancelPresale:', e);
      return null;
    }
  };

  public getWhitelistFull = async (props: TypeClaimTokensProps) => {
    try {
      const { contractAddress } = props;
      // console.log('ContractPresaleCertified getWhitelistFull:', props);
      const contract = new this.web3.eth.Contract(this.contractAbi, contractAddress);
      let whitelist: string[] = [];
      for (let i = 1; i <= 5; i += 1) {
        const whitelistOfTier: string[] = await contract.methods.getWhitelist(i).call();
        const whitelistOfTierInLowerCase = whitelistOfTier.map((item: string) =>
          item.toLowerCase(),
        );
        whitelist = whitelist.concat(whitelistOfTierInLowerCase);
      }
      return whitelist;
    } catch (e) {
      console.error('ContractPresaleCertified getWhitelistFull:', e);
      return null;
    }
  };
}
