// HomePage.test.tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';

// Mock child components — paths are relative to this test file's location:
// src/pages/HomePage/HomePage.test.tsx  →  ../../components/...
vi.mock('../../components/CardList/CardList', () => ({
  default: ({ list }: any) => (
    <div data-testid="card-list">
      {list.map((item: any) => (
        <div key={item.name}>{item.name}</div>
      ))}
    </div>
  ),
}));

vi.mock('../../components/Search/Search', () => ({
  default: ({ value, onChange, onSearch }: any) => (
    <div>
      <input data-testid="search-input" value={value} onChange={onChange} />
      <button onClick={onSearch}>Search</button>
    </div>
  ),
}));

vi.mock('../../components/Loader/Loader', () => ({
  default: () => <div>Loading...</div>,
}));

vi.mock('../../components/Pagination/Pagination', () => ({
  default: ({ pageNumber, onClickPrev, onClickNext }: any) => (
    <div>
      <span>Page {pageNumber}</span>
      <button onClick={onClickPrev}>Prev</button>
      <button onClick={onClickNext}>Next</button>
    </div>
  ),
}));

vi.mock('../../components/ErrorBoundary/ErrorBoundary', () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('../../components/BuggyComponent/BuggyComponent', () => ({
  default: () => <div>Buggy Component</div>,
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Renders HomePage inside a MemoryRouter with optional initial path. */
const renderHomePage = (initialEntries = ['/']) =>
  render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/" element={<HomePage />}>
          {/* Nested route used by the "outlet" test */}
          <Route path="detail/:name" element={<div>Detail Content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );

/** Default successful fetch mock — returns a list with one Pokémon. */
const mockSuccessfulFetch = () => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          results: [{ name: 'pikachu', url: 'pokemon-url' }],
          next: 'next-url',
          previous: null,
        }),
    } as Response)
  );
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSuccessfulFetch();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ── Rendering ─────────────────────────────────────────────────────────────

  it('renders loading indicator while fetch is in-flight', async () => {
    renderHomePage();

    // The Loader mock renders "Loading..." synchronously before fetch resolves.
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Wait for fetch to settle so the next test doesn't see stale state.
    await waitFor(() =>
      expect(screen.getByTestId('card-list')).toBeInTheDocument()
    );
  });

  it('renders the card list after a successful fetch', async () => {
    renderHomePage();

    await waitFor(() =>
      expect(screen.getByText('pikachu')).toBeInTheDocument()
    );

    expect(global.fetch).toHaveBeenCalled();
    expect(screen.getByTestId('card-list')).toBeInTheDocument();
  });

  it('renders pagination when the search field is empty', async () => {
    renderHomePage();

    await waitFor(() => expect(screen.getByText('Page 1')).toBeInTheDocument());
  });

  it('hides pagination while a search term is active', async () => {
    const user = userEvent.setup();
    renderHomePage();

    const input = screen.getByTestId('search-input');
    await user.type(input, 'mew');
    await user.click(screen.getByText('Search'));

    await waitFor(() =>
      expect(screen.queryByText('Page 1')).not.toBeInTheDocument()
    );
  });

  it('renders the Outlet when a detail route is active', async () => {
    renderHomePage(['/detail/pikachu']);

    await waitFor(() =>
      expect(screen.getByText('Detail Content')).toBeInTheDocument()
    );
  });

  it('renders the BuggyComponent after "Trigger Error" is clicked', async () => {
    const user = userEvent.setup();
    renderHomePage();

    await user.click(screen.getByText('Trigger Error'));

    expect(screen.getByText('Buggy Component')).toBeInTheDocument();
  });

  // ── Search ─────────────────────────────────────────────────────────────────

  it('updates the search input as the user types', async () => {
    const user = userEvent.setup();
    renderHomePage();

    const input = screen.getByTestId('search-input');
    await user.type(input, 'charizard');

    expect(input).toHaveValue('charizard');
  });

  it('fetches the typed Pokémon when Search button is clicked', async () => {
    const user = userEvent.setup();
    renderHomePage();

    const input = screen.getByTestId('search-input');
    await user.type(input, 'mew');
    await user.click(screen.getByText('Search'));

    await waitFor(() =>
      expect(global.fetch).toHaveBeenLastCalledWith(
        'https://pokeapi.co/api/v2/pokemon/mew'
      )
    );
  });

  // ── Error handling ─────────────────────────────────────────────────────────

  it('shows a "not found" message on a 404 response', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({ ok: false, status: 404 } as Response)
    );

    renderHomePage();

    await waitFor(() =>
      expect(screen.getByText(/Pokémon not found/i)).toBeInTheDocument()
    );
  });

  it('shows a generic error message on a non-404 server error', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({ ok: false, status: 500 } as Response)
    );

    renderHomePage();

    await waitFor(() =>
      expect(screen.getByText(/Server error/i)).toBeInTheDocument()
    );
  });

  it('shows an error message when fetch rejects entirely', async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error('Network failure')));

    renderHomePage();

    await waitFor(() =>
      expect(screen.getByText('Network failure')).toBeInTheDocument()
    );
  });

  // ── Pagination ─────────────────────────────────────────────────────────────

  it('increments the page number when Next is clicked', async () => {
    const user = userEvent.setup();
    renderHomePage();

    await waitFor(() => expect(screen.getByText('Page 1')).toBeInTheDocument());

    await user.click(screen.getByText('Next'));

    await waitFor(() => expect(screen.getByText('Page 2')).toBeInTheDocument());
  });

  it('does not go below page 1 when Prev is clicked on the first page', async () => {
    const user = userEvent.setup();

    // previous is null in the default mock, so Prev should be a no-op.
    renderHomePage();

    await waitFor(() => expect(screen.getByText('Page 1')).toBeInTheDocument());

    await user.click(screen.getByText('Prev'));

    // Page number must still be 1.
    expect(screen.getByText('Page 1')).toBeInTheDocument();
  });

  it('decrements the page number when Prev is clicked after navigating forward', async () => {
    const user = userEvent.setup();

    // Make both next AND previous available so the Prev button is active.
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            results: [{ name: 'bulbasaur', url: 'pokemon-url' }],
            next: 'next-url',
            previous: 'prev-url',
          }),
      } as Response)
    );

    renderHomePage();

    await waitFor(() => expect(screen.getByText('Page 1')).toBeInTheDocument());

    await user.click(screen.getByText('Next'));

    await waitFor(() => expect(screen.getByText('Page 2')).toBeInTheDocument());

    await user.click(screen.getByText('Prev'));

    await waitFor(() => expect(screen.getByText('Page 1')).toBeInTheDocument());
  });
});
