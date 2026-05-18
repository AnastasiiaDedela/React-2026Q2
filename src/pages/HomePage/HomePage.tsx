import { useState, useEffect } from 'react';
import CardList from '../../components/CardList/CardList';
import Search from '../../components/Search/Search';
import Loader from '../../components/Loader/Loader';
import BuggyComponent from '../../components/BuggyComponent/BuggyComponent';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';
import type {
  PokemonApiResponse,
  PokemonListResponse,
} from '../../types/pokemon';
import Pagination from '../../components/Pagination/Pagination';
import { Outlet, useParams } from 'react-router-dom';
const BASE_URL = 'https://pokeapi.co/api/v2/pokemon';
const HomePage = () => {
  const [search, setSearch] = useState(
    () => localStorage.getItem('pokemonSearch') ?? ''
  );
  const [url, setUrl] = useState(`${BASE_URL}?offset=0&limit=20`);
  const [data, setData] = useState<PokemonListResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [triggerError, setTriggerError] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(search ? `${BASE_URL}/${search}` : url);

        if (!res.ok) {
          throw new Error(
            res.status === 404
              ? 'Pokémon not found. Try another name.'
              : 'Server error. Please try again later.'
          );
        }

        const data: PokemonApiResponse = await res.json();
        setData(data);
        setError(null);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong.');
        setLoading(false);
      }
    };
    fetchData();
  }, [url]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log(value);
    setSearch(value);
    if (value.trim() === '') {
      localStorage.removeItem('pokemonSearch');
    }
  };

  const handleSearch = () => {
    const trimmed = search.trim().toLowerCase();
    if (!trimmed) return;
    const currentUrl = `https://pokeapi.co/api/v2/pokemon/${trimmed}`;
    if (url === currentUrl) return;
    localStorage.setItem('pokemonSearch', trimmed);
    console.log(localStorage.getItem('pokemonSearch'));
    setUrl(currentUrl);
    setSearch(trimmed);
  };

  //const handleTestError = () => setTriggerError(true);

  const { name } = useParams();

  return (
    <div className="flex gap-4 w-full py-5">
      <div className={name ? 'w-1/2' : 'w-full'}>
        <div className="min-h-screen flex items-center justify-center ">
          <div className="w-full bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-y-4">
            <Search
              value={search}
              onChange={handleSearchChange}
              onSearch={handleSearch}
            />
            {error && (
              <div className="text-red-600 bg-red-100 border border-red-300 p-3 rounded mb-4 text-center">
                {error}
              </div>
            )}
            <ErrorBoundary>
              {triggerError ? (
                <BuggyComponent />
              ) : loading ? (
                <Loader />
              ) : (
                <CardList list={data?.results || []} />
              )}
            </ErrorBoundary>
            {!search && (
              <Pagination
                pageNumber={pageNumber}
                onClickPrev={() => {
                  if (data?.previous) {
                    setUrl(data.previous);
                    setPageNumber(pageNumber - 1);
                  }
                }}
                onClickNext={() => {
                  if (data?.next) {
                    setUrl(data.next);
                    setPageNumber(pageNumber + 1);
                  }
                }}
              />
            )}
            <div className="flex justify-end">
              <button
                onClick={() => setTriggerError(true)}
                className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
              >
                Trigger Error
              </button>
            </div>
          </div>
        </div>
      </div>
      {name && (
        <div className="w-1/2">
          <Outlet />
        </div>
      )}
    </div>
  );
};

export default HomePage;
