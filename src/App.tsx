import { Header } from './components';
import Footer from './components/Footer/index';
import { CreatePoolPage } from './pages';

export const App: React.FC = () => {
  return (
    <div className="App">
      <Header />
      <CreatePoolPage />
      <Footer />
    </div>
  );
};
