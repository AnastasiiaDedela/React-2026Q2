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
import { Outlet, useParams, useSearchParams } from 'react-router-dom';
const BASE_URL = 'https://pokeapi.co/api/v2/pokemon';
const HomePage = () => {
  const [inputValue, setInputValue] = useState(
    () => localStorage.getItem('pokemonSearch') ?? ''
  );
  const [search, setSearch] = useState(
    () => localStorage.getItem('pokemonSearch') ?? ''
  );
  const [url, setUrl] = useState(`${BASE_URL}?offset=0&limit=20`);
  const [data, setData] = useState<PokemonListResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [triggerError, setTriggerError] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const pageNumber = Number(searchParams.get('page')) || 1;
  console.log(searchParams.get('page'));
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
        if ('weight' in data) {
          console.log('Single Pokémon data:', data);
          setData({
            results: [{ name: data.name, url: `${BASE_URL}/${data.name}` }],
          } as PokemonListResponse);
        } else {
          setData(data);
        }
        setError(null);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong.');
        setLoading(false);
      }
    };
    fetchData();
  }, [url, search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (value.trim() === '') {
      localStorage.removeItem('pokemonSearch');
      setSearch('');
    }
  };

  const handleSearch = () => {
    const trimmed = inputValue.trim().toLowerCase();
    if (!trimmed) return;
    localStorage.setItem('pokemonSearch', trimmed);
    setSearch(trimmed);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('page', '1');
      return next;
    });
  };

  //const handleTestError = () => setTriggerError(true);

  const { name } = useParams();

  return (
    <div className="flex gap-4 w-full py-5">
      <div className={name ? 'w-1/2' : 'w-full'}>
        <div className="min-h-screen flex items-center justify-center ">
          <div className="w-full bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-y-4">
            <Search
              value={inputValue}
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
                <CardList list={data?.results || []} currentPage={pageNumber} />
              )}
            </ErrorBoundary>
            {!search && (
              <Pagination
                pageNumber={pageNumber}
                onClickPrev={() => {
                  if (data?.previous) {
                    setUrl(data.previous);
                    setSearchParams((prev) => {
                      const next = new URLSearchParams(prev);
                      next.set('page', String(pageNumber - 1));
                      return next;
                    });
                  }
                }}
                onClickNext={() => {
                  if (data?.next) {
                    setUrl(data.next);
                    setSearchParams((prev) => {
                      const next = new URLSearchParams(prev);
                      next.set('page', String(pageNumber + 1));
                      return next;
                    });
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
