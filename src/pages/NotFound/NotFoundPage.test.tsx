import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NotFoundPage from './NotFoundPage';

describe('NotFoundPage', () => {
  const renderPage = () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );
  };

  it('renders 404 heading', () => {
    renderPage();

    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('renders main error message', () => {
    renderPage();

    expect(
      screen.getByText(/page you are looking for was not found/i)
    ).toBeInTheDocument();
  });

  it('renders secondary explanation text', () => {
    renderPage();

    expect(screen.getByText(/It might have been removed/i)).toBeInTheDocument();
  });

  it('renders link back to home', () => {
    renderPage();

    const link = screen.getByRole('link', { name: /go back to home/i });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });
});
