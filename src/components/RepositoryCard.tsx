import React from 'react';
import { GitHubRepository } from '../types/github';
import { ExternalLink, Star, GitFork, Eye, Calendar } from 'lucide-react';
import { formatDate } from '../utils/formatDate';


interface RepositoryCardProps {
    repository: GitHubRepository;
  }
  
  const RepositoryCard: React.FC<RepositoryCardProps> = ({ repository }) => (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow" data-testid="repository-card">
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-semibold text-gray-900 truncate pr-2 text-sm sm:text-base" data-testid="repo-name">
          <a href={repository.html_url} target="_blank" rel="noopener noreferrer" className="hover:underline">{repository.name}</a>
        </h4>
        <a
          href={repository.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-gray-600 flex-shrink-0 p-1"
          data-testid="repo-link"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
      
      {repository.description && (
        <p className="text-gray-600 text-sm mb-3 line-clamp-3 sm:line-clamp-2" data-testid="repo-description">
          {repository.description}
        </p>
      )}
  
      <div className="flex items-center gap-3 sm:gap-4 text-sm text-gray-500 mb-3 flex-wrap" data-testid="repo-stats">
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4" />
          <span data-testid="stars-count">{repository.stargazers_count}</span>
        </div>
        <div className="flex items-center gap-1">
          <GitFork className="w-4 h-4" />
          <span data-testid="forks-count">{repository.forks_count}</span>
        </div>
        <div className="flex items-center gap-1">
          <Eye className="w-4 h-4" />
          <span data-testid="watchers-count">{repository.watchers_count}</span>
        </div>
      </div>
  
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-gray-500">
        <div className="flex items-center gap-2 flex-wrap">
          {repository.language && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs" data-testid="repo-language">
              {repository.language}
            </span>
          )}
          {repository.private && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs" data-testid="repo-private">
              Private
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span className="whitespace-nowrap" data-testid="repo-updated">
            Updated {formatDate(repository.updated_at)}
          </span>
        </div>
      </div>
    </div>
  );

  export default RepositoryCard;