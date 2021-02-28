import React from 'react';

import Lyratest from './lyra/Lyratest';

import logo from './logo.png';
import './App.less';

function App() {
  return (
    <div className="App">
      <header className="App-header">        
        <img src={logo} className="App-logo" alt="logo" />
        <Lyratest></Lyratest>
      </header>      
    </div>
  );
}

export default App;
