import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { App as AntApp } from 'antd';
import PlinkoGame from './exported_games/PlinkoGame/PlinkoGame';
import CrashGame from './exported_games/CrashGame/CrashGame';
import DinoGame from './exported_games/DinoGame/DinoGame';
import SpinWinGame from './exported_games/SpinWinGame/SpinWinGame';
import MinesGame from './exported_games/MinesGame/MinesGame';
import './index.css';

function App() {
  return (
    <AntApp>
      <BrowserRouter>
        <div className="app-container">
          <main className="app-main">
            <Routes>
              <Route path="/" element={
                <div className="home-screen">
                  <h1>Standalone Casino Games</h1>
                  <p>Access the games directly via URL, e.g., /dino, /plinko, /crash</p>
                </div>
              } />
              <Route path="/plinko" element={<PlinkoGame />} />
              <Route path="/crash" element={<CrashGame />} />
              <Route path="/dino" element={<DinoGame />} />
              <Route path="/spin-win" element={<SpinWinGame />} />
              <Route path="/mines" element={<MinesGame />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AntApp>
  );
}

export default App;
