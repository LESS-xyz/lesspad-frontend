// import { BigNumber as BN } from 'bignumber.js/bignumber';
import Web3 from 'web3';

import config from '../../config';

type TypeConstructorProps = {
  web3Provider: any;
  chainType: string;
};

type TypeCountAmountOfTokensProps = {
  hardCap: string;
  tokenPrice: string;
  listingPrice: string;
  liquidityPercentageAllocation: string;
  decimals: string;
};

export default class ContractCalculationsService {
  public web3: any;

  public contractAbi: any;

  public contractName: string;

  public contractAddress: string;

  public contractLessLibraryAddress: string;

  public contract: any;

  constructor(props: TypeConstructorProps) {
    this.contractName = 'Calculations';

    const { web3Provider, chainType } = props;
    this.web3 = new Web3(web3Provider);

    const { IS_MAINNET_OR_TESTNET, abis, addresses }: any = config;
    const abisOfNetType = abis[IS_MAINNET_OR_TESTNET];
    const addressesOfNetType = addresses[IS_MAINNET_OR_TESTNET];
    this.contractAbi = abisOfNetType[chainType][this.contractName];
    this.contractAddress = addressesOfNetType[chainType][this.contractName];
    this.contract = new this.web3.eth.Contract(this.contractAbi, this.contractAddress);
    this.contractLessLibraryAddress = addressesOfNetType[chainType].LessLibrary;
  }

  public usdtToEthFee = async (): Promise<string | null> => {
    try {
      const resultUsdtToEthFee = await this.contract.methods
        .usdtToEthFee(this.contractLessLibraryAddress)
        .call();
      // const result = convertFromWei(resultUsdtToEthFee, 18);
      return resultUsdtToEthFee;
    } catch (e) {
      console.error('ContractCalculationsService usdtToEthFee:', e);
      return null;
    }
  };

  public countAmountOfTokens = async (
    props: TypeCountAmountOfTokensProps,
  ): Promise<string | null> => {
    try {
      const { hardCap, tokenPrice, listingPrice, liquidityPercentageAllocation, decimals } = props;
      console.log('ContractCalculationsService countAmountOfTokens:', props);
      const resultArray = await this.contract.methods
        .countAmountOfTokens(
          hardCap,
          tokenPrice,
          listingPrice,
          liquidityPercentageAllocation,
          decimals,
        )
        .call();
      return resultArray[2];
    } catch (e) {
      console.error('ContractCalculationsService countAmountOfTokens:', e);
      return null;
    }
  };
}
