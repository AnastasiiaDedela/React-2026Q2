import type { PokemonApiResponse, PokemonDetail } from '../types/pokemon';

export const mockPokemonListResponse: PokemonApiResponse = {
  results: [
    {
      name: 'pikachu',
      url: 'https://pokeapi.co/api/v2/pokemon/pikachu',
    },
  ],
};

export const mockPokemonResponse = {
  name: 'pikachu',

  sprites: {
    front_default: 'pikachu.png',
  },
};

export const mockSpeciesResponse = {
  flavor_text_entries: [
    {
      flavor_text: 'Electric mouse pokemon',
      language: {
        name: 'en',
      },
    },
  ],
};

export const mockPokemonDetail: PokemonDetail = {
  name: 'pikachu',
  image: 'pikachu.png',
  description: 'Electric mouse pokemon',
};
