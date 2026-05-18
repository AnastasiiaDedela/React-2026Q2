import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Pagination from './Pagination';

describe('Pagination Component', () => {
  it('renders the correct page number text passed by props', () => {
    render(
      <Pagination pageNumber={42} onClickPrev={vi.fn()} onClickNext={vi.fn()} />
    );

    const displayPage = screen.getByText('42');
    expect(displayPage).toBeInTheDocument();
  });

  it('triggers the onClickPrev callback when the Previous button is clicked', () => {
    const mockClickPrev = vi.fn();

    render(
      <Pagination
        pageNumber={1}
        onClickPrev={mockClickPrev}
        onClickNext={vi.fn()}
      />
    );

    const prevButton = screen.getByRole('button', { name: /← previous/i });
    fireEvent.click(prevButton);

    expect(mockClickPrev).toHaveBeenCalledTimes(1);
  });

  it('triggers the onClickNext callback when the Next button is clicked', () => {
    const mockClickNext = vi.fn();

    render(
      <Pagination
        pageNumber={1}
        onClickPrev={vi.fn()}
        onClickNext={mockClickNext}
      />
    );

    const nextButton = screen.getByRole('button', { name: /next →/i });
    fireEvent.click(nextButton);

    expect(mockClickNext).toHaveBeenCalledTimes(1);
  });
});
