import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import HomePage from './HomePage';

import { mockPokemonListResponse } from '../../test-utils/mocks';

vi.mock('../../components/Search/Search', () => ({
  default: ({
    value,
    onChange,
    onSearch,
  }: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSearch: () => void;
  }) => (
    <div>
      <input data-testid="search-input" value={value} onChange={onChange} />
      <button onClick={onSearch}>Search</button>
    </div>
  ),
}));

vi.mock('../../components/CardList/CardList', () => ({
  default: ({ list }: { list: { name: string }[] }) => (
    <div data-testid="card-list">
      {list.map((pokemon) => (
        <p key={pokemon.name}>{pokemon.name}</p>
      ))}
    </div>
  ),
}));

vi.mock('../../components/Loader/Loader', () => ({
  default: () => <div>Loading...</div>,
}));

vi.mock('../../components/Pagination/Pagination', () => ({
  default: ({
    onClickPrev,
    onClickNext,
  }: {
    onClickPrev: () => void;
    onClickNext: () => void;
  }) => (
    <div>
      <button onClick={onClickPrev}>Prev</button>
      <button onClick={onClickNext}>Next</button>
    </div>
  ),
}));

vi.mock('../../components/ErrorBoundary/ErrorBoundary', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock('../../components/BuggyComponent/BuggyComponent', () => ({
  default: () => <div>Buggy Component</div>,
}));

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    Storage.prototype.getItem = vi.fn(() => '');
    Storage.prototype.setItem = vi.fn();
    Storage.prototype.removeItem = vi.fn();

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockPokemonListResponse),
      } as Response)
    );
  });

  const renderHomePage = () => {
    render(
      <MemoryRouter initialEntries={['/?page=1']}>
        <Routes>
          <Route path="/" element={<HomePage />}>
            <Route path="detail/:name" element={<div>Detail Page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
  };

  it('renders pokemon list after successful fetch', async () => {
    renderHomePage();

    expect(await screen.findByText('pikachu')).toBeInTheDocument();
  });

  it('shows loader while fetching data', () => {
    renderHomePage();

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders error message when fetch fails', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 404,
      } as Response)
    );

    renderHomePage();

    expect(await screen.findByText(/Pokémon not found/i)).toBeInTheDocument();
  });

  it('updates search input value', async () => {
    renderHomePage();

    const input = screen.getByTestId('search-input');

    fireEvent.change(input, {
      target: { value: 'pikachu' },
    });

    expect(input).toHaveValue('pikachu');
  });

  it('calls localStorage.setItem on search', async () => {
    renderHomePage();

    const input = screen.getByTestId('search-input');

    fireEvent.change(input, {
      target: { value: 'pikachu' },
    });

    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'pokemonSearch',
        'pikachu'
      );
    });
  });

  it('renders pagination when search is empty', async () => {
    renderHomePage();

    expect(await screen.findByText('Next')).toBeInTheDocument();
    expect(screen.getByText('Prev')).toBeInTheDocument();
  });

  it('renders buggy component after clicking trigger error button', async () => {
    renderHomePage();

    const button = screen.getByText('Trigger Error');

    fireEvent.click(button);

    expect(await screen.findByText('Buggy Component')).toBeInTheDocument();
  });

  it('renders outlet when route contains pokemon name', async () => {
    render(
      <MemoryRouter initialEntries={['/detail/pikachu?page=1']}>
        <Routes>
          <Route path="/" element={<HomePage />}>
            <Route path="detail/:name" element={<div>Detail Page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText('Detail Page')).toBeInTheDocument();
  });
});
