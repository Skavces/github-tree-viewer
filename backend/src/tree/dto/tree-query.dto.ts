import { z } from 'zod';

export const treeQuerySchema = z.object({
  repo: z
    .string()
    .min(1, 'Repository URL is required')
    .refine(
      (url) => {
        const pattern =
          /^https?:\/\/(www\.)?github\.com\/[\w.-]+\/[\w.-]+(\/.*)?$/;
        return pattern.test(url.replace(/\.git$/, ''));
      },
      { message: 'Invalid GitHub repository URL' },
    ),
  branch: z.string().optional(),
});

export type TreeQueryDto = z.infer<typeof treeQuerySchema>;

export function parseGitHubUrl(url: string): {
  owner: string;
  repo: string;
  branch?: string;
} {
  const cleaned = url.replace(/\.git$/, '').replace(/\/$/, '');
  const match = cleaned.match(
    /github\.com\/([\w.-]+)\/([\w.-]+)(?:\/tree\/([\w.\-/]+))?/,
  );

  if (!match) {
    throw new Error('Could not parse GitHub URL');
  }

  return {
    owner: match[1],
    repo: match[2],
    branch: match[3] || undefined,
  };
}
