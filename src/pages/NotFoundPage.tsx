import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <h1 className="text-7xl font-extrabold text-gray-800">404</h1>

      <p className="mt-4 text-xl text-gray-600 text-center">
        Oops! The page you are looking for was not found.
      </p>

      <p className="mt-2 text-gray-500 text-center">
        It might have been removed or the URL is incorrect.
      </p>

      <Link
        to="/"
        className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
      >
        Go back to Home
      </Link>
    </div>
  );
}
