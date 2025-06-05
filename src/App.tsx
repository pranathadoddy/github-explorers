import React, { useEffect } from 'react';
import { useState } from 'react';
import { GitHubUser, SearchState } from './types/github';
import { useCallback } from 'react';
import Header from './components/Header';
import SearchInput from './components/SearchInput';
import UserProfile from './components/UserProfile';
import EmptyState from './components/EmptyState';
import { GitHubService } from './services/GithubService';

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [state, setState] = useState<SearchState>({
    users: [],
    repositories: [],
    selectedUser: null,
    loading: false,
    repositoriesLoading: false,
    error: null,
    repositoriesError: null,
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const searchUsers = useCallback(async (query: string) => {
    if (!query.trim()) {
      setState(prev => ({ ...prev, users: [], error: null }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const users = await GitHubService.searchUsers(query);
      setState(prev => ({ 
        ...prev, 
        users, 
        loading: false,
        error: null 
      }));
      setDropdownOpen(true);
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to search users' 
      }));
    }
  }, []);

  const fetchRepositories = useCallback(async (username: string) => {
    setState(prev => ({ 
      ...prev, 
      repositoriesLoading: true, 
      repositoriesError: null,
      repositories: []
    }));
    
    try {
      const repositories = await GitHubService.getUserRepositories(username);
      setState(prev => ({ 
        ...prev, 
        repositories, 
        repositoriesLoading: false,
        repositoriesError: null
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        repositoriesLoading: false, 
        repositoriesError: error instanceof Error ? error.message : 'Failed to fetch repositories' 
      }));
    }
  }, []);

  const handleUserSelect = useCallback((user: GitHubUser) => {
    setState(prev => ({ ...prev, selectedUser: user }));
    setDropdownOpen(false);
    fetchRepositories(user.login);
  }, [fetchRepositories]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchUsers(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, searchUsers]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setDropdownOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" data-testid="github-explorer">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Header />

        <SearchInput
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onKeyDown={handleKeyDown}
          loading={state.loading}
          users={state.users}
          dropdownOpen={dropdownOpen}
          onUserSelect={handleUserSelect}
          error={state.error}
        />

        {state.selectedUser && (
          <UserProfile
            user={state.selectedUser}
            repositories={state.repositories}
            repositoriesLoading={state.repositoriesLoading}
            repositoriesError={state.repositoriesError}
          />
        )}

        {!state.selectedUser && !searchTerm && <EmptyState />}
      </div>
    </div>
  );
}

