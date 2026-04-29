import type { PokemonDetail } from '../types/pokemon';

export interface AppState {
  result: PokemonDetail[];
  url: string;
  error?: string | null;
  search: string;
}

export type AppProps = Record<string, never>;

export interface CardListProps {
  result: PokemonDetail[];
}

export interface CardItemProps {
  item: PokemonDetail;
}

export type SearchProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
};
