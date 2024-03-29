import React, { memo, useCallback, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Footer from './components/Footer/index';
import { Modal } from './components/Modal';
import { useContractsContext } from './contexts/ContractsContext';
import { libraryActions, poolActions } from './redux/actions';
import { convertFromWei } from './utils/ethereum';
// import { storageCache } from './utils/localStorage';
import { Header } from './components';
import {
  AboutPage,
  AllPoolsPage,
  CreatePoolPage,
  MainPage,
  Page404,
  PageVoting,
  ProjectPage,
  StakingPage,
} from './pages';

export const App: React.FC = memo(() => {
  const {
    ContractLessLibrary,
    ContractStaking,
    ContractLessToken,
    ContractLPToken,
  } = useContractsContext();

  const dispatch = useDispatch();
  const setPools = useCallback((params: any[]) => dispatch(poolActions.setPools(params)), [
    dispatch,
  ]);
  const setLibrary = useCallback((params: any) => dispatch(libraryActions.setLibrary(params)), [
    dispatch,
  ]);

  const { address: userAddress } = useSelector(({ user }: any) => user);
  const { lessDecimals, lpDecimals } = useSelector(({ library }: any) => library);

  const getMinCreatorStakedBalance = useCallback(async () => {
    try {
      const resultGetMinCreatorStakedBalance = await ContractLessLibrary.getMinCreatorStakedBalance();
      setLibrary({ minCreatorStakedBalance: resultGetMinCreatorStakedBalance });
    } catch (e) {
      console.error(e);
    }
  }, [ContractLessLibrary, setLibrary]);

  const getMinVoterBalance = useCallback(async () => {
    try {
      const resultGetMinVoterBalance = await ContractLessLibrary.getMinVoterBalance();
      setLibrary({ minVoterBalance: resultGetMinVoterBalance });
    } catch (e) {
      console.error(e);
    }
  }, [ContractLessLibrary, setLibrary]);

  const getOwner = useCallback(async () => {
    try {
      const owner = await ContractLessLibrary.owner();
      if (owner) setLibrary({ owner });
      console.log('App getOwner:', owner);
    } catch (e) {
      console.error('App getOwner:', e);
    }
  }, [ContractLessLibrary, setLibrary]);

  const getArrForSearch = useCallback(async () => {
    try {
      const arrForSearch = await ContractLessLibrary.getArrForSearch();
      // const arrForSearch = await storageCache({
      //   key: 'arrForSearch',
      //   method: arrForSearchMethod,
      //   delay: 20000,
      // });
      const compareOpenVotingTime = (a, b) => b.openVotingTime - a.openVotingTime;
      const arrForSearchSorted = arrForSearch.sort(compareOpenVotingTime);
      if (arrForSearch) setPools(arrForSearchSorted);
      console.log('App getArrForSearch:', arrForSearch);
    } catch (e) {
      console.error('App getArrForSearch:', e);
    }
  }, [ContractLessLibrary, setPools]);

  const getDecimals = useCallback(async () => {
    try {
      const resultLessDecimals = await ContractLessToken.decimals();
      setLibrary({ lessDecimals: resultLessDecimals });
      const resultLpDecimals = await ContractLPToken.decimals();
      setLibrary({ lpDecimals: resultLpDecimals });
      console.log('App getDecimals:', { resultLessDecimals, resultLpDecimals });
    } catch (e) {
      console.error('App getDecimals:', e);
    }
  }, [ContractLessToken, ContractLPToken, setLibrary]);

  const getLessPerLp = useCallback(async () => {
    try {
      const lessPerLp = await ContractStaking.getLessPerLp();
      if (lessPerLp) setLibrary({ lessPerLp });
      console.log('App getLessPerLp:', lessPerLp);
    } catch (e) {
      console.error('App getLessPerLp:', e);
    }
  }, [ContractStaking, setLibrary]);

  const getStakedLess = useCallback(async () => {
    try {
      const result = await ContractStaking.getLessBalanceByAddress({ userAddress });
      const resultInEth = convertFromWei(result, lessDecimals);
      if (resultInEth) setLibrary({ stakedLess: resultInEth });
      console.log('App getStakedLess:', resultInEth);
    } catch (e) {
      console.error('App getStakedLess:', e);
    }
  }, [ContractStaking, setLibrary, lessDecimals, userAddress]);

  const getStakedLp = useCallback(async () => {
    try {
      const result = await ContractStaking.getLpBalanceByAddress({ userAddress });
      const resultInEth = convertFromWei(result, lpDecimals);
      if (resultInEth) setLibrary({ stakedLp: resultInEth });
      console.log('App getStakedLP:', resultInEth);
    } catch (e) {
      console.error('App getStakedLp:', e);
    }
  }, [ContractStaking, setLibrary, lpDecimals, userAddress]);

  useEffect(() => {
    if (!getOwner) return;
    if (!ContractLessLibrary) return;
    getOwner();
  }, [ContractLessLibrary, ContractStaking, ContractLessToken, ContractLPToken, getOwner]);

  useEffect(() => {
    if (!getMinCreatorStakedBalance) return;
    if (!ContractLessLibrary) return;
    getMinCreatorStakedBalance();
  }, [
    ContractLessLibrary,
    ContractStaking,
    ContractLessToken,
    ContractLPToken,
    getMinCreatorStakedBalance,
  ]);

  useEffect(() => {
    if (!getMinVoterBalance) return;
    if (!ContractLessLibrary) return;
    getMinVoterBalance();
  }, [
    ContractLessLibrary,
    ContractStaking,
    ContractLessToken,
    ContractLPToken,
    getMinVoterBalance,
  ]);

  useEffect(() => {
    if (!getArrForSearch) return;
    if (!ContractLessLibrary) return;
    getArrForSearch();
  }, [ContractLessLibrary, getArrForSearch]);

  useEffect(() => {
    if (!ContractLessToken) return;
    if (!ContractLPToken) return;
    getDecimals();
  }, [ContractLessToken, ContractLPToken, getDecimals]);

  useEffect(() => {
    if (!ContractStaking) return;
    getLessPerLp();
  }, [ContractStaking, getLessPerLp]);

  useEffect(() => {
    if (!userAddress) return;
    if (!ContractStaking) return;
    getStakedLess();
    getStakedLp();
  }, [ContractStaking, getStakedLess, getStakedLp, userAddress]);

  return (
    <Router>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Lesspad</title>
        <meta
          name="description"
          content="Multi-Chain Decentralized
Fundraising Capital"
        />
      </Helmet>

      <div className="App">
        <Header />
        <Switch>
          <Route path="/" exact>
            <MainPage />
          </Route>
          <Route path="/pools">
            <AllPoolsPage />
          </Route>
          <Route path="/voting">
            <PageVoting />
          </Route>
          <Route path="/create-pool">
            <CreatePoolPage />
          </Route>
          <Route path="/staking">
            <StakingPage />
          </Route>
          <Route path="/about">
            <AboutPage />
          </Route>
          <Route path="/pool">
            <ProjectPage />
          </Route>
          <Route path="*">
            <Page404 />
          </Route>
        </Switch>
        <Footer />
      </div>
      <Modal />
    </Router>
  );
});
