import { Routes, Route } from 'react-router-dom';

import Layout from './Layout/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Route>
    </Routes>
  );
}

export default App;
