import BigNumber from 'bignumber.js/bignumber';
import Web3 from 'web3';

import config from '../config';

type TypeConstructorProps = {
  chainType: string;
};

type TypeAllowance = {
  userAddress: string;
  allowanceTarget: string;
  contractAddress: string;
  contractAbi: any;
};

type TypeApprove = {
  amount?: string;
  userAddress: string;
  allowanceTarget: string;
  contractAddress: string;
  contractAbi: any;
};

type TypeSignMessageProps = {
  userAddress: string;
  message: string;
};

export default class Web3Service {
  public provider: any;

  public web3Provider: any;

  public addresses: any;

  public chainType: string;

  constructor({ chainType }: TypeConstructorProps) {
    this.chainType = chainType;
    this.provider = (window as any).ethereum;
    this.web3Provider = new Web3(this.provider);
    this.addresses = config.addresses;
  }

  public checkNetwork = async () => {
    const { chainIds } = config;
    const chainIdsByType: any = chainIds[config.IS_PRODUCTION ? 'mainnet' : 'testnet'];
    const usedNet = chainIdsByType[this.chainType].id;
    const netVersion = this.provider.chainId;
    const neededNetName = chainIdsByType[this.chainType].name;
    console.log('Web3ProviderService checkNetwork:', { usedNet, netVersion, neededNetName });
    if (usedNet.includes(netVersion)) return { status: 'SUCCESS', data: usedNet[0] };
    return {
      status: 'ERROR',
      message: `Please, change network to ${neededNetName}`,
    };
  };

  public connect = async () => {
    return this.provider.request({ method: 'eth_requestAccounts' });
  };

  public disconnect = async () => {
    return this.provider.close();
  };

  public getBalance = async (address: string) => {
    const balance = await this.web3Provider.eth.getBalance(address);
    return +new BigNumber(balance).dividedBy(new BigNumber(10).pow(18)).toFixed();
  };

  public sendTx = async (data: any) => {
    try {
      const result = await this.web3Provider.eth.sendTransaction(data);
      return { status: 'SUCCESS', data: result };
    } catch (e) {
      console.error(e);
      return { status: 'ERROR', data: null };
    }
  };

  public balanceOf = async ({ address, contractAddress, contractAbi }: any) => {
    const contract = new this.web3Provider.eth.Contract(contractAbi, contractAddress);
    const balance = await contract.methods.balanceOf(address).call();
    const decimals = await contract.methods.decimals().call();
    return +new BigNumber(balance).dividedBy(new BigNumber(10).pow(decimals)).toFixed();
  };

  public decimals = async ({ contractAddress, contractAbi }: any) => {
    const contract = new this.web3Provider.eth.Contract(contractAbi, contractAddress);
    const decimals = await contract.methods.decimals().call();
    return +decimals;
  };

  public totalSupply = async ({ contractAddress, contractAbi }: any) => {
    try {
      const contract = new this.web3Provider.eth.Contract(contractAbi, contractAddress);
      const totalSupply = await contract.methods.totalSupply().call();
      return new BigNumber(totalSupply).toString(10);
    } catch (e) {
      console.error('Web3ProviderService totalSupply:', e);
      return '0';
    }
  };

  public allowance = async ({
    userAddress,
    allowanceTarget,
    contractAddress,
    contractAbi,
  }: TypeAllowance) => {
    try {
      console.log('Web3ProviderService allowance', {
        userAddress,
        allowanceTarget,
        contractAddress,
        contractAbi,
      });
      const contract = new this.web3Provider.eth.Contract(contractAbi, contractAddress);
      const allowance = await contract.methods.allowance(userAddress, allowanceTarget).call();
      return +allowance;
    } catch (e) {
      console.error('Web3ProviderService allowance:', e);
      return 0;
    }
  };

  public approve = async ({
    // amount,
    userAddress,
    allowanceTarget,
    contractAbi,
    contractAddress,
  }: TypeApprove) => {
    try {
      const totalSupply = await this.totalSupply({ contractAddress, contractAbi });
      const contract = new this.web3Provider.eth.Contract(contractAbi, contractAddress);
      return contract.methods.approve(allowanceTarget, totalSupply).send({ from: userAddress });
    } catch (e) {
      console.error('Web3ProviderService approve:', e);
      return null;
    }
  };

  public getGasPrice = async () => {
    const price = await this.web3Provider.eth.getGasPrice();
    // console.log('Web3Provider getGasPrice:', price);
    return +new BigNumber(price).dividedBy(new BigNumber(10).pow(9)).toFixed();
  };

  public getLastBlockInverval = async () => {
    try {
      const latestBlock = await this.web3Provider.eth.getBlock('latest');
      const prevBlock = await this.web3Provider.eth.getBlock(latestBlock.number - 1);
      const prevPrevBlock = await this.web3Provider.eth.getBlock(latestBlock.number - 2);
      const interval1 = latestBlock.timestamp - prevBlock.timestamp;
      const interval2 = prevBlock.timestamp - prevPrevBlock.timestamp;
      console.log('Web3ProviderService getLastBlockInverval:', latestBlock, prevBlock);
      return { status: 'SUCCESS', data: ((interval1 + interval2) / 2) * 1000 };
    } catch (e) {
      console.error('Web3ProviderService getLastBlockInverval:', e);
      return { status: 'ERROR', data: null };
    }
  };

  public subscribe = async (type: string, callback: any) => {
    try {
      return await this.web3Provider.eth.subscribe(type, callback);
    } catch (e) {
      console.error('Web3ProviderService subscribe:', e);
      return false;
    }
  };

  public clearSubscriptions = async () => {
    try {
      await this.web3Provider.eth.clearSubscriptions();
    } catch (e) {
      console.error('Web3ProviderService clearSubscriptions:', e);
    }
  };

  // public signMessage = async ({ userAddress, message }: TypeSignMessageProps) => {
  //   try {
  //     await this.web3Provider.eth.sign(message, userAddress);
  //   } catch (e) {
  //     console.error('Web3ProviderService sign:', e);
  //   }
  // };

  public signMessage = async ({ userAddress, message }: TypeSignMessageProps) => {
    try {
      const msgParams = [
        {
          type: 'string', // Any valid solidity type
          name: 'Message', // Any string label you want
          value: message, // The value to sign
        },
      ];
      return new Promise((resolve: any, reject: any) => {
        this.web3Provider.currentProvider.send(
          {
            method: 'eth_signTypedData',
            params: [msgParams, userAddress],
            from: userAddress,
          },
          (err: Error | null, result: any) => {
            if (err) reject(err);
            if (result.error) reject(result.error.message);
            resolve(result.result);
          },
        );
      });
    } catch (e) {
      console.error('Web3ProviderService sign:', e);
      return null;
    }
  };
}
