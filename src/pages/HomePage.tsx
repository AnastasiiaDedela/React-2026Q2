import { useState, useEffect } from 'react';
import CardList from '../components/CardList/CardList';
import Search from '../components/Search/Search';
import Loader from '../components/Loader/Loader';
import BuggyComponent from '../components/BuggyComponent/BuggyComponent';
import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary';
import type {
  PokemonDetail,
  PokemonApiResponse,
  PokemonListItem,
  FlavorTextEntry,
} from '../types/pokemon';
import Pagination from '../components/Pagination/Pagination';

const defaultUrl = 'https://pokeapi.co/api/v2/pokemon?offset=0&limit=20';

const App = () => {
  const [result, setResult] = useState<PokemonDetail[]>([]);
  const [search, setSearch] = useState(
    () => localStorage.getItem('pokemonSearch') ?? ''
  );
  const [url, setUrl] = useState(() => {
    const saved = localStorage.getItem('pokemonSearch');
    return saved
      ? `https://pokeapi.co/api/v2/pokemon/${saved.toLowerCase()}`
      : defaultUrl;
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [triggerError, setTriggerError] = useState(false);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [prevUrl, setPrevUrl] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(url);

        if (!res.ok) {
          throw new Error(
            res.status === 404
              ? 'Pokémon not found. Try another name.'
              : 'Server error. Please try again later.'
          );
        }

        const data: PokemonApiResponse = await res.json();
        const isList = 'results' in data;

        if (isList) {
          setNextUrl(data.next ?? null);
          setPrevUrl(data.previous ?? null);
        } else {
          setNextUrl(null);
          setPrevUrl(null);
        }

        const list: PokemonListItem[] = isList
          ? data.results
          : [{ name: data.name, url: '' }];

        const detailed: PokemonDetail[] = await Promise.all(
          list.map(async (item: PokemonListItem) => {
            const pokemonRes = await fetch(
              `https://pokeapi.co/api/v2/pokemon/${item.name}`
            );
            const pokemonData = await pokemonRes.json();

            const speciesRes = await fetch(
              `https://pokeapi.co/api/v2/pokemon-species/${item.name}`
            );
            const speciesData = await speciesRes.json();

            const description =
              speciesData.flavor_text_entries
                .find((e: FlavorTextEntry) => e.language.name === 'en')
                ?.flavor_text.replace(/\f/g, ' ') ?? '';

            return {
              name: item.name,
              image: pokemonData.sprites.front_default,
              description,
            };
          })
        );

        setResult(detailed);
        setError(null);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong.');
        setLoading(false);
        setResult([]);
      }
    };
    fetchData();
  }, [url]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    if (value.trim() === '') {
      localStorage.removeItem('pokemonSearch');
      setUrl(defaultUrl);
    }
  };

  const handleSearch = () => {
    const trimmed = search.trim().toLowerCase();
    if (!trimmed) return;
    const currentUrl = `https://pokeapi.co/api/v2/pokemon/${trimmed}`;
    if (url === currentUrl) return;
    localStorage.setItem('pokemonSearch', trimmed);
    setUrl(currentUrl);
    setSearch(trimmed);
  };

  const handleTestError = () => setTriggerError(true);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-y-4">
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
            <CardList result={result} />
          )}
        </ErrorBoundary>

        {!search && (
          <Pagination
            nextUrl={nextUrl}
            prevUrl={prevUrl}
            setUrl={setUrl}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
          />
        )}

        <div className="flex justify-end">
          <button
            onClick={handleTestError}
            className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
          >
            Trigger Error
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
