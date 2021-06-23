import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

import ContractLessLibraryService from '../services/contracts/ContractLessLibrary';
import ContractPresalePublicService from '../services/contracts/ContractPresalePublic';
import { useWeb3ConnectorContext } from './Web3Connector';
import { useSelector } from "react-redux";

const contractsContext = createContext<any>({
  ContractLessLibrary: {},
});

const ContractsContext: React.FC = ({ children }) => {
  const { web3 } = useWeb3ConnectorContext();

  const { chainType } = useSelector(({ wallet }: any) => wallet);

  const [value, setValue] = useState<any>({});

  const init: any = useCallback(() => {
    try {
      const ContractLessLibrary = new ContractLessLibraryService({ web3Provider: web3.provider, chainType });
      const ContractPresalePublic = new ContractPresalePublicService({ web3Provider: web3.provider, chainType });
      // console.log('ContractsContext init:', { web3Provider: web3.provider, chainType, NewContractLessLibrary });
      if (!ContractLessLibrary) return;
      const newValue = {
        ContractLessLibrary,
        ContractPresalePublic,
      }
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

  return (
    <contractsContext.Provider value={value}>
      {children}
    </contractsContext.Provider>
  );
};

export default ContractsContext;

export function useContractsContext() {
  return useContext(contractsContext);
}
