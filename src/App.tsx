import { Header } from './components';
import Footer from './components/Footer/index';
import {
  AllPoolsPage,
  PageVoting,
  MainPage,
  Page404,
  CreatePoolPage,
  AboutPage,
  StakingPage,
  ProjectPage,
} from './pages';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Modal } from './components/Modal';
import React, { useEffect } from 'react';
import { useDispatch } from "react-redux";
import { poolActions } from "./redux/actions";
import { useContractsContext } from "./contexts/ContractsContext";

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
