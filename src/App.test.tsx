import { render, screen } from './test-utils/render';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import App from './App';

import {
  mockPokemonListResponse,
  mockPokemonResponse,
  mockSpeciesResponse,
} from './test-utils/mocks';

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();

    vi.stubGlobal(
      'fetch',
      vi.fn((url: string) => {
        if (url.includes('pokemon?')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockPokemonListResponse),
          });
        }
        if (url.includes('pokemon-species')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockSpeciesResponse),
          });
        }

        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockPokemonResponse),
        });
      })
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders search input', () => {
    render(<App />);

    expect(screen.getByPlaceholderText(/search pokémon/i)).toBeInTheDocument();
  });

  it('loads and renders pokemon card', async () => {
    render(<App />);

    expect(await screen.findByText(/pikachu/i)).toBeInTheDocument();

    expect(screen.getByText(/electric mouse pokemon/i)).toBeInTheDocument();
  });

  it('saves pokemon search to localStorage', async () => {
    render(<App />);

    const input = screen.getByPlaceholderText(/search pokémon/i);

    await userEvent.type(input, 'pikachu');

    await userEvent.click(
      screen.getByRole('button', {
        name: /search/i,
      })
    );

    expect(localStorage.getItem('pokemonSearch')).toBe('pikachu');
  });

  it('loads pokemon from localStorage on mount', async () => {
    localStorage.setItem('pokemonSearch', 'pikachu');

    render(<App />);

    expect(await screen.findByText(/pikachu/i)).toBeInTheDocument();
  });

  it('shows error message when api request fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 404,
        })
      )
    );

    render(<App />);

    expect(await screen.findByText(/pokémon not found/i)).toBeInTheDocument();
  });

  it('shows error boundary fallback when buggy component crashes', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<App />);

    await userEvent.click(
      screen.getByRole('button', {
        name: /trigger error/i,
      })
    );

    expect(
      await screen.findByText(/something went wrong/i)
    ).toBeInTheDocument();
  });
});
