import React from 'react';
import { GitHubUser } from "../types/github";
import { GitHubRepository } from "../types/github";
import { ExternalLink, User } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";
import ErrorDisplay from "./ErrorDisplay";
import RepositoryCard from "./RepositoryCard";

interface UserProfileProps {
    user: GitHubUser;
    repositories: GitHubRepository[];
    repositoriesLoading: boolean;
    repositoriesError: string | null;
  }
  
  const UserProfile: React.FC<UserProfileProps> = ({ 
    user, 
    repositories, 
    repositoriesLoading, 
    repositoriesError 
  }) => (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8" data-testid="user-profile">
      <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 mb-6">
        <img 
          src={user.avatar_url} 
          alt={user.login}
          className="w-16 h-16 sm:w-16 sm:h-16 rounded-full"
          data-testid="user-avatar"
        />
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900" data-testid="user-login">
            {user.login}
          </h2>
          <p className="text-gray-600" data-testid="user-type">{user.type}</p>
        </div>
        <a
          href={user.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm sm:text-base"
          data-testid="user-profile-link"
        >
          <User className="w-4 h-4" />
          <span className="hidden sm:inline">View Profile</span>
          <span className="sm:hidden">Profile</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
  
      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900" data-testid="repositories-title">
            Repositories {repositories.length > 0 && `(${repositories.length})`}
          </h3>
          {repositoriesLoading && <LoadingSpinner className="w-5 h-5" />}
        </div>
  
        {repositoriesError && <ErrorDisplay error={repositoriesError} className="mb-4" />}
  
        {repositories.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3" data-testid="repositories-grid">
            {repositories.map((repo) => (
              <RepositoryCard key={repo.id} repository={repo} />
            ))}
          </div>
        )}
  
        {!repositoriesLoading && repositories.length === 0 && !repositoriesError && (
          <div className="text-center py-8 text-gray-500" data-testid="no-repositories">
            <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No repositories found for this user.</p>
          </div>
        )}
      </div>
    </div>
  );

  export default UserProfile;