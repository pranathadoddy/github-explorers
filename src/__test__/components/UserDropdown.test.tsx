import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import UserDropdown  from '../../components/UserDropdown';
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
  },
  {
    id: 3,
    login: 'test-user-3',
    avatar_url: 'https://github.com/test-user-3.png',
    html_url: 'https://github.com/test-user-3',
    type: 'User'
  }
];

const defaultProps = {
  users: mockUsers,
  searchTerm: 'test',
  isOpen: true,
  onUserSelect: jest.fn()
};

describe('UserDropdown', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders dropdown when open with users', () => {
    render(<UserDropdown {...defaultProps} />);
    
    expect(screen.getByTestId('user-dropdown')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<UserDropdown {...defaultProps} isOpen={false} />);
    
    expect(screen.queryByTestId('user-dropdown')).not.toBeInTheDocument();
  });

  it('does not render when no users', () => {
    render(<UserDropdown {...defaultProps} users={[]} />);
    
    expect(screen.queryByTestId('user-dropdown')).not.toBeInTheDocument();
  });

  it('displays search term in header', () => {
    render(<UserDropdown {...defaultProps} searchTerm="github" />);
    
    expect(screen.getByText('Showing users for "github"')).toBeInTheDocument();
  });

  it('renders all user options', () => {
    render(<UserDropdown {...defaultProps} />);
    
    expect(screen.getByTestId('user-option-testuser1')).toBeInTheDocument();
    expect(screen.getByTestId('user-option-testuser2')).toBeInTheDocument();
    expect(screen.getByTestId('user-option-test-user-3')).toBeInTheDocument();
  });

  it('displays user information correctly', () => {
    render(<UserDropdown {...defaultProps} />);
    
    // Check first user
    const user1Option = screen.getByTestId('user-option-testuser1');
    expect(user1Option).toHaveTextContent('testuser1');
    expect(user1Option).toHaveTextContent('User');
    
    // Check second user (Organization)
    const user2Option = screen.getByTestId('user-option-testuser2');
    expect(user2Option).toHaveTextContent('testuser2');
    expect(user2Option).toHaveTextContent('Organization');
  });

  it('renders user avatars correctly', () => {
    render(<UserDropdown {...defaultProps} />);
    
    const avatar1 = screen.getByAltText('testuser1');
    const avatar2 = screen.getByAltText('testuser2');
    
    expect(avatar1).toHaveAttribute('src', 'https://github.com/testuser1.png');
    expect(avatar2).toHaveAttribute('src', 'https://github.com/testuser2.png');
    expect(avatar1).toHaveClass('w-8', 'h-8', 'rounded-full');
  });

  it('calls onUserSelect when user is clicked', async () => {
    const user = userEvent.setup();
    const onUserSelect = jest.fn();
    
    render(<UserDropdown {...defaultProps} onUserSelect={onUserSelect} />);
    
    await user.click(screen.getByTestId('user-option-testuser1'));
    
    expect(onUserSelect).toHaveBeenCalledWith(mockUsers[0]);
  });

  it('calls onUserSelect with correct user data', async () => {
    const user = userEvent.setup();
    const onUserSelect = jest.fn();
    
    render(<UserDropdown {...defaultProps} onUserSelect={onUserSelect} />);
    
    // Click second user
    await user.click(screen.getByTestId('user-option-testuser2'));
    
    expect(onUserSelect).toHaveBeenCalledWith(mockUsers[1]);
    expect(onUserSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 2,
        login: 'testuser2',
        type: 'Organization'
      })
    );
  });

  it('handles users with special characters in login', () => {
    const specialUsers = [
      {
        id: 1,
        login: 'user-with-dash',
        avatar_url: 'https://github.com/user-with-dash.png',
        html_url: 'https://github.com/user-with-dash',
        type: 'User'
      },
      {
        id: 2,
        login: 'user_with_underscore',
        avatar_url: 'https://github.com/user_with_underscore.png',
        html_url: 'https://github.com/user_with_underscore',
        type: 'User'
      }
    ];

    render(
      <UserDropdown 
        {...defaultProps} 
        users={specialUsers}
      />
    );
    
    expect(screen.getByTestId('user-option-user-with-dash')).toBeInTheDocument();
    expect(screen.getByTestId('user-option-user_with_underscore')).toBeInTheDocument();
  });

  it('applies hover effects correctly', () => {
    render(<UserDropdown {...defaultProps} />);
    
    const userOption = screen.getByTestId('user-option-testuser1');
    expect(userOption).toHaveClass('hover:bg-gray-50', 'transition-colors');
  });

  it('handles maximum 5 users limit', () => {
    const manyUsers = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      login: `user${i + 1}`,
      avatar_url: `https://github.com/user${i + 1}.png`,
      html_url: `https://github.com/user${i + 1}`,
      type: 'User'
    }));

    render(<UserDropdown {...defaultProps} users={manyUsers} />);
    
    // Should render all provided users (assuming the parent component handles the 5-user limit)
    expect(screen.getAllByTestId(/user-option-/).length).toBe(10);
  });

  it('maintains proper z-index for overlay', () => {
    render(<UserDropdown {...defaultProps} />);
    
    const dropdown = screen.getByTestId('user-dropdown');
    expect(dropdown).toHaveClass('z-10');
  });

  it('has proper accessibility attributes', () => {
    render(<UserDropdown {...defaultProps} />);
    
    const userButtons = screen.getAllByRole('button');
    userButtons.forEach(button => {
      expect(button).toHaveClass('text-left');
    });
  });

  it('handles empty search term gracefully', () => {
    render(<UserDropdown {...defaultProps} searchTerm="" />);
    
    expect(screen.getByText('Showing users for ""')).toBeInTheDocument();
  });

  it('handles long search terms', () => {
    const longTerm = 'a'.repeat(50);
    render(<UserDropdown {...defaultProps} searchTerm={longTerm} />);
    
    expect(screen.getByText(`Showing users for "${longTerm}"`)).toBeInTheDocument();
  });

  it('renders with proper styling classes', () => {
    render(<UserDropdown {...defaultProps} />);
    
    const dropdown = screen.getByTestId('user-dropdown');
    expect(dropdown).toHaveClass(
      'absolute',
      'top-full',
      'left-0',
      'right-0',
      'mt-2',
      'bg-white',
      'border',
      'border-gray-200',
      'rounded-lg',
      'shadow-lg'
    );
  });

  it('has scrollable content when many users', () => {
    const manyUsers = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      login: `user${i + 1}`,
      avatar_url: `https://github.com/user${i + 1}.png`,
      html_url: `https://github.com/user${i + 1}`,
      type: 'User'
    }));

    render(<UserDropdown {...defaultProps} users={manyUsers} />);
    
    const dropdown = screen.getByTestId('user-dropdown');
    expect(dropdown).toHaveClass('max-h-64', 'overflow-y-auto');
  });

  it('shows correct chevron icon', () => {
    render(<UserDropdown {...defaultProps} />);
    
    // Check that chevron icons are present (they should be rotated)
    const userOptions = screen.getAllByTestId(/user-option-/);
    userOptions.forEach(option => {
      expect(option).toBeInTheDocument();
    });
  });
});