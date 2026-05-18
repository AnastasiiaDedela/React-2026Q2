import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CardList from '../CardList/CardList';

vi.mock('../CardItem/CardItem', () => ({
  default: ({ name, url }: { name: string; url: string }) => (
    <div data-testid="card-item">
      <span>{name}</span>
      <span>{url}</span>
    </div>
  ),
}));

describe('CardList', () => {
  const mockList = [
    {
      name: 'pikachu',
      url: 'https://pokeapi.co/api/v2/pokemon/pikachu',
    },
    {
      name: 'bulbasaur',
      url: 'https://pokeapi.co/api/v2/pokemon/bulbasaur',
    },
    {
      name: 'charmander',
      url: 'https://pokeapi.co/api/v2/pokemon/charmander',
    },
  ];

  it('renders all CardItem components', () => {
    render(<CardList list={mockList} currentPage={0} />);

    const cards = screen.getAllByTestId('card-item');

    expect(cards).toHaveLength(3);
  });

  it('passes correct props to CardItem', () => {
    render(<CardList list={mockList} currentPage={0} />);

    expect(screen.getByText('pikachu')).toBeInTheDocument();
    expect(
      screen.getByText('https://pokeapi.co/api/v2/pokemon/pikachu')
    ).toBeInTheDocument();

    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    expect(
      screen.getByText('https://pokeapi.co/api/v2/pokemon/bulbasaur')
    ).toBeInTheDocument();

    expect(screen.getByText('charmander')).toBeInTheDocument();
    expect(
      screen.getByText('https://pokeapi.co/api/v2/pokemon/charmander')
    ).toBeInTheDocument();
  });

  it('renders empty list correctly', () => {
    render(<CardList list={[]} currentPage={0} />);

    const cards = screen.queryAllByTestId('card-item');

    expect(cards).toHaveLength(0);
  });

  it('has correct grid layout classes', () => {
    const { container } = render(<CardList list={mockList} currentPage={0} />);

    const wrapper = container.firstChild;

    expect(wrapper).toHaveClass('grid');
    expect(wrapper).toHaveClass('grid-cols-3');
    expect(wrapper).toHaveClass('gap-4');
  });
});
