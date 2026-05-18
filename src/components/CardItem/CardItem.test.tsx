// CardItem.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import CardItem from './CardItem';

// Mock useNavigate
const mockNavigate = vi.fn();

vi.mock('react-router', async () => {
  const actual =
    await vi.importActual<typeof import('react-router')>('react-router');

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('CardItem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders pokemon name', () => {
    render(
      <MemoryRouter>
        <CardItem
          name="pikachu"
          url="https://pokeapi.co/api/v2/pokemon/pikachu"
        />
      </MemoryRouter>
    );

    expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
  });

  it('fetches and displays pokemon data', async () => {
    const mockData = {
      sprites: {
        front_default: 'pikachu.png',
      },
      weight: 60,
    };

    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockData),
      } as Response)
    );

    render(
      <MemoryRouter>
        <CardItem
          name="pikachu"
          url="https://pokeapi.co/api/v2/pokemon/pikachu"
        />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByAltText('pikachu')).toHaveAttribute(
        'src',
        'pikachu.png'
      );
    });

    expect(screen.getByText(/Weight 60 kg/i)).toBeInTheDocument();

    expect(global.fetch).toHaveBeenCalledWith(
      'https://pokeapi.co/api/v2/pokemon/pikachu'
    );
  });

  it('navigates to detail page on click', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <CardItem
          name="pikachu"
          url="https://pokeapi.co/api/v2/pokemon/pikachu"
        />
      </MemoryRouter>
    );

    const card = screen.getByText(/pikachu/i).closest('div');

    await user.click(card!);

    expect(mockNavigate).toHaveBeenCalledWith('/detail/pikachu');
  });
});
