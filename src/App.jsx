import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { App as AntApp } from 'antd';
import PlinkoGame from './exported_games/PlinkoGame/PlinkoGame';
import CrashGame from './exported_games/CrashGame/CrashGame';
import DinoGame from './exported_games/DinoGame/DinoGame';
import SpinWinGame from './exported_games/SpinWinGame/SpinWinGame';
import './index.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <AntApp>
      <BrowserRouter>
        <div className="app-container">
        <header className="app-header">
          <button className="menu-btn" onClick={toggleSidebar}>
            ☰
          </button>
          <div className="logo"><Link to="/">Linkup Games</Link></div>
        </header>

        <div className={`game-sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <h2>Games</h2>
            <button className="close-btn" onClick={closeSidebar}>×</button>
          </div>
          <nav className="sidebar-nav">
            <Link to="/plinko" className="nav-link" onClick={closeSidebar}>Plinko</Link>
            <Link to="/crash" className="nav-link" onClick={closeSidebar}>Crash</Link>
            <Link to="/dino" className="nav-link" onClick={closeSidebar}>Dino</Link>
            <Link to="/spin-win" className="nav-link" onClick={closeSidebar}>Spin & Win</Link>
          </nav>
        </div>
        
        {isSidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

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
