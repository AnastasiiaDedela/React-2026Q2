import type { SearchProps } from '../../types/index';

function Search({ value, onChange, onSearch }: SearchProps) {
  return (
    <div className="flex gap-4">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Search Pokémon..."
        className="flex-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
        onKeyDown={(e) => {
          if (e.key === 'Enter') onSearch();
        }}
      />

      <button
        onClick={onSearch}
        className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition"
      >
        Search
      </button>
    </div>
  );
}

export default Search;
