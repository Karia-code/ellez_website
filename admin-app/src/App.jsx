import React from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Admin from './Admin.jsx';

export default function App() {
  return (
    <BrowserRouter basename="/admin">
      <Routes>
        <Route path="/" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}
