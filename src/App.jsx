import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ThemePage from './pages/ThemePage';
import Results from './pages/Results';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:themeId" element={<ThemePage />} />
        <Route path="/:themeId/results" element={<Results />} />
      </Routes>
    </BrowserRouter>
  );
}
