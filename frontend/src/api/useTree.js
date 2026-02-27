import { useQuery } from '@tanstack/react-query';

async function fetchTree(repoUrl, branch) {
  const params = new URLSearchParams({ repo: repoUrl });
  if (branch) params.set('branch', branch);

  const res = await fetch(`/api/tree?${params}`);

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Error ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

export function useTree(repoUrl, branch) {
  return useQuery({
    queryKey: ['tree', repoUrl, branch],
    queryFn: () => fetchTree(repoUrl, branch),
    enabled: !!repoUrl,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
