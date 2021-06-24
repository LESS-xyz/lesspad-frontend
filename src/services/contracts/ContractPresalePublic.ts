import BigNumber from 'bignumber.js/bignumber';
import Web3 from 'web3';
import config from '../../config';
import ERC20Abi from "../../data/ERC20Abi";

type TypeConstructorProps = {
  web3Provider: any;
  chainType: string;
};

type TypeGetInfoProps = {
  contractAddress: string;
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
    this.contractName = 'PresalePublic';
    this.contractAddress = addressesOfNetType[chainType][this.contractName];
    this.contractAbi = abisOfNetType[chainType][this.contractName];
  }

  public getInfo = async ({ contractAddress }: TypeGetInfoProps) => {
    try {
      // console.log('ContractPresalePublicService getInfo:', this.contractAbi, this.contractAddress)
      const contract = new this.web3.eth.Contract(this.contractAbi, contractAddress);

      const tokenAddress = await contract.methods.token().call();
      const contractToken = new this.web3.eth.Contract(ERC20Abi, tokenAddress);
      const decimals = await contractToken.methods.decimals().call();

      const hardCap = await contract.methods.hardCap().call();
      const hardCapFormatted = +new BigNumber(hardCap).dividedBy(new BigNumber(10).pow(decimals));
      const linkTwitter = await contract.methods.linkTwitter().call();

      const info = {
        hardCap: hardCapFormatted,
        linkTwitter: this.web3.utils.hexToString(linkTwitter),
      }
      return info;
    } catch (e) {
      console.error('ContractLessLibraryService getInfo:', e);
      return null;
    }
  };
}
