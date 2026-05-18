import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout';

vi.mock('../components/NavBar/NavBar', () => ({
  default: () => <nav data-testid="mock-navbar">Mocked NavBar</nav>,
}));

describe('Layout Component', () => {
  it('renders the NavBar and the nested child routes via Outlet', () => {
    render(
      <MemoryRouter initialEntries={['/test-route']}>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Define a dummy element to test the <Outlet /> rendering */}
            <Route path="test-route" element={<div>Child Route Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    const navBar = screen.getByTestId('mock-navbar');
    expect(navBar).toBeInTheDocument();
    expect(screen.getByText('Mocked NavBar')).toBeInTheDocument();

    const childContent = screen.getByText('Child Route Content');
    expect(childContent).toBeInTheDocument();
  });

  it('maintains the correct wrapper classes for styling layout boundaries', () => {
    const { container } = render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Layout />} />
        </Routes>
      </MemoryRouter>
    );

    const outerWrapper = container.firstChild;
    expect(outerWrapper).toHaveClass('min-h-screen', 'bg-gray-100', 'p-6');
  });
});
