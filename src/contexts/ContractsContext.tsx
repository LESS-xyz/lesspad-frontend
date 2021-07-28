import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import ContractLessLibraryService from '../services/contracts/ContractLessLibrary';
import ContractLessTokenService from '../services/contracts/ContractLessToken';
import ContractLPTokenService from '../services/contracts/ContractLPToken';
import ContractPresaleCertifiedService from '../services/contracts/ContractPresaleCertified';
import ContractPresaleFactoryService from '../services/contracts/ContractPresaleFactory';
import ContractPresaleFactoryCertifiedService from '../services/contracts/ContractPresaleFactoryCertified';
import ContractPresalePublicService from '../services/contracts/ContractPresalePublic';
import ContractStakingService from '../services/contracts/ContractStaking';
import ContractUniswapRouterService from '../services/contracts/ContractUniswapRouter';

import { useWeb3ConnectorContext } from './Web3Connector';

const contractsContext = createContext<any>({
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

  const [value, setValue] = useState<any>({});

  const init: any = useCallback(async () => {
    try {
      const ContractLessLibrary = new ContractLessLibraryService({
        web3Provider: web3.provider,
        chainType,
      });
      const ContractPresalePublic = new ContractPresalePublicService({
        web3Provider: web3.provider,
        chainType,
      });
      const ContractPresaleCertified = new ContractPresaleCertifiedService({
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
      });
      const ContractLessToken = new ContractLessTokenService({
        web3Provider: web3.provider,
        chainType,
      });
      const ContractLPToken = new ContractLPTokenService({
        web3Provider: web3.provider,
        chainType,
      });
      if (!ContractLessLibrary) return;
      const uniswapRouterAddress = await ContractLessLibrary.getUniswapRouter();
      const ContractUniswapRouter = new ContractUniswapRouterService({
        web3Provider: web3.provider,
        chainType,
        contractAddress: uniswapRouterAddress,
      });
      const newValue = {
        ContractLessLibrary,
        ContractPresalePublic,
        ContractPresaleCertified,
        ContractPresaleFactory,
        ContractPresaleFactoryCertified,
        ContractStaking,
        ContractLessToken,
        ContractLPToken,
        ContractUniswapRouter,
      };
      setValue(newValue);
    } catch (e) {
      console.error('ContractsContext init:', e);
    }
  }, [web3, chainType]);

  useEffect(() => {
    if (!web3) return;
    if (!chainType) return;
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [web3]);

  return <contractsContext.Provider value={value}>{children}</contractsContext.Provider>;
};

export default ContractsContext;

export function useContractsContext(): any {
  return useContext(contractsContext);
}
