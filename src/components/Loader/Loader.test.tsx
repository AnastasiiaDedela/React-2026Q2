import { render } from '../../test-utils/render';
import Loader from './Loader';

it('renders loader', () => {
  const { container } = render(<Loader />);

  expect(container.firstChild).toBeInTheDocument();
});
