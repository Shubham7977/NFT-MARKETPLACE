import React from 'react';
import Install from "./components/Install";
import Main from './components/Main';

const App = () => {
  if (window.ethereum) {
    return <Main />
  } else {
    return <Install />;
  }
};

export default App