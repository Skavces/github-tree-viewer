export function parseGitHubUrl(url) {
  if (!url) return null;

  try {
    const cleaned = url.trim().replace(/\.git$/, '').replace(/\/$/, '');
    const match = cleaned.match(
      /github\.com\/([\w.-]+)\/([\w.-]+)(?:\/tree\/([\w.\-/]+))?/
    );

    if (!match) return null;

    return {
      owner: match[1],
      repo: match[2],
      branch: match[3] || undefined,
      fullUrl: cleaned,
    };
  } catch {
    return null;
  }
}

export function buildRepoUrl(owner, repo) {
  return `https://github.com/${owner}/${repo}`;
}
