import React from 'react';
import { GitHubUser } from '../types/github';
import { Search } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import UserDropdown from './UserDropdown';
import ErrorDisplay from './ErrorDisplay';
interface SearchInputProps {
    searchTerm: string;
    onSearchChange: (term: string) => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    loading: boolean;
    users: GitHubUser[];
    dropdownOpen: boolean;
    onUserSelect: (user: GitHubUser) => void;
    error: string | null;
  }
  
  const SearchInput: React.FC<SearchInputProps> = ({
    searchTerm,
    onSearchChange,
    onKeyDown,
    loading,
    users,
    dropdownOpen,
    onUserSelect,
    error
  }) => (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Enter username to search..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={onKeyDown}
            className="w-full pl-10 pr-4 py-3 sm:py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            data-testid="search-input"
          />
          {loading && (
            <LoadingSpinner className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
          )}
        </div>
  
        <UserDropdown
          users={users}
          searchTerm={searchTerm}
          isOpen={dropdownOpen}
          onUserSelect={onUserSelect}
        />
  
        {error && <ErrorDisplay error={error} className="mt-3" />}
      </div>
    </div>
  );

  export default SearchInput;