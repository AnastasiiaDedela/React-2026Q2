import { vi } from 'vitest';
import { render, screen } from '../../test-utils/render';
import ErrorBoundary from './ErrorBoundary';

const Crash = () => {
  throw new Error('fail');
};

it('shows fallback UI', () => {
  vi.spyOn(console, 'error').mockImplementation(() => {});

  render(
    <ErrorBoundary>
      <Crash />
    </ErrorBoundary>
  );

  expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
});
