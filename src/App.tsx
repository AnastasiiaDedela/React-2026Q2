import { Component } from 'react';
import CardList from './components/CardList';
import Search from './components/Search';
import Loader from './components/Loader';
import type {
  PokemonDetail,
  PokemonApiResponse,
  PokemonListItem,
  FlavorTextEntry,
} from './types/pokemon';
import type { AppState, AppProps } from './types';

class App extends Component<AppProps, AppState> {
  defaultUrl = 'https://pokeapi.co/api/v2/pokemon?offset=0&limit=20';
  constructor(props: AppProps) {
    super(props);

    this.state = {
      result: [],
      url: this.defaultUrl,
      error: null,
      search: '',
      loading: false,
    };
  }

  componentDidMount() {
    const savedSearch = localStorage.getItem('pokemonSearch');

    if (savedSearch) {
      this.setState(
        {
          search: savedSearch,
          url: `https://pokeapi.co/api/v2/pokemon/${savedSearch.toLowerCase()}`,
        },
        () => this.fetchData()
      );
    } else {
      this.fetchData();
    }
  }

  componentDidUpdate(_: AppProps, prevState: AppState) {
    if (prevState.url !== this.state.url) {
      this.fetchData();
    }
  }

  fetchData = async (): Promise<void> => {
    this.setState({ loading: true, error: null });
    try {
      const res = await fetch(this.state.url);
      const data: PokemonApiResponse = await res.json();

      const isList = 'results' in data;

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

      this.setState({
        result: detailed,
        error: null,
        loading: false,
      });
    } catch (err: unknown) {
      console.error(err);
      this.setState({ error: 'Something went wrong' });
      this.setState({ loading: false });
    }
  };

  handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    this.setState({ search: value });

    if (value.trim() === '') {
      localStorage.removeItem('pokemonSearch');

      this.setState({
        url: this.defaultUrl,
      });
    }
  };

  handleSearch = () => {
    const trimmed = this.state.search.trim().toLowerCase();

    if (!trimmed) return;

    const currentUrl = `https://pokeapi.co/api/v2/pokemon/${trimmed}`;

    if (this.state.url === currentUrl) return;

    localStorage.setItem('pokemonSearch', trimmed);

    this.setState({
      url: currentUrl,
      search: trimmed,
    });
  };

  render() {
    const { result, loading } = this.state;

    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-6">
          <Search
            value={this.state.search}
            onChange={this.handleSearchChange}
            onSearch={this.handleSearch}
          />
          {loading ? <Loader /> : <CardList result={result} />}
        </div>
      </div>
    );
  }
}

export default App;
