import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import PlinkoGame from './exported_games/PlinkoGame/PlinkoGame';
import CrashGame from './exported_games/CrashGame/CrashGame';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <header className="app-header">
          <nav>
            <Link to="/plinko" className="nav-link">Plinko</Link>
            <Link to="/crash" className="nav-link">Crash</Link>
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
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
