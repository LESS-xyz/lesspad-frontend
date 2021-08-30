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
  decimalsToken: string;
  decimalsNativeToken: string;
};

export default class ContractCalculations1Service {
  public web3: any;

  public contractAbi: any;

  public contractName: string;

  public contractAddress: string;

  public contractLessLibraryAddress: string;

  public contract: any;

  constructor(props: TypeConstructorProps) {
    this.contractName = 'Calculations1';

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

  public countAmountOfTokens = async (
    props: TypeCountAmountOfTokensProps,
  ): Promise<string | null> => {
    try {
      const {
        hardCap,
        tokenPrice,
        listingPrice,
        liquidityPercentageAllocation,
        decimalsToken,
        decimalsNativeToken,
      } = props;
      console.log('ContractCalculations1Service countAmountOfTokens:', props);
      const resultArray = await this.contract.methods
        .countAmountOfTokens(
          hardCap,
          tokenPrice,
          listingPrice,
          liquidityPercentageAllocation,
          decimalsToken,
          decimalsNativeToken,
        )
        .call();
      return resultArray[2];
    } catch (e) {
      console.error('ContractCalculations1Service countAmountOfTokens:', e);
      return null;
    }
  };
}
