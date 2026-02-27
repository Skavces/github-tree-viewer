import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { GitHubService } from '../github/github.service';
import { CacheService } from '../cache/cache.service';
import { TreeNode, TreeResponse, GitHubTreeItem } from '../common/types';
import { parseGitHubUrl } from './dto/tree-query.dto';

@Injectable()
export class TreeService {
  private readonly logger = new Logger(TreeService.name);
  private readonly inFlight = new Map<string, Promise<TreeResponse>>();

  constructor(
    private readonly github: GitHubService,
    private readonly cache: CacheService,
  ) {}

  async getTree(repoUrl: string, branchInput?: string): Promise<TreeResponse> {
    const { owner, repo, branch: urlBranch } = parseGitHubUrl(repoUrl);
    const branch = branchInput || urlBranch;

    const resolvedBranch =
      branch || (await this.github.getDefaultBranch(owner, repo));

    const cacheKey = `${owner}/${repo}@${resolvedBranch}`;

    const cached = this.cache.get<TreeResponse>(cacheKey);
    if (cached) return cached;

    if (this.inFlight.has(cacheKey)) {
      this.logger.debug(`Deduplicating request: ${cacheKey}`);
      return this.inFlight.get(cacheKey)!;
    }

    const promise = this.fetchAndBuild(owner, repo, resolvedBranch, cacheKey);
    this.inFlight.set(cacheKey, promise);

    try {
      const result = await promise;
      return result;
    } finally {
      this.inFlight.delete(cacheKey);
    }
  }

  private async fetchAndBuild(
    owner: string,
    repo: string,
    branch: string,
    cacheKey: string,
  ): Promise<TreeResponse> {
    const sha = await this.github.getBranchSha(owner, repo, branch);
    const items = await this.github.getTree(owner, repo, sha);

    const tree = this.buildTree(items);
    const text = this.generateTextTree(tree);

    let totalFiles = 0;
    let totalDirs = 0;
    for (const item of items) {
      if (item.type === 'blob') totalFiles++;
      else if (item.type === 'tree') totalDirs++;
    }

    const response: TreeResponse = {
      meta: { owner, repo, branch, totalFiles, totalDirs },
      tree,
      text,
    };

    this.cache.set(cacheKey, response);
    return response;
  }

  private buildTree(items: GitHubTreeItem[]): TreeNode[] {
    const root: TreeNode[] = [];

    for (const item of items) {
      const parts = item.path.split('/');
      let current = root;

      for (let i = 0; i < parts.length; i++) {
        const name = parts[i];
        const isLast = i === parts.length - 1;
        const type = isLast
          ? item.type === 'tree'
            ? 'dir'
            : 'file'
          : 'dir';

        let existing = current.find(
          (n) => n.name === name && n.type === type,
        );

        if (!existing) {
          existing = { name, type };
          if (type === 'dir') {
            existing.children = [];
          }
          current.push(existing);
        }

        if (type === 'dir' && existing.children) {
          current = existing.children;
        }
      }
    }

    this.sortTree(root);
    return root;
  }

  private sortTree(nodes: TreeNode[]): void {
    nodes.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'dir' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });

    for (const node of nodes) {
      if (node.children) {
        this.sortTree(node.children);
      }
    }
  }

  generateTextTree(nodes: TreeNode[], prefix = ''): string {
    let result = '';

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const isLast = i === nodes.length - 1;
      const connector = isLast ? '└── ' : '├── ';
      const childPrefix = isLast ? '    ' : '│   ';

      result += `${prefix}${connector}${node.name}${node.type === 'dir' ? '/' : ''}\n`;

      if (node.children && node.children.length > 0) {
        result += this.generateTextTree(node.children, prefix + childPrefix);
      }
    }

    return result;
  }
}
