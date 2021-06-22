import { Header } from './components';
import Footer from './components/Footer/index';
import { MainPage } from './pages';
import { Modal } from "./components/Modal";

export const App: React.FC = () => {
  return (
    <div className="App">
      <Header />
      <MainPage />
      <Footer />
      <Modal />
    </div>
  );
};
