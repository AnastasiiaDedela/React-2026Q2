import { Routes, Route } from 'react-router-dom';

import Layout from './Layout/Layout';
import HomePage from './pages/HomePage/HomePage';
import AboutPage from './pages/AboutPage';
import DetailPage from './pages/DatailPage';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />}>
          <Route path="detail/:name" element={<DetailPage />} />
        </Route>
        <Route path="/about" element={<AboutPage />} />
      </Route>
    </Routes>
  );
}

export default App;
