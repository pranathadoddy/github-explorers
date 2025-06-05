import React from 'react';
import { GitHubUser } from '../types/github';
import { ChevronDown } from 'lucide-react';

interface UserDropdownProps {
    users: GitHubUser[];
    searchTerm: string;
    isOpen: boolean;
    onUserSelect: (user: GitHubUser) => void;
  }
  
  const UserDropdown: React.FC<UserDropdownProps> = ({ users, searchTerm, isOpen, onUserSelect }) => {
    if (!isOpen || users.length === 0) return null;
  
    return (
      <div 
        className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto"
        data-testid="user-dropdown"
      >
        <div className="p-2 text-sm text-gray-500 border-b">
          Showing users for "{searchTerm}"
        </div>
        {users.map((user) => (
          <button
            key={user.id}
            onClick={() => onUserSelect(user)}
            className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-left"
            data-testid={`user-option-${user.login}`}
          >
            <img 
              src={user.avatar_url} 
              alt={user.login}
              className="w-8 h-8 rounded-full"
            />
            <div>
              <div className="font-medium text-gray-900">{user.login}</div>
              <div className="text-sm text-gray-500">{user.type}</div>
            </div>
            <ChevronDown className="ml-auto w-4 h-4 text-gray-400 rotate-[-90deg]" />
          </button>
        ))}
      </div>
    );
  };

  export default UserDropdown;