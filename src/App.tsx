import { Component } from 'react';
import CardList from './components/CardList';
import type {
  PokemonDetail,
  PokemonApiResponse,
  PokemonListItem,
  FlavorTextEntry,
} from './types/pokemon';
import type { AppState, AppProps } from './types';

class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    this.state = {
      result: [],
      url: 'https://pokeapi.co/api/v2/pokemon?offset=0&limit=20',
      error: null,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(_: AppProps, prevState: AppState) {
    if (prevState.url !== this.state.url) {
      this.fetchData();
    }
  }

  fetchData = async (): Promise<void> => {
    try {
      const res = await fetch(this.state.url);
      const data: PokemonApiResponse = await res.json();

      const list: PokemonListItem[] = data.results;

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
      });
    } catch (err: unknown) {
      console.error(err);
      this.setState({ error: 'Something went wrong' });
    }
  };

  render() {
    const { result } = this.state;

    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-6">
          <CardList result={result} />
        </div>
      </div>
    );
  }
}

export default App;
