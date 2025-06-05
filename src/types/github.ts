export interface GitHubUser {
    id: number;
    login: string;
    avatar_url: string;
    html_url: string;
    type: string;
}
  
export interface GitHubRepository {
    id: number;
    name: string;
    full_name: string;
    description: string | null;
    html_url: string;
    stargazers_count: number;
    forks_count: number;
    watchers_count: number;
    language: string | null;
    created_at: string;
    updated_at: string;
    private: boolean;
}

export interface SearchState {
    users: GitHubUser[];
    repositories: GitHubRepository[];
    selectedUser: GitHubUser | null;
    loading: boolean;
    repositoriesLoading: boolean;
    error: string | null;
    repositoriesError: string | null;
  }