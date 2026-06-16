import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { App as AntApp } from 'antd';
import PlinkoGame from './exported_games/PlinkoGame/PlinkoGame';
import CrashGame from './exported_games/CrashGame/CrashGame';
import DinoGame from './exported_games/DinoGame/DinoGame';
import SpinWinGame from './exported_games/SpinWinGame/SpinWinGame';
import './index.css';

function App() {
  return (
    <AntApp>
      <BrowserRouter>
        <div className="app-container">
        <header className="app-header">
          <nav>
            <Link to="/plinko" className="nav-link">Plinko</Link>
            <Link to="/crash" className="nav-link">Crash</Link>
            <Link to="/dino" className="nav-link">Dino</Link>
            <Link to="/spin-win" className="nav-link">Spin & Win</Link>
          </nav>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/" element={
              <div className="home-screen">
                <h1>Standalone Casino Games</h1>
                <p>Select a game to play from the navigation above.</p>
              </div>
            } />
            <Route path="/plinko" element={<PlinkoGame />} />
            <Route path="/crash" element={<CrashGame />} />
            <Route path="/dino" element={<DinoGame />} />
            <Route path="/spin-win" element={<SpinWinGame />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
    </AntApp>
  );
}

export default App;
