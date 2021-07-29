import Web3 from 'web3';

import config from '../../config';
import ERC20Abi from '../../data/abi/ERC20Abi';

const { BN }: any = Web3.utils;

type TypeConstructorProps = {
  web3Provider: any;
  chainType: string;
};

type TypeGetInfoProps = {
  contractAddress: string;
};

type TypeVoteProps = {
  userAddress: string;
  contractAddress: string;
  yes: boolean;
};

export default class ContractPresalePublicService {
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
    // this.web3.eth.handleRevert = true;
    this.contractName = 'PresalePublic';
    this.contractAddress = addressesOfNetType[chainType][this.contractName];
    this.contractAbi = abisOfNetType[chainType][this.contractName];
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
        saleTitle: this.web3.utils.hexToString(saleTitle),
        linkTelegram: this.web3.utils.hexToString(linkTelegram),
        linkGithub: this.web3.utils.hexToString(linkGithub),
        linkTwitter: this.web3.utils.hexToString(linkTwitter),
        linkWebsite: this.web3.utils.hexToString(linkWebsite),
        linkLogo,
        description,
        whitepaper,
        // uniswap
        listingPrice: listingPriceInEth,
        lpTokensLockDurationInDays,
        liquidityPercentageAllocation, // todo: in percent or in 0.01?
        liquidityAllocationTime: liquidityAllocationTime * 1000,
        unlockTime,
        // intermediate
        approved,
        beginingAmount: beginingAmountInEth,
        cancelled,
        liquidityAdded,
        participants,
        raisedAmount: raisedAmountInEth,
      };
    } catch (e) {
      console.error('ContractPresalePublicService getInfo:', e);
      return null;
    }
  };

  public vote = async (props: TypeVoteProps): Promise<any> => {
    try {
      const { userAddress, contractAddress, yes } = props;
      const contract = new this.web3.eth.Contract(this.contractAbi, contractAddress);
      return await contract.methods.vote(yes).send({ from: userAddress });
    } catch (e) {
      console.error('ContractPresalePublicService vote:', e);
      return null;
    }
  };
}
