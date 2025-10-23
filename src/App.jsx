import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import { tools } from './config/tools';
import './styles/index.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            {tools.map((tool) => (
              <Route
                key={tool.id}
                path={tool.path}
                element={<tool.component />}
              />
            ))}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
