import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { App as AntApp } from 'antd';
import PlinkoGame from './exported_games/PlinkoGame/PlinkoGame';
import CrashGame from './exported_games/CrashGame/CrashGame';
import DinoGame from './exported_games/DinoGame/DinoGame';
import SpinWinGame from './exported_games/SpinWinGame/SpinWinGame';
import './index.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.15; // Lower volume for background
    }

    const handleVolumeChange = (e) => {
      if (audioRef.current) {
        audioRef.current.volume = e.detail;
      }
    };
    window.addEventListener('musicVolumeChange', handleVolumeChange);

    const handleInteraction = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().catch(e => console.log('Autoplay prevented:', e));
      }
      // Remove listeners after first interaction
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };

    document.addEventListener('click', handleInteraction);
    document.addEventListener('keydown', handleInteraction);

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('musicVolumeChange', handleVolumeChange);
    };
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <AntApp>
      <BrowserRouter>
        <audio ref={audioRef} src="/audio/bg-music.mp3" loop />
        <div className="app-container">
        <header className="app-header">
          <button className="menu-btn" onClick={toggleSidebar}>
            ☰
          </button>
          <div className="logo"><Link to="/">Linkup Games</Link></div>
          <button className="mute-btn" onClick={toggleMute} style={{ background: 'transparent', border: '1px solid #555', color: '#fff', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer', marginLeft: 'auto', fontSize: '12px', fontWeight: 'bold' }}>
            {isMuted ? '🔇 Unmute' : '🔊 Mute'}
          </button>
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
