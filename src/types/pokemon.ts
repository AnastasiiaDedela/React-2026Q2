export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  results: PokemonListItem[];
  next: string | null;
  previous: string | null;
}

export interface PokemonSingleResponse {
  name: string;
}

export type PokemonApiResponse = PokemonListResponse | PokemonSingleResponse;

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
