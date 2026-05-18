import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import DetailPage from './DatailPage';

vi.mock('../../components/Loader/Loader', () => ({
  default: () => <div>Loading...</div>,
}));

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>(
      'react-router-dom'
    );

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockPokemonDetail = {
  name: 'pikachu',
  weight: 60,
  height: 4,
  sprites: {
    front_default: 'pikachu.png',
  },
  types: [
    {
      type: {
        name: 'electric',
      },
    },
  ],
  abilities: [
    {
      ability: {
        name: 'static',
      },
    },
  ],
};

describe('DetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockPokemonDetail),
      } as Response)
    );
  });

  const renderDetailPage = () => {
    render(
      <MemoryRouter initialEntries={['/detail/pikachu?page=2']}>
        <Routes>
          <Route path="/detail/:name" element={<DetailPage />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('shows loader while fetching', () => {
    renderDetailPage();

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders pokemon details after successful fetch', async () => {
    renderDetailPage();

    expect(await screen.findByText('pikachu')).toBeInTheDocument();

    expect(screen.getByText('Weight: 60 kg')).toBeInTheDocument();

    expect(screen.getByText('Height: 4 dm')).toBeInTheDocument();

    expect(screen.getByText('Types: electric')).toBeInTheDocument();

    expect(screen.getByText('Abilities: static')).toBeInTheDocument();
  });

  it('renders pokemon image', async () => {
    renderDetailPage();

    const image = await screen.findByRole('img', {
      name: /pikachu/i,
    });

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'pikachu.png');
  });

  it('renders error message when fetch fails', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
      } as Response)
    );

    renderDetailPage();

    expect(
      await screen.findByText('Failed to fetch details')
    ).toBeInTheDocument();
  });

  it('calls navigate when close button is clicked', async () => {
    renderDetailPage();

    const button = await screen.findByRole('button', {
      name: /close details/i,
    });

    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith('/?page=2');
  });

  it('calls fetch with correct pokemon name', async () => {
    renderDetailPage();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon/pikachu'
      );
    });
  });
});
