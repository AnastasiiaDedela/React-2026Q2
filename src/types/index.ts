import type { PokemonDetail } from '../types/pokemon';

export interface AppState {
  result: PokemonDetail[];
  url: string;
  error?: string | null;
}

export type AppProps = Record<string, never>;

export interface CardListProps {
  result: PokemonDetail[];
}

export interface CardItemProps {
  item: PokemonDetail;
}
