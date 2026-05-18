import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AboutPage from './AboutPage';

describe('AboutPage', () => {
  it('renders the main heading', () => {
    render(<AboutPage />);

    expect(screen.getByText('React developer in training')).toBeInTheDocument();
  });

  it('renders the student description', () => {
    render(<AboutPage />);

    expect(
      screen.getByText('RS School — React course student')
    ).toBeInTheDocument();
  });

  it('renders the about text', () => {
    render(<AboutPage />);

    expect(screen.getByText(/Hi, my name is Ana/i)).toBeInTheDocument();
  });

  it('renders all info cards', () => {
    render(<AboutPage />);

    expect(screen.getByText('learning')).toBeInTheDocument();
    expect(screen.getByText('React & TypeScript')).toBeInTheDocument();

    expect(screen.getByText('built with')).toBeInTheDocument();
    expect(screen.getByText('PokéAPI + Tailwind')).toBeInTheDocument();

    expect(screen.getByText('platform')).toBeInTheDocument();
    expect(screen.getByText('RS School')).toBeInTheDocument();
  });

  it('renders the external RS School link', () => {
    render(<AboutPage />);

    const link = screen.getByRole('link', {
      name: /rs.school\/courses\/reactjs/i,
    });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://rs.school/courses/reactjs');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noreferrer');
  });

  it('renders initials avatar', () => {
    render(<AboutPage />);

    expect(screen.getByText('RS')).toBeInTheDocument();
  });
});
