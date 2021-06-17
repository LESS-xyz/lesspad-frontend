import React from 'react';
import { Header } from './components';
import Footer from './components/Footer/index';
import { AllPoolsPage } from './pages';

export const App: React.FC = () => {
  return (
    <div className="App">
      <Header />
      <AllPoolsPage />
      <Footer />
    </div>
  );
};
