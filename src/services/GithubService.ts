import { GitHubUser, GitHubRepository } from '../types/github';

export class GitHubService {
  private static readonly BASE_URL = 'https://api.github.com';

  static async searchUsers(query: string): Promise<GitHubUser[]> {
    const response = await fetch(
      `${this.BASE_URL}/search/users?q=${encodeURIComponent(query)}&per_page=5`
    );
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.items || [];
  }

  static async getUserRepositories(username: string): Promise<GitHubRepository[]> {
    const response = await fetch(
      `${this.BASE_URL}/users/${username}/repos?sort=updated&per_page=100`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch repositories: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  }
}