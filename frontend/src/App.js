import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './Home';
import VideoProcessor from './VideoProcessor';
import './App.css';
import LogoSvg from './LogoSvg';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <header>
        <div className="logo"><LogoSvg /></div>          
        <nav>
            <Link to="/">Home</Link>
            <Link to="/process">Process Video</Link>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/process" element={<VideoProcessor />} />
          </Routes>
        </main>
        <footer>
          <p>© TECNONAUTS - 2024</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;
