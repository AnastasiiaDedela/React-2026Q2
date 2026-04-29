// src/types/pokemon.ts

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonApiResponse {
  results: PokemonListItem[];
}

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
