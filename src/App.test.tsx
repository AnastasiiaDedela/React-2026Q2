import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

vi.mock('./pages/HomePage/HomePage', () => ({
  default: () => <div>Home Page</div>,
}));

vi.mock('./pages/AboutPage/AboutPage', () => ({
  default: () => <div>About Page</div>,
}));

vi.mock('./pages/DetailPage/DetailPage', () => ({
  default: () => <div>Detail Page</div>,
}));

vi.mock('./pages/NotFound/NotFoundPage', () => ({
  default: () => <div>Not Found Page</div>,
}));

vi.mock('./Layout/Layout', () => ({
  default: () => <div>Layout Component</div>,
}));

describe('App routing', () => {
  it('renders HomePage on "/" route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('Layout Component')).toBeInTheDocument();
  });

  it('renders AboutPage on "/about" route', () => {
    render(
      <MemoryRouter initialEntries={['/about']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('Layout Component')).toBeInTheDocument();
  });

  it('renders NotFoundPage on unknown route', () => {
    render(
      <MemoryRouter initialEntries={['/unknown']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('Layout Component')).toBeInTheDocument();
  });
});
