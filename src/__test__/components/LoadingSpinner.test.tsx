import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoadingSpinner from '../../components/LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders loading spinner', () => {
    const { container } = render(<LoadingSpinner />);
    
    // Find the SVG element directly
    const spinner = container.querySelector('svg');
    expect(spinner).toBeInTheDocument();
  });

  it('applies default styling classes', () => {
    const { container } = render(<LoadingSpinner />);
    
    const spinner = container.querySelector('svg');
    expect(spinner).toHaveClass('text-blue-500', 'animate-spin');
  });

  it('applies additional className when provided', () => {
    const { container } = render(<LoadingSpinner className="w-8 h-8" />);
    
    const spinner = container.querySelector('svg');
    expect(spinner).toHaveClass('w-8', 'h-8');
  });

  it('maintains spinning animation', () => {
    const { container } = render(<LoadingSpinner />);
    
    const spinner = container.querySelector('svg');
    expect(spinner).toHaveClass('animate-spin');
  });

  it('has correct color scheme', () => {
    const { container } = render(<LoadingSpinner />);
    
    const spinner = container.querySelector('svg');
    expect(spinner).toHaveClass('text-blue-500');
  });

  it('handles custom size classes', () => {
    const { container } = render(<LoadingSpinner className="w-10 h-10" />);
    
    const spinner = container.querySelector('svg');
    expect(spinner).toHaveClass('w-10', 'h-10');
  });

  it('renders with proper SVG attributes', () => {
    const { container } = render(<LoadingSpinner />);
    
    const spinner = container.querySelector('svg');
    expect(spinner).toHaveAttribute('fill', 'none');
    expect(spinner).toHaveAttribute('stroke', 'currentColor');
    expect(spinner).toHaveAttribute('viewBox', '0 0 24 24');
  });

  it('contains the loading path element', () => {
    const { container } = render(<LoadingSpinner />);
    
    const path = container.querySelector('path');
    expect(path).toBeInTheDocument();
    expect(path).toHaveAttribute('d');
  });
});