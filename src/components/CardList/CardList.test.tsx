import { render, screen } from '../../test-utils/render';
import CardList from './CardList';

const mock = [
  { name: 'pikachu', image: '', description: '' },
  { name: 'bulbasaur', image: '', description: '' },
];

it('renders list of pokemon', () => {
  render(<CardList result={mock} />);

  expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
  expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
});
