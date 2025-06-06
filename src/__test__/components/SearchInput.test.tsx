// src/__tests__/components/SearchInput.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import SearchInput  from '../../components/SearchInput';
import { GitHubUser } from '../../types/github';

const mockUsers: GitHubUser[] = [
  {
    id: 1,
    login: 'testuser1',
    avatar_url: 'https://github.com/testuser1.png',
    html_url: 'https://github.com/testuser1',
    type: 'User'
  },
  {
    id: 2,
    login: 'testuser2',
    avatar_url: 'https://github.com/testuser2.png',
    html_url: 'https://github.com/testuser2',
    type: 'Organization'
  }
];

const defaultProps = {
  searchTerm: '',
  onSearchChange: jest.fn(),
  onKeyDown: jest.fn(),
  loading: false,
  users: [],
  dropdownOpen: false,
  onUserSelect: jest.fn(),
  error: null
};

describe('SearchInput', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders search input correctly', () => {
    render(<SearchInput {...defaultProps} />);
    
    const input = screen.getByTestId('search-input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'Enter username to search...');
    expect(input).toHaveAttribute('type', 'text');
  });

  it('displays the current search term', () => {
    render(<SearchInput {...defaultProps} searchTerm="test" />);
    
    const input = screen.getByTestId('search-input');
    expect(input).toHaveValue('test');
  });

  it('calls onSearchChange when typing', async () => {
    const user = userEvent.setup();
    const onSearchChange = jest.fn();
    
    render(<SearchInput {...defaultProps} onSearchChange={onSearchChange} />);
    
    const input = screen.getByTestId('search-input');
    
    // Type each character and verify the call
    await user.type(input, 't');
    expect(onSearchChange).toHaveBeenLastCalledWith('t');
    
    await user.type(input, 'e');
    expect(onSearchChange).toHaveBeenLastCalledWith('e');
    
    await user.type(input, 's');
    expect(onSearchChange).toHaveBeenLastCalledWith('s');
    
    await user.type(input, 't');
    expect(onSearchChange).toHaveBeenLastCalledWith('t');
    
    expect(onSearchChange).toHaveBeenCalledTimes(4);
  });

  it('calls onSearchChange when input value changes', () => {
    const onSearchChange = jest.fn();
    
    render(<SearchInput {...defaultProps} onSearchChange={onSearchChange} />);
    
    const input = screen.getByTestId('search-input');
    
    // Simulate direct input change
    fireEvent.change(input, { target: { value: 'test' } });
    
    expect(onSearchChange).toHaveBeenCalledWith('test');
    expect(onSearchChange).toHaveBeenCalledTimes(1);
  });

  it('handles multiple character input changes', () => {
    const onSearchChange = jest.fn();
    
    render(<SearchInput {...defaultProps} onSearchChange={onSearchChange} />);
    
    const input = screen.getByTestId('search-input');
    
    // Simulate typing by changing the input value step by step
    fireEvent.change(input, { target: { value: 'a' } });
    expect(onSearchChange).toHaveBeenLastCalledWith('a');
    
    fireEvent.change(input, { target: { value: 'ab' } });
    expect(onSearchChange).toHaveBeenLastCalledWith('ab');
    
    fireEvent.change(input, { target: { value: 'abc' } });
    expect(onSearchChange).toHaveBeenLastCalledWith('abc');
    
    expect(onSearchChange).toHaveBeenCalledTimes(3);
  });

  it('calls onKeyDown when pressing keys', () => {
    const onKeyDown = jest.fn();
    
    render(<SearchInput {...defaultProps} onKeyDown={onKeyDown} />);
    
    const input = screen.getByTestId('search-input');
    fireEvent.keyDown(input, { key: 'Escape' });
    
    expect(onKeyDown).toHaveBeenCalledWith(expect.objectContaining({
      key: 'Escape'
    }));
  });

  it('shows loading spinner when loading', () => {
    const { container } = render(<SearchInput {...defaultProps} loading={true} />);
    
    const input = screen.getByTestId('search-input');
    expect(input).toBeInTheDocument();
    
    // Check for loading spinner (SVG with animate-spin class)
    const spinner = container.querySelector('svg.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('displays error message when error exists', () => {
    render(<SearchInput {...defaultProps} error="Search failed" />);
    
    expect(screen.getByText('Search failed')).toBeInTheDocument();
  });

  it('does not display error when error is null', () => {
    render(<SearchInput {...defaultProps} error={null} />);
    
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/failed/i)).not.toBeInTheDocument();
  });

  it('shows dropdown when open and users exist', () => {
    render(
      <SearchInput
        {...defaultProps}
        users={mockUsers}
        dropdownOpen={true}
        searchTerm="test"
      />
    );
    
    expect(screen.getByTestId('user-dropdown')).toBeInTheDocument();
    expect(screen.getByTestId('user-option-testuser1')).toBeInTheDocument();
    expect(screen.getByTestId('user-option-testuser2')).toBeInTheDocument();
  });

  it('does not show dropdown when closed', () => {
    render(
      <SearchInput
        {...defaultProps}
        users={mockUsers}
        dropdownOpen={false}
        searchTerm="test"
      />
    );
    
    expect(screen.queryByTestId('user-dropdown')).not.toBeInTheDocument();
  });

  it('does not show dropdown when no users', () => {
    render(
      <SearchInput
        {...defaultProps}
        users={[]}
        dropdownOpen={true}
        searchTerm="test"
      />
    );
    
    expect(screen.queryByTestId('user-dropdown')).not.toBeInTheDocument();
  });

  it('calls onUserSelect when user is clicked', async () => {
    const user = userEvent.setup();
    const onUserSelect = jest.fn();
    
    render(
      <SearchInput
        {...defaultProps}
        users={mockUsers}
        dropdownOpen={true}
        searchTerm="test"
        onUserSelect={onUserSelect}
      />
    );
    
    await user.click(screen.getByTestId('user-option-testuser1'));
    
    expect(onUserSelect).toHaveBeenCalledWith(mockUsers[0]);
  });

  it('displays search term in dropdown header', () => {
    render(
      <SearchInput
        {...defaultProps}
        users={mockUsers}
        dropdownOpen={true}
        searchTerm="test-query"
      />
    );
    
    expect(screen.getByText('Showing users for "test-query"')).toBeInTheDocument();
  });

  it('handles multiple user types in dropdown', () => {
    render(
      <SearchInput
        {...defaultProps}
        users={mockUsers}
        dropdownOpen={true}
        searchTerm="test"
      />
    );
    
    expect(screen.getByText('User')).toBeInTheDocument();
    expect(screen.getByText('Organization')).toBeInTheDocument();
  });

  it('renders user avatars in dropdown', () => {
    render(
      <SearchInput
        {...defaultProps}
        users={mockUsers}
        dropdownOpen={true}
        searchTerm="test"
      />
    );
    
    const avatar1 = screen.getByAltText('testuser1');
    const avatar2 = screen.getByAltText('testuser2');
    
    expect(avatar1).toHaveAttribute('src', 'https://github.com/testuser1.png');
    expect(avatar2).toHaveAttribute('src', 'https://github.com/testuser2.png');
  });

  it('maintains focus on input after interactions', async () => {
    const user = userEvent.setup();
    
    render(<SearchInput {...defaultProps} />);
    
    const input = screen.getByTestId('search-input');
    await user.click(input);
    
    expect(input).toHaveFocus();
  });

  it('handles empty search term correctly', () => {
    render(<SearchInput {...defaultProps} searchTerm="" />);
    
    const input = screen.getByTestId('search-input');
    expect(input).toHaveValue('');
  });

  it('handles long search terms', () => {
    const longTerm = 'a'.repeat(100);
    render(<SearchInput {...defaultProps} searchTerm={longTerm} />);
    
    const input = screen.getByTestId('search-input');
    expect(input).toHaveValue(longTerm);
  });

  it('handles special characters in search term', () => {
    const specialTerm = 'test-user_123@domain.com';
    render(<SearchInput {...defaultProps} searchTerm={specialTerm} />);
    
    const input = screen.getByTestId('search-input');
    expect(input).toHaveValue(specialTerm);
  });

  it('applies correct CSS classes', () => {
    render(<SearchInput {...defaultProps} />);
    
    const input = screen.getByTestId('search-input');
    expect(input).toHaveClass('w-full', 'pl-10', 'pr-4', 'py-3');
  });

  it('shows error with proper styling', () => {
    render(<SearchInput {...defaultProps} error="Network error" />);
    
    const errorElement = screen.getByText('Network error');
    expect(errorElement.closest('div')).toHaveClass('text-red-600', 'bg-red-50');
  });

  it('handles input clearing', () => {
    const onSearchChange = jest.fn();
    
    render(<SearchInput {...defaultProps} searchTerm="test" onSearchChange={onSearchChange} />);
    
    const input = screen.getByTestId('search-input');
    
    // Simulate clearing the input
    fireEvent.change(input, { target: { value: '' } });
    
    expect(onSearchChange).toHaveBeenCalledWith('');
  });

  it('simulates realistic typing behavior', () => {
    const onSearchChange = jest.fn();
    
    render(<SearchInput {...defaultProps} onSearchChange={onSearchChange} />);
    
    const input = screen.getByTestId('search-input');
    
    // Simulate realistic typing by building up the string
    const word = 'github';
    for (let i = 1; i <= word.length; i++) {
      const currentValue = word.substring(0, i);
      fireEvent.change(input, { target: { value: currentValue } });
      expect(onSearchChange).toHaveBeenLastCalledWith(currentValue);
    }
    
    expect(onSearchChange).toHaveBeenCalledTimes(6);
  });
});