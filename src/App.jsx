import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Home from './pages/Home';
import Diary from './pages/Diary';
import LifeStory from './pages/LifeStory';
import LovedOnes from './pages/LovedOnes';
import Favorites from './pages/Favorites';
import Routine from './pages/Routine';
import Goals from './pages/Goals';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/diary" element={<Diary />} />
          <Route path="/life-story" element={<LifeStory />} />
          <Route path="/loved-ones" element={<LovedOnes />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/routine" element={<Routine />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

