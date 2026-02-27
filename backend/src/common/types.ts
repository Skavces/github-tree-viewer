export interface TreeNode {
  name: string;
  type: 'dir' | 'file';
  children?: TreeNode[];
}

export interface TreeResponse {
  meta: {
    owner: string;
    repo: string;
    branch: string;
    totalFiles: number;
    totalDirs: number;
  };
  tree: TreeNode[];
  text: string;
}

export interface GitHubTreeItem {
  path: string;
  mode: string;
  type: 'blob' | 'tree';
  sha: string;
  size?: number;
  url: string;
}

export interface CacheEntry<T> {
  exp: number;
  data: T;
}
