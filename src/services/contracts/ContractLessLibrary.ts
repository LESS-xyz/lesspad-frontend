import Web3 from 'web3';

import config from '../../config';

type TypeConstructorProps = {
  web3Provider: any;
  chainType: string;
};

export default class ContractLessLibraryService {
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
    this.contractName = 'LessLibrary';
    this.contractAddress = addressesOfNetType[chainType][this.contractName];
    this.contractAbi = abisOfNetType[chainType][this.contractName];
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
      const addresses: string[] = [];
      if (count) {
        for (let i = 0; i < count; i += 1) {
          const address = await contract.methods.getPresaleAddress(i).call();
          addresses.push(address);
        }
      }
      return addresses;
    } catch (e) {
      console.error('ContractLessLibraryService getPresalesAddresses:', e);
      return null;
    }
  };

  public getMinUnstakeTime = async () => {
    try {
      const contract = new this.web3.eth.Contract(this.contractAbi, this.contractAddress);
      const result = await contract.methods.getMinUnstakeTime().call();
      return result;
    } catch (e) {
      console.error('ContractLessLibraryService getMinUnstakeTime:', e);
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

  public getMinCreatorStakedBalance = async () => {
    try {
      const contract = new this.web3.eth.Contract(this.contractAbi, this.contractAddress);
      const balance = await contract.methods.getMinCreatorStakedBalance().call();
      return balance;
    } catch (e) {
      console.error('ContractLessLibraryService getMinCreatorStakedBalance:', e);
      return null;
    }
  };

  public getArrForSearch = async () => {
    try {
      const contract = new this.web3.eth.Contract(this.contractAbi, this.contractAddress);
      const arrForSearch = await contract.methods.getArrForSearch().call();
      const arrForSearchFormatted = arrForSearch.map((item: any) => {
        let { description, title } = item;
        const { isCertified, presaleAddress } = item;
        if (description === '') description = '0x';
        if (title === '') title = '0x';
        return {
          description,
          isCertified,
          address: presaleAddress,
          title,
        };
      });
      return arrForSearchFormatted;
    } catch (e) {
      console.error('ContractLessLibraryService getArrForSearch:', e);
      return null;
    }
  };
}
