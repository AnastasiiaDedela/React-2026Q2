import { render } from '../../test-utils/render';
import { vi } from 'vitest';
import BuggyComponent from './BuggyComponent';

it('throws an error when rendered', () => {
  vi.spyOn(console, 'error').mockImplementation(() => {});

  expect(() => render(<BuggyComponent />)).toThrow('Test error triggered');
});
