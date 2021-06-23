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
} from './pages';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Modal } from './components/Modal';
import React from 'react';
import { ProjectPage } from './pages';

export const App: React.FC = () => {
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
