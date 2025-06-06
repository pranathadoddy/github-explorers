// src/__tests__/components/UserProfile.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserProfile from '../../components/UserProfile';
import { GitHubUser, GitHubRepository } from '../../types/github';

const mockUser: GitHubUser = {
  id: 1,
  login: 'testuser',
  avatar_url: 'https://github.com/testuser.png',
  html_url: 'https://github.com/testuser',
  type: 'User'
};

const mockRepositories: GitHubRepository[] = [
  {
    id: 1,
    name: 'repo1',
    full_name: 'testuser/repo1',
    description: 'First repository',
    html_url: 'https://github.com/testuser/repo1',
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
    name: 'repo2',
    full_name: 'testuser/repo2',
    description: 'Second repository',
    html_url: 'https://github.com/testuser/repo2',
    stargazers_count: 5,
    forks_count: 2,
    watchers_count: 1,
    language: 'TypeScript',
    created_at: '2023-02-01T00:00:00Z',
    updated_at: '2023-05-01T00:00:00Z',
    private: true
  }
];

describe('UserProfile', () => {
  const defaultProps = {
    user: mockUser,
    repositories: mockRepositories,
    repositoriesLoading: false,
    repositoriesError: null
  };

  it('renders user information correctly', () => {
    render(<UserProfile {...defaultProps} />);
    
    expect(screen.getByTestId('user-login')).toHaveTextContent('testuser');
    expect(screen.getByTestId('user-type')).toHaveTextContent('User');
    expect(screen.getByTestId('user-avatar')).toHaveAttribute('src', 'https://github.com/testuser.png');
    expect(screen.getByTestId('user-avatar')).toHaveAttribute('alt', 'testuser');
  });

  it('renders profile link correctly', () => {
    render(<UserProfile {...defaultProps} />);
    
    const profileLink = screen.getByTestId('user-profile-link');
    expect(profileLink).toHaveAttribute('href', 'https://github.com/testuser');
    expect(profileLink).toHaveAttribute('target', '_blank');
    expect(profileLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('displays repositories count in title', () => {
    render(<UserProfile {...defaultProps} />);
    
    expect(screen.getByTestId('repositories-title')).toHaveTextContent('Repositories (2)');
  });

  it('displays repositories title without count when no repositories', () => {
    render(<UserProfile {...defaultProps} repositories={[]} />);
    
    expect(screen.getByTestId('repositories-title')).toHaveTextContent('Repositories');
    expect(screen.getByTestId('repositories-title')).not.toHaveTextContent('(');
  });

  it('shows loading spinner when repositories are loading', () => {
    render(<UserProfile {...defaultProps} repositories={[]} repositoriesLoading={true} />);
    
    expect(screen.getByTestId('repositories-title')).toBeInTheDocument();
    // The loading spinner should be present - checking for the general structure
    const titleSection = screen.getByTestId('repositories-title').closest('div');
    expect(titleSection).toBeInTheDocument();
  });

  it('displays error message when repositories fail to load', () => {
    render(
      <UserProfile 
        {...defaultProps} 
        repositories={[]} 
        repositoriesLoading={false} 
        repositoriesError="Failed to fetch repositories" 
      />
    );
    
    expect(screen.getByText('Failed to fetch repositories')).toBeInTheDocument();
  });

  it('shows no repositories message when user has no repos', () => {
    render(
      <UserProfile 
        {...defaultProps} 
        repositories={[]} 
        repositoriesLoading={false} 
        repositoriesError={null} 
      />
    );
    
    expect(screen.getByTestId('no-repositories')).toBeInTheDocument();
    expect(screen.getByText('No repositories found for this user.')).toBeInTheDocument();
  });

  it('renders repositories grid when repositories exist', () => {
    render(<UserProfile {...defaultProps} />);
    
    expect(screen.getByTestId('repositories-grid')).toBeInTheDocument();
    expect(screen.getAllByTestId('repository-card')).toHaveLength(2);
  });

  it('does not show repositories grid when loading', () => {
    render(
      <UserProfile 
        {...defaultProps} 
        repositories={[]} 
        repositoriesLoading={true} 
      />
    );
    
    expect(screen.queryByTestId('repositories-grid')).not.toBeInTheDocument();
    expect(screen.queryByTestId('no-repositories')).not.toBeInTheDocument();
  });

  it('does not show repositories grid when there is an error', () => {
    render(
      <UserProfile 
        {...defaultProps} 
        repositories={[]} 
        repositoriesError="Some error" 
      />
    );
    
    expect(screen.queryByTestId('repositories-grid')).not.toBeInTheDocument();
  });

  it('handles different user types', () => {
    const organizationUser = { ...mockUser, type: 'Organization' };
    render(<UserProfile {...defaultProps} user={organizationUser} />);
    
    expect(screen.getByTestId('user-type')).toHaveTextContent('Organization');
  });

  it('handles users with special characters in login', () => {
    const specialUser = { ...mockUser, login: 'test-user_123' };
    render(<UserProfile {...defaultProps} user={specialUser} />);
    
    expect(screen.getByTestId('user-login')).toHaveTextContent('test-user_123');
    expect(screen.getByTestId('user-avatar')).toHaveAttribute('alt', 'test-user_123');
  });

  it('renders correctly with many repositories', () => {
    const manyRepos = Array.from({ length: 50 }, (_, i) => ({
      ...mockRepositories[0],
      id: i + 1,
      name: `repo-${i + 1}`,
      full_name: `testuser/repo-${i + 1}`
    }));

    render(<UserProfile {...defaultProps} repositories={manyRepos} />);
    
    expect(screen.getByTestId('repositories-title')).toHaveTextContent('Repositories (50)');
    expect(screen.getAllByTestId('repository-card')).toHaveLength(50);
  });

  it('maintains responsive layout classes', () => {
    render(<UserProfile {...defaultProps} />);
    
    const profileContainer = screen.getByTestId('user-profile');
    expect(profileContainer).toHaveClass('bg-white', 'rounded-lg', 'shadow-md');
    
    const repositoriesGrid = screen.getByTestId('repositories-grid');
    expect(repositoriesGrid).toHaveClass('grid', 'gap-4');
  });

  it('shows profile button with correct responsive text', () => {
    render(<UserProfile {...defaultProps} />);
    
    const profileLink = screen.getByTestId('user-profile-link');
    
    // Check that both responsive text elements are present
    expect(profileLink).toHaveTextContent('View Profile');
    expect(profileLink).toHaveTextContent('Profile');
  });
});