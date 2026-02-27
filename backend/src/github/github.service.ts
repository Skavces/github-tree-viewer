import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { GitHubTreeItem } from '../common/types';

@Injectable()
export class GitHubService {
  private readonly logger = new Logger(GitHubService.name);
  private readonly baseUrl = 'https://api.github.com';

  private get headers(): Record<string, string> {
    const h: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'github-tree-viewer',
    };
    const token = process.env.GITHUB_TOKEN;
    if (token) {
      h['Authorization'] = `Bearer ${token}`;
    }
    return h;
  }

  private async request<T>(path: string): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    this.logger.debug(`GitHub API: ${url}`);

    const res = await fetch(url, { headers: this.headers });

    if (res.status === 404) {
      throw new HttpException(
        'Repository or branch not found. Make sure the repository is public and the URL is correct.',
        HttpStatus.NOT_FOUND,
      );
    }

    if (res.status === 403) {
      const rateLimitRemaining = res.headers.get('x-ratelimit-remaining');
      if (rateLimitRemaining === '0') {
        const resetTime = res.headers.get('x-ratelimit-reset');
        const resetDate = resetTime
          ? new Date(parseInt(resetTime) * 1000).toISOString()
          : 'soon';
        throw new HttpException(
          `GitHub API rate limit exceeded. Resets at ${resetDate}. Set GITHUB_TOKEN env var for higher limits.`,
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
      throw new HttpException(
        'Access denied. The repository may be private.',
        HttpStatus.FORBIDDEN,
      );
    }

    if (!res.ok) {
      throw new HttpException(
        `GitHub API error: ${res.status} ${res.statusText}`,
        HttpStatus.BAD_GATEWAY,
      );
    }

    return res.json() as Promise<T>;
  }

  async getDefaultBranch(owner: string, repo: string): Promise<string> {
    const data = await this.request<{ default_branch: string }>(
      `/repos/${owner}/${repo}`,
    );
    return data.default_branch;
  }

  async getBranchSha(
    owner: string,
    repo: string,
    branch: string,
  ): Promise<string> {
    const data = await this.request<{ object: { sha: string } }>(
      `/repos/${owner}/${repo}/git/ref/heads/${branch}`,
    );
    return data.object.sha;
  }

  async getTree(
    owner: string,
    repo: string,
    sha: string,
  ): Promise<GitHubTreeItem[]> {
    const data = await this.request<{
      tree: GitHubTreeItem[];
      truncated: boolean;
    }>(`/repos/${owner}/${repo}/git/trees/${sha}?recursive=1`);

    if (data.truncated) {
      this.logger.warn(
        `Tree for ${owner}/${repo} was truncated by GitHub API`,
      );
    }

    return data.tree.filter(
      (item) => item.type === 'blob' || item.type === 'tree',
    );
  }
}
