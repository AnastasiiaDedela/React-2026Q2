import { Link } from 'react-router';

function NavBar() {
  return (
    <div className="container">
      <div className="nav-bar px-4 py-3 flex bg-gray-200 justify-between ">
        <h1 className="text-blue-700 hover:text-blue-700 py-1 px-3 font-bold">
          Pokemon.org
        </h1>
        <div className="flex gap-3">
          <Link
            to="/"
            className="text-blue-700 hover:text-blue-700 py-1 px-3  rounded-lg"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-blue-700 hover:text-blue-700 py-1 px-3  rounded-lg"
          >
            About
          </Link>
        </div>
      </div>
    </div>
  );
}
export default NavBar;
