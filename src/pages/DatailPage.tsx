import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Loader from '../components/Loader/Loader';

type PokemonDetail = {
  name: string;
  weight: number;
  height: number;
  sprites: { front_default: string };
  types: { type: { name: string } }[];
  abilities: { ability: { name: string } }[];
};

const DetailPage = () => {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const page = searchParams.get('page') || '1';

  useEffect(() => {
    if (!name) return;
    setLoading(true);
    setData(null);
    fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch details');
        return res.json();
      })
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [name]);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 relative">
      <button
        onClick={() => navigate(`/?page=${page}`)}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl font-bold"
        aria-label="Close details"
      >
        ✕
      </button>

      {loading && <Loader />}
      {error && <p className="text-red-500">{error}</p>}
      {data && (
        <div className="flex flex-col items-center gap-4">
          <h2 className="capitalize text-2xl font-bold">{data.name}</h2>
          <img
            src={data.sprites.front_default}
            alt={data.name}
            className="w-32 h-32"
          />
          <p>Weight: {data.weight} kg</p>
          <p>Height: {data.height} dm</p>
          <p>Types: {data.types.map((t) => t.type.name).join(', ')}</p>
          <p>
            Abilities: {data.abilities.map((a) => a.ability.name).join(', ')}
          </p>
        </div>
      )}
    </div>
  );
};

export default DetailPage;
