import React from 'react';
import { Header } from './components';
import { MainPage } from './pages';

export const App: React.FC = () => {
  return (
    <div className="App">
      <Header />
      <MainPage />
    </div>
  );
};
