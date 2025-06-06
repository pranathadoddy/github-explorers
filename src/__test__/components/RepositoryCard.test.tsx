import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RepositoryCard from '../../components/RepositoryCard';
import { GitHubRepository } from '../../types/github';

const mockRepository: GitHubRepository = {
  id: 1,
  name: 'test-repo',
  full_name: 'testuser/test-repo',
  description: 'A test repository for testing',
  html_url: 'https://github.com/testuser/test-repo',
  stargazers_count: 42,
  forks_count: 15,
  watchers_count: 8,
  language: 'TypeScript',
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2023-06-01T00:00:00Z',
  private: false
};

describe('RepositoryCard', () => {
  it('renders repository information correctly', () => {
    render(<RepositoryCard repository={mockRepository} />);
    
    expect(screen.getByTestId('repo-name')).toHaveTextContent('test-repo');
    expect(screen.getByTestId('repo-description')).toHaveTextContent('A test repository for testing');
    expect(screen.getByTestId('stars-count')).toHaveTextContent('42');
    expect(screen.getByTestId('forks-count')).toHaveTextContent('15');
    expect(screen.getByTestId('watchers-count')).toHaveTextContent('8');
    expect(screen.getByTestId('repo-language')).toHaveTextContent('TypeScript');
  });

  it('renders repository without description', () => {
    const repoWithoutDescription = { ...mockRepository, description: null };
    render(<RepositoryCard repository={repoWithoutDescription} />);
    
    expect(screen.getByTestId('repo-name')).toHaveTextContent('test-repo');
    expect(screen.queryByTestId('repo-description')).not.toBeInTheDocument();
  });

  it('shows private badge for private repositories', () => {
    const privateRepo = { ...mockRepository, private: true };
    render(<RepositoryCard repository={privateRepo} />);
    
    expect(screen.getByTestId('repo-private')).toHaveTextContent('Private');
  });

  it('does not show private badge for public repositories', () => {
    render(<RepositoryCard repository={mockRepository} />);
    
    expect(screen.queryByTestId('repo-private')).not.toBeInTheDocument();
  });

  it('renders repository link correctly', () => {
    render(<RepositoryCard repository={mockRepository} />);
    
    const link = screen.getByTestId('repo-link');
    expect(link).toHaveAttribute('href', 'https://github.com/testuser/test-repo');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('formats update date correctly', () => {
    render(<RepositoryCard repository={mockRepository} />);
    
    const updatedElement = screen.getByTestId('repo-updated');
    expect(updatedElement).toHaveTextContent(/Updated/);
    expect(updatedElement).toHaveTextContent(/Jun 1, 2023/);
  });

  it('handles repository without language', () => {
    const repoWithoutLanguage = { ...mockRepository, language: null };
    render(<RepositoryCard repository={repoWithoutLanguage} />);
    
    expect(screen.queryByTestId('repo-language')).not.toBeInTheDocument();
  });

  it('renders all statistics correctly', () => {
    render(<RepositoryCard repository={mockRepository} />);
    
    const statsContainer = screen.getByTestId('repo-stats');
    expect(statsContainer).toBeInTheDocument();
    
    // Check that all stats are displayed
    expect(screen.getByTestId('stars-count')).toBeInTheDocument();
    expect(screen.getByTestId('forks-count')).toBeInTheDocument();
    expect(screen.getByTestId('watchers-count')).toBeInTheDocument();
  });

  it('handles zero statistics gracefully', () => {
    const repoWithZeroStats = {
      ...mockRepository,
      stargazers_count: 0,
      forks_count: 0,
      watchers_count: 0
    };
    
    render(<RepositoryCard repository={repoWithZeroStats} />);
    
    expect(screen.getByTestId('stars-count')).toHaveTextContent('0');
    expect(screen.getByTestId('forks-count')).toHaveTextContent('0');
    expect(screen.getByTestId('watchers-count')).toHaveTextContent('0');
  });

  it('handles very long repository names', () => {
    const repoWithLongName = {
      ...mockRepository,
      name: 'this-is-a-very-long-repository-name-that-should-be-truncated-properly'
    };
    
    render(<RepositoryCard repository={repoWithLongName} />);
    
    const nameElement = screen.getByTestId('repo-name');
    expect(nameElement).toHaveTextContent(repoWithLongName.name);
    expect(nameElement).toHaveClass('truncate');
  });

  it('handles very long descriptions', () => {
    const repoWithLongDescription = {
      ...mockRepository,
      description: 'This is a very long description that should be truncated after a certain number of lines to ensure the card layout remains consistent and readable across different repositories with varying description lengths.'
    };
    
    render(<RepositoryCard repository={repoWithLongDescription} />);
    
    const descriptionElement = screen.getByTestId('repo-description');
    expect(descriptionElement).toHaveTextContent(repoWithLongDescription.description);
    expect(descriptionElement).toHaveClass('line-clamp-3', 'sm:line-clamp-2');
  });

  it('renders different programming languages correctly', () => {
    const languages = ['JavaScript', 'Python', 'Java', 'C++', 'Go', 'Rust'];
    
    languages.forEach(language => {
      const repoWithLanguage = { ...mockRepository, language };
      const { unmount } = render(<RepositoryCard repository={repoWithLanguage} />);
      
      expect(screen.getByTestId('repo-language')).toHaveTextContent(language);
      
      unmount();
    });
  });
});