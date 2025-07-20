import React, { useState } from 'react';
import './App.css';
import TemperatureLineChart from './TemperatureLineChart';
import TemperatureBarChart from './TemperatureBarChart';



function App() {
  const [language, setLanguage] = useState('EN');

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'EN' ? 'FR' : 'EN'));
  };

  return (
    <div className="App">
      <nav className="navbar">
        <h1>🌡️ Temperature Dashboard</h1>
        <button className="lang-toggle" onClick={toggleLanguage}>
          {language}
        </button>
      </nav>

      <div className="content">
      <TemperatureLineChart language={language} />
      <TemperatureBarChart language={language} />


      </div>
    </div>
  );
}

export default App;
