export interface PokemonListItem {
  name: string;
  url: string;
}

export type PokemonApiResponse =
  | {
      results: PokemonListItem[];
    }
  | {
      name: string;
    };

export interface PokemonDetail {
  name: string;
  image: string | null;
  description: string;
}

export interface FlavorTextEntry {
  flavor_text: string;
  language: {
    name: string;
  };
}
