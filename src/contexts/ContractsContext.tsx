import React, { createContext, useContext, useState } from 'react';

import ContractLessLibraryService from '../services/ContractLessLibrary';
import { useWeb3ConnectorContext } from './Web3Connector';
import { useSelector } from "react-redux";

const contractsContext = createContext<any>({
  ContractLessLibrary: {},
});

const ContractsContext: React.FC = ({ children }) => {
  const { web3 } = useWeb3ConnectorContext();

  const { chainType } = useSelector(({ wallet }: any) => wallet);

  const [ContractLessLibrary, setContractLessLibrary] = useState<any>();
  const [value, setValue] = useState<any>({});

  const init: any = React.useCallback(() => {
    try {
      const NewContractLessLibrary = new ContractLessLibraryService({ web3Provider: web3.provider, chainType });
      console.log('ContractsContext init:', { web3Provider: web3.provider, chainType, NewContractLessLibrary });
      setContractLessLibrary(NewContractLessLibrary);
    } catch (e) {
      console.error('ContractsContext init:', e);
    }
  }, [web3, chainType]);

  React.useEffect(() => {
    if (!web3) return;
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [web3]);

  React.useEffect(() => {
    if (!web3) return;
    if (!chainType) return;
    if (!ContractLessLibrary) return;
    const newValue = {
      ContractLessLibrary,
    }
    setValue(newValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ContractLessLibrary]);

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
