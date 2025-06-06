import { GitHubService } from '../../services/GithubService';

// Mock fetch
global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('GitHubService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('searchUsers', () => {
    it('makes correct API call and returns users', async () => {
      const mockResponse = {
        items: [
          {
            id: 1,
            login: 'testuser',
            avatar_url: 'https://github.com/testuser.png',
            html_url: 'https://github.com/testuser',
            type: 'User'
          }
        ]
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await GitHubService.searchUsers('testuser');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.github.com/search/users?q=testuser&per_page=5'
      );
      expect(result).toEqual(mockResponse.items);
    });

    it('handles API errors correctly', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      } as Response);

      await expect(GitHubService.searchUsers('nonexistent')).rejects.toThrow(
        'GitHub API error: 404 Not Found'
      );
    });

    it('encodes query parameters correctly', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ items: [] }),
      } as Response);

      await GitHubService.searchUsers('test user with spaces');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.github.com/search/users?q=test%20user%20with%20spaces&per_page=5'
      );
    });

    it('handles special characters in query', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ items: [] }),
      } as Response);

      await GitHubService.searchUsers('test@user+special&chars');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.github.com/search/users?q=test%40user%2Bspecial%26chars&per_page=5'
      );
    });

    it('returns empty array when no items in response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      } as Response);

      const result = await GitHubService.searchUsers('test');
      expect(result).toEqual([]);
    });

    it('returns empty array when items is null', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ items: null }),
      } as Response);

      const result = await GitHubService.searchUsers('test');
      expect(result).toEqual([]);
    });

    it('handles network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(GitHubService.searchUsers('test')).rejects.toThrow('Network error');
    });

    it('handles rate limiting (403 error)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        statusText: 'Forbidden',
      } as Response);

      await expect(GitHubService.searchUsers('test')).rejects.toThrow(
        'GitHub API error: 403 Forbidden'
      );
    });

    it('handles server errors (500)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      } as Response);

      await expect(GitHubService.searchUsers('test')).rejects.toThrow(
        'GitHub API error: 500 Internal Server Error'
      );
    });

    it('limits results to 5 users per page', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ items: [] }),
      } as Response);

      await GitHubService.searchUsers('test');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('per_page=5')
      );
    });
  });

  describe('getUserRepositories', () => {
    it('makes correct API call and returns repositories', async () => {
      const mockRepositories = [
        {
          id: 1,
          name: 'test-repo',
          full_name: 'testuser/test-repo',
          description: 'A test repository',
          html_url: 'https://github.com/testuser/test-repo',
          stargazers_count: 10,
          forks_count: 5,
          watchers_count: 3,
          language: 'JavaScript',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-06-01T00:00:00Z',
          private: false
        }
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockRepositories,
      } as Response);

      const result = await GitHubService.getUserRepositories('testuser');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.github.com/users/testuser/repos?sort=updated&per_page=100'
      );
      expect(result).toEqual(mockRepositories);
    });

    it('handles API errors correctly', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      } as Response);

      await expect(GitHubService.getUserRepositories('nonexistent')).rejects.toThrow(
        'Failed to fetch repositories: 404 Not Found'
      );
    });

    it('sorts repositories by updated date', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      } as Response);

      await GitHubService.getUserRepositories('testuser');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('sort=updated')
      );
    });

    it('fetches up to 100 repositories per page', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      } as Response);

      await GitHubService.getUserRepositories('testuser');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('per_page=100')
      );
    });

    it('handles users with special characters in username', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      } as Response);

      await GitHubService.getUserRepositories('test-user_123');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.github.com/users/test-user_123/repos?sort=updated&per_page=100'
      );
    });

    it('handles private repositories correctly', async () => {
      const mockRepositories = [
        {
          id: 1,
          name: 'private-repo',
          full_name: 'testuser/private-repo',
          description: 'A private repository',
          html_url: 'https://github.com/testuser/private-repo',
          stargazers_count: 0,
          forks_count: 0,
          watchers_count: 0,
          language: 'TypeScript',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-06-01T00:00:00Z',
          private: true
        }
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockRepositories,
      } as Response);

      const result = await GitHubService.getUserRepositories('testuser');
      expect(result[0].private).toBe(true);
    });

    it('handles repositories without language', async () => {
      const mockRepositories = [
        {
          id: 1,
          name: 'no-language-repo',
          full_name: 'testuser/no-language-repo',
          description: 'Repository without a primary language',
          html_url: 'https://github.com/testuser/no-language-repo',
          stargazers_count: 0,
          forks_count: 0,
          watchers_count: 0,
          language: null,
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-06-01T00:00:00Z',
          private: false
        }
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockRepositories,
      } as Response);

      const result = await GitHubService.getUserRepositories('testuser');
      expect(result[0].language).toBeNull();
    });

    it('handles repositories without description', async () => {
      const mockRepositories = [
        {
          id: 1,
          name: 'no-description-repo',
          full_name: 'testuser/no-description-repo',
          description: null,
          html_url: 'https://github.com/testuser/no-description-repo',
          stargazers_count: 0,
          forks_count: 0,
          watchers_count: 0,
          language: 'JavaScript',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-06-01T00:00:00Z',
          private: false
        }
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockRepositories,
      } as Response);

      const result = await GitHubService.getUserRepositories('testuser');
      expect(result[0].description).toBeNull();
    });

    it('handles network timeouts', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Request timeout'));

      await expect(GitHubService.getUserRepositories('testuser')).rejects.toThrow('Request timeout');
    });

    it('handles rate limiting for repositories', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        statusText: 'API rate limit exceeded',
      } as Response);

      await expect(GitHubService.getUserRepositories('testuser')).rejects.toThrow(
        'Failed to fetch repositories: 403 API rate limit exceeded'
      );
    });
  });

  describe('Base URL configuration', () => {
    it('uses correct GitHub API base URL', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ items: [] }),
      } as Response);

      await GitHubService.searchUsers('test');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.github.com/')
      );
    });
  });
});