
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TestMenu from './pages/TestMenu';
import TestPage from './pages/TestPage';
import TestResult from './pages/TestResult';
import TestReview from './pages/TestReview';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TestMenu />} />
        <Route path="/test/:testnumber" element={<TestPage />} />
        <Route path="/result" element={<TestResult />} />
        <Route path="/review" element={<TestReview />} />
      </Routes>
    </Router>
  );
}

export default App;
