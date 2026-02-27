import { useEffect, useState, useMemo } from 'react';
import InputBar from './components/InputBar';
import FileTree from './components/FileTree';
import TextOutput from './components/TextOutput';
import ActionBar from './components/ActionBar';
import { useToast } from './components/Toast';
import { useTree } from './api/useTree';
import { useTreeStore } from './store/useTreeStore';
import { formatTree } from './lib/formatTree';

const DEMO_REPO = 'https://github.com/expressjs/express';

export default function App() {
  const [activeRepo, setActiveRepo] = useState('');
  const [activeBranch, setActiveBranch] = useState('');
  const { show, ToastComponent } = useToast();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const repoParam = params.get('repo');
    const branchParam = params.get('branch');

    if (repoParam) {
      setActiveRepo(repoParam);
      if (branchParam) setActiveBranch(branchParam);
    } else {
      setActiveRepo(DEMO_REPO);
    }
  }, []);

  const { data, isLoading, error } = useTree(activeRepo, activeBranch);

  useEffect(() => {
    if (!activeRepo || activeRepo === DEMO_REPO) return;
    const params = new URLSearchParams();
    params.set('repo', activeRepo);
    if (activeBranch) params.set('branch', activeBranch);
    window.history.replaceState(null, '', `?${params}`);
  }, [activeRepo, activeBranch]);

  const handleSubmit = (url, branch) => {
    setActiveRepo(url);
    setActiveBranch(branch || '');
  };

  const isDemo = activeRepo === DEMO_REPO && !new URLSearchParams(window.location.search).get('repo');

  const outputFormat = useTreeStore((s) => s.outputFormat);
  const showIcons = useTreeStore((s) => s.showIcons);

  const formattedText = useMemo(() => {
    if (!data?.tree) return '';
    return formatTree(data.tree, outputFormat, { icons: showIcons });
  }, [data?.tree, outputFormat, showIcons]);

  return (
    <div className="min-h-screen flex flex-col bg-surface-0">
      <div className="sticky top-0 z-30">
        <header className="border-b border-border bg-surface-1/80 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-5">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center text-white text-lg">
                  🌳
                </div>
                <div>
                  <h1 className="text-lg font-bold text-text-primary tracking-tight">
                    GitHub Tree Viewer
                  </h1>
                  <p className="text-xs text-text-muted">
                    Instant file trees from any public repo
                  </p>
                </div>
              </div>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-text-secondary transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
            <InputBar onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
        </header>

        {data && !isLoading && (
          <div className="border-b border-border bg-surface-1/80 backdrop-blur-xl px-6 py-3">
            <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-text-muted">Repository:</span>
                <a
                  href={`https://github.com/${data.meta.owner}/${data.meta.repo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent-hover font-mono font-medium transition-colors"
                >
                  {data.meta.owner}/{data.meta.repo}
                </a>
                <span className="text-text-muted">@</span>
                <span className="text-text-secondary font-mono bg-surface-3 px-2 py-0.5 rounded text-xs">
                  {data.meta.branch}
                </span>
              </div>
              <ActionBar
                text={formattedText}
                repoUrl={activeRepo}
                branch={activeBranch}
                onToast={show}
              />
            </div>
          </div>
        )}
      </div>

      {isDemo && data && (
        <div className="bg-accent/5 border-b border-accent/10 px-6 py-2.5">
          <p className="text-sm text-accent text-center">
            📍 Showing demo: <span className="font-mono font-medium">expressjs/express</span> — paste your own repo URL above
          </p>
        </div>
      )}

      {error && (
        <div className="max-w-3xl mx-auto mt-8 px-6 w-full">
          <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-5 flex items-start gap-3">
            <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <div>
              <p className="text-base font-medium text-red-400">Error</p>
              <p className="text-sm text-red-400/80 mt-1">{error.message}</p>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-full border-2 border-surface-3" />
              <div className="absolute inset-0 w-14 h-14 rounded-full border-2 border-accent border-t-transparent animate-spin" />
            </div>
            <p className="text-base text-text-muted">Fetching repository tree...</p>
          </div>
        </div>
      )}

      {data && !isLoading && (
        <div className="flex-1 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border">
          <div className="min-h-[400px] max-h-[70vh] overflow-auto">
            <FileTree tree={data.tree} meta={data.meta} />
          </div>
          <div className="min-h-[400px] max-h-[70vh] overflow-auto">
            <TextOutput tree={data.tree} meta={data.meta} />
          </div>
        </div>
      )}

      {!data && !isLoading && !error && (
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="text-center">
            <div className="text-6xl mb-4">🌳</div>
            <p className="text-text-muted text-base">
              Paste a GitHub URL above to generate a file tree
            </p>
          </div>
        </div>
      )}

      <footer className="border-t border-border bg-surface-1/50 mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-text-muted">
              <span>🌳</span>
              <span>GitHub Tree Viewer</span>
              <span className="text-border">·</span>
              <span>Generate file trees instantly</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-text-muted">
              <span>No login required</span>
              <span className="text-border">·</span>
              <span>100% free</span>
              <span className="text-border">·</span>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-text-secondary transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>

      {ToastComponent}
    </div>
  );
}
