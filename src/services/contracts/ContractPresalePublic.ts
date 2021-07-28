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
      // console.log('ContractPresalePublicService getInfo:', this.contractAbi, this.contractAddress)
      const contract = new this.web3.eth.Contract(this.contractAbi, contractAddress);
      // get token decimals
      const generalInfo = await contract.methods.generalInfo().call();
      const uniswapInfo = await contract.methods.uniswapInfo().call();
      const stringInfo = await contract.methods.stringInfo().call();
      console.log('ContractPresalePublicService getInfo:', {
        generalInfo,
        uniswapInfo,
        stringInfo,
      });
      const tokenAddress = generalInfo.token;
      const contractToken = new this.web3.eth.Contract(ERC20Abi, tokenAddress);
      const decimals = await contractToken.methods.decimals().call();
      const { saleTitle } = stringInfo;
      const { softCapInWei, hardCapInWei } = generalInfo;
      // format
      const softCapFormatted = +new BN(softCapInWei).div(new BN(10).pow(new BN(decimals)));
      const hardCapFormatted = +new BN(hardCapInWei).div(new BN(10).pow(new BN(decimals)));
      // result
      const { linkTwitter } = stringInfo;
      return {
        saleTitle: this.web3.utils.hexToString(saleTitle),
        softCap: softCapFormatted,
        hardCap: hardCapFormatted,
        linkTwitter: this.web3.utils.hexToString(linkTwitter),
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
      console.error('ContractLessLibraryService vote:', e);
      return null;
    }
  };
}
