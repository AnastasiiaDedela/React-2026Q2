import { Outlet } from 'react-router-dom';
import NavBar from '../components/NavBar/NavBar';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <NavBar />
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
