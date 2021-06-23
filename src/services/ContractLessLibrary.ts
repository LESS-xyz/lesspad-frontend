// import BigNumber from 'bignumber.js/bignumber';
import Web3 from 'web3';
import config from '../config';

type TypeConstructorProps = {
  web3Provider: any;
  chainType: string;
};

export default class ContractLessLibraryService {
  public web3: any;
  public contractAddress: any;
  public contractAbi: any;

  constructor(props: TypeConstructorProps) {
    const { web3Provider, chainType } = props;
    const { addresses, isMainnetOrTestnet, abis }: any = config;
    this.web3 = new Web3(web3Provider);
    const addressesNew = addresses[isMainnetOrTestnet];
    this.contractAddress = addressesNew[chainType].LessLibrary;
    const abisNew = abis[isMainnetOrTestnet];
    this.contractAbi = abisNew[chainType].LessLibrary;
  }

  public getPresalesCount = async () => {
    try {
      // console.log('ContractLessLibraryService getPresalesCount:', this.contractAbi, this.contractAddress)
      const contract = new this.web3.eth.Contract(this.contractAbi, this.contractAddress);
      const result = await contract.methods.getPresalesCount().call();
      return result;
    } catch (e) {
      console.error('ContractLessLibraryService getPresalesCount:', e);
      return null;
    }
  };

  public getPresalesAddresses = async () => {
    try {
      // console.log('ContractLessLibraryService getPresalesAddresses:', this.contractAbi, this.contractAddress)
      const contract = new this.web3.eth.Contract(this.contractAbi, this.contractAddress);
      const count = await contract.methods.getPresalesCount().call();
      const addresses = [];
      if (count) {
        for (let i = 0; i < count; i += 1) {
          const address = await contract.methods.getPresaleAddress(i).call();
          addresses.push(address)
        }
      }
      return addresses;
    } catch (e) {
      console.error('ContractLessLibraryService getPresalesAddresses:', e);
      return null;
    }
  };

  public getMinVoterBalance = async () => {
    try {
      const contract = new this.web3.eth.Contract(this.contractAbi, this.contractAddress);
      const balance = await contract.methods.getMinVoterBalance().call();
      return balance;
    } catch (e) {
      console.error('ContractLessLibraryService getMinVoterBalance:', e);
      return null;
    }
  };
}
