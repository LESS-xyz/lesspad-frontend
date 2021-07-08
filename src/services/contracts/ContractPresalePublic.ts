import Web3 from 'web3';

import config from '../../config';
// import ERC20Abi from "../../data/ERC20Abi";
//
// const { BN }: any = Web3.utils;

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

  public getInfo = async ({ contractAddress }: TypeGetInfoProps) => {
    try {
      // console.log('ContractPresalePublicService getInfo:', this.contractAbi, this.contractAddress)
      const contract = new this.web3.eth.Contract(this.contractAbi, contractAddress);
      // get token decimals
      // const generalInfo = await contract.methods.generalInfo().call(); // todo
      const uniswapInfo = await contract.methods.uniswapInfo().call();
      const stringInfo = await contract.methods.stringInfo().call();
      console.log('ContractPresalePublicService getInfo:', { uniswapInfo, stringInfo });
      // const tokenAddress = generalInfo[0];
      // const contractToken = new this.web3.eth.Contract(ERC20Abi, tokenAddress);
      // const decimals = await contractToken.methods.decimals().call();
      // // format
      // const softCapFormatted = +new BN(softCap).div(new BN(10).pow(decimals));
      // const hardCapFormatted = +new BN(hardCap).div(new BN(10).pow(decimals));
      // result
      const { linkTwitter } = stringInfo;
      const info = {
        // saleTitle: this.web3.utils.hexToString(saleTitle),
        // softCap: softCapFormatted,
        // hardCap: hardCapFormatted,
        linkTwitter: this.web3.utils.hexToString(linkTwitter),
      };
      return info;
    } catch (e) {
      console.error('ContractPresalePublicService getInfo:', e);
      return null;
    }
  };

  public vote = async (props: TypeVoteProps) => {
    try {
      const { userAddress, contractAddress, yes } = props;
      const contract = new this.web3.eth.Contract(this.contractAbi, contractAddress);
      const result = await contract.methods.vote(yes).send({ from: userAddress });
      return result;
    } catch (e) {
      console.error('ContractLessLibraryService vote:', e);
      return null;
    }
  };
}
