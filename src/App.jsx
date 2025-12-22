import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import GamePage from './pages/GamePage';
import CustomVocabularyPage from './pages/CustomVocabularyPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:categoryId" element={<CategoryPage />} />
        <Route path="/game/:categoryId/:setName" element={<GamePage />} />
        <Route path="/custom" element={<CustomVocabularyPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;