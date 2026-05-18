// HomePage.test.tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';

// Mock child components
vi.mock('../components/CardList/CardList', () => ({
  default: ({ list }: any) => (
    <div data-testid="card-list">
      {list.map((item: any) => (
        <div key={item.name}>{item.name}</div>
      ))}
    </div>
  ),
}));

vi.mock('../components/Search/Search', () => ({
  default: ({ value, onChange, onSearch }: any) => (
    <div>
      <input data-testid="search-input" value={value} onChange={onChange} />
      <button onClick={onSearch}>Search</button>
    </div>
  ),
}));

vi.mock('../components/Loader/Loader', () => ({
  default: () => <div>Loading...</div>,
}));

vi.mock('../components/Pagination/Pagination', () => ({
  default: ({ pageNumber, onClickPrev, onClickNext }: any) => (
    <div>
      <span>Page {pageNumber}</span>
      <button onClick={onClickPrev}>Prev</button>
      <button onClick={onClickNext}>Next</button>
    </div>
  ),
}));

vi.mock('../components/ErrorBoundary/ErrorBoundary', () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('../components/BuggyComponent/BuggyComponent', () => ({
  default: () => <div>Buggy Component</div>,
}));

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            results: [
              {
                name: 'pikachu',
                url: 'pokemon-url',
              },
            ],
            next: 'next-url',
            previous: null,
          }),
      } as Response)
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders loading initially', async () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId('card-list')).toBeInTheDocument();
    });
  });

  it('fetches and renders pokemon list', async () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('pikachu')).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalled();
  });

  it('updates search input value', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    const input = screen.getByTestId('search-input');

    await user.type(input, 'charizard');

    expect(input).toHaveValue('charizard');
  });

  it('calls pokemon search on button click', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    const input = screen.getByTestId('search-input');

    await user.type(input, 'mew');

    await user.click(screen.getByText('Search'));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenLastCalledWith(
        'https://pokeapi.co/api/v2/pokemon/mew'
      );
    });
  });

  it('renders error message on failed fetch', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 404,
      } as Response)
    );

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Pokémon not found/i)).toBeInTheDocument();
    });
  });

  it('renders buggy component after trigger error click', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    await user.click(screen.getByText('Trigger Error'));

    expect(screen.getByText('Buggy Component')).toBeInTheDocument();
  });

  it('renders outlet content when route has name param', async () => {
    render(
      <MemoryRouter initialEntries={['/detail/pikachu']}>
        <Routes>
          <Route path="/" element={<HomePage />}>
            <Route path="detail/:name" element={<div>Detail Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Detail Content')).toBeInTheDocument();
    });
  });

  it('renders pagination when search is empty', async () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Page 1/i)).toBeInTheDocument();
    });
  });
});
