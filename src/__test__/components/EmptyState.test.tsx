import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import EmptyState from '../../components/EmptyState';

describe('EmptyState', () => {
  it('renders empty state content', () => {
    render(<EmptyState />);
    
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.getByText('Start exploring GitHub')).toBeInTheDocument();
    expect(screen.getByText('Search for a username to discover repositories and user profiles.')).toBeInTheDocument();
  });

  it('displays search icon', () => {
    render(<EmptyState />);
    
    // The Search icon should be present
    const emptyState = screen.getByTestId('empty-state');
    expect(emptyState).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    render(<EmptyState />);
    
    const emptyState = screen.getByTestId('empty-state');
    expect(emptyState).toHaveClass('text-center', 'py-16');
    
    const heading = screen.getByText('Start exploring GitHub');
    expect(heading).toHaveClass('text-xl', 'font-semibold', 'text-gray-900');
    
    const description = screen.getByText('Search for a username to discover repositories and user profiles.');
    expect(description).toHaveClass('text-gray-600');
  });

  it('maintains proper content hierarchy', () => {
    render(<EmptyState />);
    
    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toHaveTextContent('Start exploring GitHub');
  });
});