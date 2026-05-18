// App.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Outlet } from 'react-router-dom';
import App from './App';

// Mock layout
vi.mock('./Layout/Layout', () => ({
  default: () => (
    <div>
      Layout Component
      <Outlet />
    </div>
  ),
}));

// Mock pages
vi.mock('./pages/HomePage', () => ({
  default: () => (
    <div>
      Home Page
      <Outlet />
    </div>
  ),
}));

vi.mock('./pages/AboutPage', () => ({
  default: () => <div>About Page</div>,
}));

vi.mock('./pages/DatailPage', () => ({
  default: () => <div>Detail Page</div>,
}));

describe('App routing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders home page on "/" route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('Layout Component')).toBeInTheDocument();
    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });

  it('renders about page on "/about"', () => {
    render(
      <MemoryRouter initialEntries={['/about']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('About Page')).toBeInTheDocument();
  });

  it('renders detail page on nested route', () => {
    render(
      <MemoryRouter initialEntries={['/detail/pikachu']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('Home Page')).toBeInTheDocument();
    expect(screen.getByText('Detail Page')).toBeInTheDocument();
  });
});
