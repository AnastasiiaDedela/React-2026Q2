import { render, screen } from '../../test-utils/render';
import CardItem from './CardItem';

it('renders pokemon data', () => {
  render(
    <CardItem
      item={{
        name: 'pikachu',
        image: 'img.png',
        description: 'electric mouse',
      }}
    />
  );

  expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
  expect(screen.getByText(/electric mouse/i)).toBeInTheDocument();
});
