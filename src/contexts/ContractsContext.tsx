import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Web3 from 'web3';

import config from '../config';
import ContractCalculationsService from '../services/contracts/ContractCalculations';
import ContractERC20Service from '../services/contracts/ContractERC20';
import ContractLessLibraryService from '../services/contracts/ContractLessLibrary';
import ContractLessTokenService from '../services/contracts/ContractLessToken';
import ContractLPTokenService from '../services/contracts/ContractLPToken';
/*eslint-disable*/
import ContractPresaleCertifiedService from '../services/contracts/ContractPresaleCertified';
/*eslint-enable*/
import ContractPresaleFactoryService from '../services/contracts/ContractPresaleFactory';
import ContractPresaleFactoryCertifiedService from '../services/contracts/ContractPresaleFactoryCertified';
import ContractPresalePublicService from '../services/contracts/ContractPresalePublic';
import ContractStakingService from '../services/contracts/ContractStaking';
import ContractUniswapRouterService from '../services/contracts/ContractUniswapRouter';

import { useWeb3ConnectorContext } from './Web3Connector';

const contractsContext = createContext<any>({
  ContractCalculations: {},
  ContractERC20: {},
  ContractPresalePublicWithMetamask: {},
  ContractLessLibrary: {},
  ContractPresalePublic: {},
  ContractPresaleFactory: {},
  ContractPresaleFactoryCertified: {},
  ContractPresaleCertified: {},
  ContractStaking: {},
  ContractLessToken: {},
  ContractLPToken: {},
  ContractUniswapRouter: {},
});

const ContractsContext: React.FC = ({ children }) => {
  const { web3 } = useWeb3ConnectorContext();

  const { chainType } = useSelector(({ wallet }: any) => wallet);
  const { address: userAddress } = useSelector(({ user }: any) => user);

  const [contractsOnRpc, setContractsOnRpc] = useState<any>({});
  const [contractsOnMetamask, setContractsOnMetamask] = useState<any>({});

  const initRpc: any = useCallback(async () => {
    try {
      const rpcProvider = new Web3(new Web3.providers.HttpProvider(config.rpc[chainType]));
      const ContractLessLibrary = new ContractLessLibraryService({
        web3Provider: rpcProvider,
        chainType,
      });
      const ContractPresalePublic = new ContractPresalePublicService({
        web3Provider: rpcProvider,
        chainType,
      });
      const ContractPresaleCertified = new ContractPresaleCertifiedService({
        web3Provider: rpcProvider,
        chainType,
      });
      if (!ContractLessLibrary) return;
      const uniswapRouterAddress = await ContractLessLibrary.getUniswapRouter();
      const ContractUniswapRouter = new ContractUniswapRouterService({
        web3Provider: rpcProvider,
        chainType,
        contractAddress: uniswapRouterAddress,
      });
      const newValue = {
        ContractPresalePublic,
        ContractPresaleCertified,
        ContractLessLibrary,
        ContractUniswapRouter,
      };
      setContractsOnRpc(newValue);
    } catch (e) {
      console.error('ContractsContext init:', e);
    }
  }, [chainType]);

  const initMetamask: any = useCallback(async () => {
    try {
      const ContractCalculations = new ContractCalculationsService({
        web3Provider: web3.provider,
        chainType,
      });
      const ContractERC20 = new ContractERC20Service({
        web3Provider: web3.provider,
        chainType,
      });
      const ContractPresalePublicWithMetamask = new ContractPresalePublicService({
        web3Provider: web3.provider,
        chainType,
      });
      const ContractPresaleFactory = new ContractPresaleFactoryService({
        web3Provider: web3.provider,
        chainType,
      });
      const ContractPresaleFactoryCertified = new ContractPresaleFactoryCertifiedService({
        web3Provider: web3.provider,
        chainType,
      });
      const ContractStaking = new ContractStakingService({
        web3Provider: web3.provider,
        chainType,
        userAddress,
      });
      const ContractLessToken = new ContractLessTokenService({
        web3Provider: web3.provider,
        chainType,
      });
      const ContractLPToken = new ContractLPTokenService({
        web3Provider: web3.provider,
        chainType,
      });
      const newValue = {
        ContractCalculations,
        ContractERC20,
        ContractPresalePublicWithMetamask,
        ContractPresaleFactory,
        ContractPresaleFactoryCertified,
        ContractStaking,
        ContractLessToken,
        ContractLPToken,
      };
      setContractsOnMetamask(newValue);
    } catch (e) {
      console.error('ContractsContext init:', e);
    }
  }, [web3, chainType, userAddress]);

  useEffect(() => {
    if (!chainType) return;
    initRpc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainType, web3, userAddress]);

  useEffect(() => {
    if (!chainType) return;
    if (!userAddress) return;
    if (!web3) return;
    initMetamask();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainType, web3, userAddress]);

  useEffect(() => {
    // console.log('value:', { ...contractsOnRpc, ...contractsOnMetamask });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractsOnRpc, contractsOnMetamask]);

  return (
    <contractsContext.Provider value={{ ...contractsOnRpc, ...contractsOnMetamask }}>
      {children}
    </contractsContext.Provider>
  );
};

export default ContractsContext;

export function useContractsContext(): any {
  return useContext(contractsContext);
}
