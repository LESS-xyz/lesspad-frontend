import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Footer from './components/Footer/index';
import { Modal } from './components/Modal';
import { useContractsContext } from './contexts/ContractsContext';
import { poolActions } from './redux/actions';
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

export const App: React.FC = () => {
  const { ContractLessLibrary } = useContractsContext();

  const dispatch = useDispatch();
  const setPools = (params: any[]) => dispatch(poolActions.setPools(params));

  const getArrForSearch = async () => {
    try {
      const arrForSearch = await ContractLessLibrary.getArrForSearch();
      if (arrForSearch) setPools(arrForSearch);
      console.log('App getArrForSearch:', arrForSearch);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (!ContractLessLibrary) return;
    getArrForSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ContractLessLibrary]);

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
};
