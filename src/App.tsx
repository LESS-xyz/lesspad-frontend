import { Header } from './components';
import Footer from './components/Footer/index';
import { AboutPage } from './pages';

export const App: React.FC = () => {
  return (
    <div className="App">
      <Header />
      <AboutPage />
      <Footer />
    </div>
  );
};
