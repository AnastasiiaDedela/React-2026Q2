import { Routes, Route } from 'react-router-dom';

import Layout from './Layout/Layout';
import HomePage from './pages/HomePage/HomePage';
import AboutPage from './pages/AboutPage/AboutPage';
import DetailPage from './pages/DetailPage/DatailPage';
import NotFoundPage from './pages/NotFound/NotFoundPage';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />}>
          <Route path="detail/:name" element={<DetailPage />} />
        </Route>
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
