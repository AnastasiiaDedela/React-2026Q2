import { render, screen } from '../../test-utils/render.tsx';
import userEvent from '@testing-library/user-event';
import Search from './Search.tsx';
import { vi } from 'vitest';

describe('Search', () => {
  it('renders input and button', () => {
    render(<Search value="" onChange={vi.fn()} onSearch={vi.fn()} />);

    expect(screen.getByPlaceholderText(/search pokémon/i)).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls onSearch on button click', async () => {
    const onSearch = vi.fn();

    render(<Search value="" onChange={vi.fn()} onSearch={onSearch} />);

    await userEvent.click(screen.getByRole('button'));

    expect(onSearch).toHaveBeenCalled();
  });

  it('calls onSearch when Enter is pressed', async () => {
    const onSearch = vi.fn();

    render(<Search value="pikachu" onChange={vi.fn()} onSearch={onSearch} />);

    const input = screen.getByPlaceholderText(/search pokémon/i);

    await userEvent.click(input);
    await userEvent.keyboard('{Enter}');

    expect(onSearch).toHaveBeenCalled();
  });

  it('calls onChange when typing', async () => {
    const onChange = vi.fn();

    render(<Search value="" onChange={onChange} onSearch={vi.fn()} />);

    const input = screen.getByPlaceholderText(/search pokémon/i);

    await userEvent.type(input, 'pika');

    expect(onChange).toHaveBeenCalled();
  });
});
