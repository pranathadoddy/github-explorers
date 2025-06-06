import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '../../components/Header';

describe('Header', () => {
  it('renders main title', () => {
    render(<Header />);
    
    expect(screen.getByText('GitHub Explorer')).toBeInTheDocument();
  });

  it('renders subtitle', () => {
    render(<Header />);
    
    expect(screen.getByText('Discover GitHub users and explore their repositories')).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    render(<Header />);
    
    const title = screen.getByText('GitHub Explorer');
    expect(title).toHaveClass('text-2xl', 'sm:text-4xl', 'font-bold', 'text-gray-900');
    
    const subtitle = screen.getByText('Discover GitHub users and explore their repositories');
    expect(subtitle).toHaveClass('text-sm', 'sm:text-base', 'text-gray-600');
  });

  it('has responsive design classes', () => {
    const { container } = render(<Header />);
    
    const headerContainer = container.firstChild;
    expect(headerContainer).toHaveClass('text-center', 'mb-6', 'sm:mb-8');
  });

  it('maintains proper heading hierarchy', () => {
    render(<Header />);
    
    const title = screen.getByRole('heading', { level: 1 });
    expect(title).toHaveTextContent('GitHub Explorer');
  });
});
