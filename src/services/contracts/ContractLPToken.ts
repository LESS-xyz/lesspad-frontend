import Web3 from 'web3';

import config from '../../config';
import { convertFromWei } from '../../utils/ethereum';

type TypeConstructorProps = {
  web3Provider: any;
  chainType: string;
};

type TypeStakeProps = {
  userAddress: string;
  spender: string;
  amount: number;
};

export default class ContractLPToken {
  public web3: any;

  public contractAddress: string;

  public contractAbi: any;

  public contract: any;

  public contractName: string;

  constructor(props: TypeConstructorProps) {
    const { web3Provider, chainType } = props;
    const { addresses, isMainnetOrTestnet, abis }: any = config;
    const addressesOfNetType = addresses[isMainnetOrTestnet];
    const abisOfNetType = abis[isMainnetOrTestnet];
    this.web3 = new Web3(web3Provider);
    this.contractName = 'LPToken';
    this.contractAddress = addressesOfNetType[chainType][this.contractName];
    this.contractAbi = abisOfNetType[chainType][this.contractName];
    this.contract = new this.web3.eth.Contract(this.contractAbi, this.contractAddress);
  }

  public decimals = async (): Promise<any> => {
    try {
      const contract = new this.web3.eth.Contract(this.contractAbi, this.contractAddress);
      return await contract.methods.decimals().call();
    } catch (e) {
      console.error('ContractLPToken decimals:', e);
      return null;
    }
  };

  public totalSupply = async (): Promise<any> => {
    try {
      const contract = new this.web3.eth.Contract(this.contractAbi, this.contractAddress);
      return await contract.methods.totalSupply().call();
    } catch (e) {
      console.error('ContractLPToken totalSupply:', e);
      return null;
    }
  };

  public balanceOf = async ({ userAddress }: TypeStakeProps): Promise<any> => {
    try {
      const result = await this.contract.methods.balanceOf(userAddress).call();
      const decimals = await this.decimals();
      const resultInEth = convertFromWei(result, decimals);
      return resultInEth;
    } catch (e) {
      console.error('ContractLPToken balanceOf:', e);
      return null;
    }
  };

  public allowance = async ({ userAddress, spender }: TypeStakeProps): Promise<any> => {
    try {
      // console.log('ContractPresalePublicService getInfo:', this.contractAbi, this.contractAddress)
      const result = await this.contract.methods.allowance(userAddress, spender).call();
      const decimals = await this.decimals();
      const resultInEth = convertFromWei(result, decimals);
      return resultInEth;
    } catch (e) {
      console.error('ContractLPToken allowance:', e);
      return null;
    }
  };

  public approve = async (props: TypeStakeProps): Promise<any> => {
    try {
      const { userAddress, spender, amount } = props;
      console.log('ContractLPToken approve:', props);
      return await this.contract.methods.approve(spender, amount).send({ from: userAddress });
    } catch (e) {
      console.error('ContractLPToken approve:', e);
      return null;
    }
  };
}
