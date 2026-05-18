import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import NavBar from './NavBar';

describe('NavBar', () => {
  const renderNavBar = () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    );
  };

  it('renders the website title', () => {
    renderNavBar();

    expect(screen.getByText('Pokemon.org')).toBeInTheDocument();
  });

  it('renders Home link', () => {
    renderNavBar();

    const homeLink = screen.getByRole('link', { name: /home/i });

    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('renders About link', () => {
    renderNavBar();

    const aboutLink = screen.getByRole('link', { name: /about/i });

    expect(aboutLink).toBeInTheDocument();
    expect(aboutLink).toHaveAttribute('href', '/about');
  });

  it('renders exactly two navigation links', () => {
    renderNavBar();

    const links = screen.getAllByRole('link');

    expect(links).toHaveLength(2);
  });
});
