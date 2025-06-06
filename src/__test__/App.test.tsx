// src/__tests__/App.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import App from '../App';

// Mock the GitHubService module completely
jest.mock('../services/GitHubService', () => ({
  GitHubService: {
    searchUsers: jest.fn(),
    getUserRepositories: jest.fn(),
  },
}));

// Import the mocked service to get access to the mock functions
import { GitHubService } from '../services/GithubService';

// Type the mocked functions for better TypeScript support
const mockSearchUsers = GitHubService.searchUsers as jest.MockedFunction<typeof GitHubService.searchUsers>;
const mockGetUserRepositories = GitHubService.getUserRepositories as jest.MockedFunction<typeof GitHubService.getUserRepositories>;

// Mock data
const mockUsers = [
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
    type: 'User'
  }
];

const mockRepositories = [
  {
    id: 1,
    name: 'test-repo-1',
    full_name: 'testuser1/test-repo-1',
    description: 'A test repository',
    html_url: 'https://github.com/testuser1/test-repo-1',
    stargazers_count: 10,
    forks_count: 5,
    watchers_count: 3,
    language: 'JavaScript',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-06-01T00:00:00Z',
    private: false
  },
  {
    id: 2,
    name: 'test-repo-2',
    full_name: 'testuser1/test-repo-2',
    description: null,
    html_url: 'https://github.com/testuser1/test-repo-2',
    stargazers_count: 0,
    forks_count: 0,
    watchers_count: 0,
    language: 'TypeScript',
    created_at: '2023-02-01T00:00:00Z',
    updated_at: '2023-05-01T00:00:00Z',
    private: true
  }
];

describe('GitHub Explorer App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchUsers.mockResolvedValue(mockUsers);
    mockGetUserRepositories.mockResolvedValue(mockRepositories);
  });

  it('renders the main components', () => {
    render(<App />);
    
    expect(screen.getByText('GitHub Explorer')).toBeInTheDocument();
    expect(screen.getByText('Discover GitHub users and explore their repositories')).toBeInTheDocument();
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });

  it('shows empty state when no user is selected', () => {
    render(<App />);
    
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.getByText('Start exploring GitHub')).toBeInTheDocument();
  });

  it('searches for users when typing in the search input', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const searchInput = screen.getByTestId('search-input');
    
    await act(async () => {
      await user.type(searchInput, 'test');
    });

    await waitFor(() => {
      expect(mockSearchUsers).toHaveBeenCalledWith('test');
    });
  });

  it('displays user dropdown when users are found', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const searchInput = screen.getByTestId('search-input');
    
    await act(async () => {
      await user.type(searchInput, 'test');
    });

    await waitFor(() => {
      expect(screen.getByTestId('user-dropdown')).toBeInTheDocument();
      expect(screen.getByTestId('user-option-testuser1')).toBeInTheDocument();
      expect(screen.getByTestId('user-option-testuser2')).toBeInTheDocument();
    });
  });

  it('selects a user and fetches repositories', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const searchInput = screen.getByTestId('search-input');
    
    await act(async () => {
      await user.type(searchInput, 'test');
    });

    await waitFor(() => {
      expect(screen.getByTestId('user-dropdown')).toBeInTheDocument();
    });

    await act(async () => {
      await user.click(screen.getByTestId('user-option-testuser1'));
    });

    await waitFor(() => {
      expect(mockGetUserRepositories).toHaveBeenCalledWith('testuser1');
      expect(screen.getByTestId('user-profile')).toBeInTheDocument();
      expect(screen.getByTestId('user-login')).toHaveTextContent('testuser1');
    });
  });

  it('displays repositories after selecting a user', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const searchInput = screen.getByTestId('search-input');
    
    await act(async () => {
      await user.type(searchInput, 'test');
    });

    await waitFor(() => {
      expect(screen.getByTestId('user-dropdown')).toBeInTheDocument();
    });

    await act(async () => {
      await user.click(screen.getByTestId('user-option-testuser1'));
    });

    await waitFor(() => {
      expect(screen.getByTestId('repositories-grid')).toBeInTheDocument();
      expect(screen.getAllByTestId('repository-card')).toHaveLength(2);
    });
  });

  it('handles search errors gracefully', async () => {
    const user = userEvent.setup();
    mockSearchUsers.mockRejectedValue(new Error('API Error'));
    
    render(<App />);
    
    const searchInput = screen.getByTestId('search-input');
    
    await act(async () => {
      await user.type(searchInput, 'test');
    });

    await waitFor(() => {
      expect(screen.getByText('API Error')).toBeInTheDocument();
    });
  });

  it('handles repository fetch errors gracefully', async () => {
    const user = userEvent.setup();
    mockGetUserRepositories.mockRejectedValue(new Error('Repo fetch error'));
    
    render(<App />);
    
    const searchInput = screen.getByTestId('search-input');
    
    await act(async () => {
      await user.type(searchInput, 'test');
    });

    await waitFor(() => {
      expect(screen.getByTestId('user-dropdown')).toBeInTheDocument();
    });

    await act(async () => {
      await user.click(screen.getByTestId('user-option-testuser1'));
    });

    await waitFor(() => {
      expect(screen.getByText('Repo fetch error')).toBeInTheDocument();
    });
  });

  it('closes dropdown when pressing Escape key', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const searchInput = screen.getByTestId('search-input');
    
    await act(async () => {
      await user.type(searchInput, 'test');
    });

    await waitFor(() => {
      expect(screen.getByTestId('user-dropdown')).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.keyDown(searchInput, { key: 'Escape' });
    });

    expect(screen.queryByTestId('user-dropdown')).not.toBeInTheDocument();
  });

  it('debounces search requests', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const searchInput = screen.getByTestId('search-input');
    
    await act(async () => {
      await user.type(searchInput, 'test');
    });

    // Should only call once after debounce
    await waitFor(() => {
      expect(mockSearchUsers).toHaveBeenCalledTimes(1);
      expect(mockSearchUsers).toHaveBeenCalledWith('test');
    });
  });

  it('clears users when search term is empty', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const searchInput = screen.getByTestId('search-input');
    
    // Type something first
    await act(async () => {
      await user.type(searchInput, 'test');
    });

    await waitFor(() => {
      expect(screen.getByTestId('user-dropdown')).toBeInTheDocument();
    });

    // Clear the input
    await act(async () => {
      await user.clear(searchInput);
    });

    await waitFor(() => {
      expect(screen.queryByTestId('user-dropdown')).not.toBeInTheDocument();
    });
  });
});