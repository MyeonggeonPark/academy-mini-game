import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import './App.css';

// Lazy load components for code splitting
const Home = React.lazy(() => import('./components/Home'));
const MathGenerator = React.lazy(() => import('./components/MathGenerator'));
const MazeGenerator = React.lazy(() => import('./components/MazeGenerator'));

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <main className="main-content">
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/math" element={<MathGenerator />} />
              <Route path="/maze" element={<MazeGenerator />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </Router>
  );
}

export default App;
