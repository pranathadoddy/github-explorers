import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorDisplay from '../../components/ErrorDisplay';

describe('ErrorDisplay', () => {
  it('renders error message correctly', () => {
    render(<ErrorDisplay error="Something went wrong" />);
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('displays alert icon', () => {
    render(<ErrorDisplay error="Error message" />);
    
    // The AlertCircle icon should be present
    const errorContainer = screen.getByText('Error message').closest('div');
    expect(errorContainer).toHaveClass('text-red-600', 'bg-red-50');
  });

  it('applies default styling classes', () => {
    render(<ErrorDisplay error="Error message" />);
    
    const errorContainer = screen.getByText('Error message').closest('div');
    expect(errorContainer).toHaveClass(
      'flex',
      'items-center',
      'gap-2',
      'text-red-600',
      'bg-red-50',
      'p-3',
      'rounded-lg'
    );
  });

  it('applies additional className when provided', () => {
    render(<ErrorDisplay error="Error message" className="mt-4" />);
    
    const errorContainer = screen.getByText('Error message').closest('div');
    expect(errorContainer).toHaveClass('mt-4');
  });

  it('handles long error messages', () => {
    const longError = 'This is a very long error message that should still be displayed correctly without breaking the layout or causing any visual issues';
    
    render(<ErrorDisplay error={longError} />);
    
    expect(screen.getByText(longError)).toBeInTheDocument();
  });

  it('handles error messages with special characters', () => {
    const specialError = 'Error: API call failed with status 404 - "Resource not found" at /api/users';
    
    render(<ErrorDisplay error={specialError} />);
    
    expect(screen.getByText(specialError)).toBeInTheDocument();
  });

  it('maintains proper accessibility', () => {
    render(<ErrorDisplay error="Accessibility test error" />);
    
    const errorContainer = screen.getByText('Accessibility test error').closest('div');
    expect(errorContainer).toBeInTheDocument();
  });
});