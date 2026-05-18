import { render, screen, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CardList from './CardList';

vi.mock('../CardItem/CardItem', () => ({
  default: ({ name, currentPage }: { name: string; currentPage: number }) => (
    <div data-testid="mock-card-item">
      <span>Name: {name}</span>
      <span>Page: {currentPage}</span>
    </div>
  ),
}));

describe('CardList Component', () => {
  const mockList = [
    { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
    { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
    { name: 'venusaur', url: 'https://pokeapi.co/api/v2/pokemon/3/' },
  ];

  it('renders a fallback message when the list prop is empty', () => {
    render(<CardList list={[]} currentPage={1} />);

    expect(screen.getByText('No Pokémon found.')).toBeInTheDocument();

    expect(screen.queryByTestId('mock-card-item')).not.toBeInTheDocument();
  });

  it('renders the correct number of CardItem components when given a list', () => {
    render(<CardList list={mockList} currentPage={2} />);

    expect(screen.queryByText('No Pokémon found.')).not.toBeInTheDocument();

    const cardItems = screen.getAllByTestId('mock-card-item');
    expect(cardItems).toHaveLength(mockList.length);
  });

  it('passes down the correct props down to each CardItem child', () => {
    const targetPage = 5;
    render(<CardList list={mockList} currentPage={targetPage} />);

    expect(screen.getByText('Name: bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('Name: ivysaur')).toBeInTheDocument();

    const cards = screen.getAllByTestId('mock-card-item');

    const firstCard = within(cards[0]);
    expect(firstCard.getByText(`Page: ${targetPage}`)).toBeInTheDocument();

    const pageLabels = screen.getAllByText(`Page: ${targetPage}`);
    expect(pageLabels).toHaveLength(mockList.length);
  });
});
