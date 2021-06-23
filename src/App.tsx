import { Header } from './components';
import Footer from './components/Footer/index';
import { AllPoolsPage, PresalePage, MainPage, Page404 } from './pages';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { MainPage } from './pages';
import { Modal } from "./components/Modal";

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
          <Route path="/presale">
            <PresalePage />
          </Route>
          <Route path="*">
            <Page404 />
          </Route>
        </Switch>
        <Footer />
      </div>
    </Router>
    <div className="App">
      <Header />
      <Footer />
      <Modal />
    </div>
  );
};
