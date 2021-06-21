import { Header } from './components';
import Footer from './components/Footer/index';
import { MainPage } from './pages';

export const App: React.FC = () => {
  return (
    <div className="App">
      <Header />
      <MainPage />
      <Footer />
    </div>
  );
};
