import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import CardItem from './CardItem';

import { mockPokemonResponse } from '../../test-utils/mocks';

const mockNavigate = vi.fn();
vi.mock('react-router', () => ({
  useNavigate: () => mockNavigate,
}));

describe('CardItem Component', () => {
  const defaultProps = {
    name: 'pikachu',
    url: 'https://pokeapi.co/api/v2/pokemon/pikachu',
    currentPage: 3,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ ...mockPokemonResponse, weight: 60 }),
      })
    );
  });

  const renderComponent = (props = defaultProps) => {
    return render(<CardItem {...props} />);
  };

  it('renders the capitalized name initially', () => {
    renderComponent();

    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('pikachu');
  });

  it('fetches data from the provided URL and renders the image and weight', async () => {
    renderComponent();

    expect(global.fetch).toHaveBeenCalledWith(defaultProps.url);

    await waitFor(() => {
      const pokemonImg = screen.getByRole('img', { name: /pikachu/i });
      expect(pokemonImg).toBeInTheDocument();
      expect(pokemonImg).toHaveAttribute('src', 'pikachu.png');

      expect(screen.getByText(/Weight 60 kg/i)).toBeInTheDocument();
    });
  });

  it('navigates to the details page with the current page search parameter on click', async () => {
    renderComponent();

    const cardContainer = screen
      .getByRole('heading', { level: 3 })
      .closest('div');
    expect(cardContainer).toBeInTheDocument();

    if (cardContainer) {
      fireEvent.click(cardContainer);
    }

    expect(mockNavigate).toHaveBeenCalledWith('/detail/pikachu?page=3');
  });
});
