import { useTreeStore } from '../store/useTreeStore';

const FORMATS = [
  { id: 'ascii', label: 'ASCII', icon: '┣' },
  { id: 'markdown', label: 'Markdown', icon: '📝' },
  { id: 'json', label: 'JSON', icon: '{ }' },
  { id: 'plain', label: 'Plain', icon: '≡' },
];

export default function ActionBar({ text, repoUrl, branch, onToast }) {
  const triggerExpandAll = useTreeStore((s) => s.triggerExpandAll);
  const triggerCollapseAll = useTreeStore((s) => s.triggerCollapseAll);
  const outputFormat = useTreeStore((s) => s.outputFormat);
  const setOutputFormat = useTreeStore((s) => s.setOutputFormat);
  const showIcons = useTreeStore((s) => s.showIcons);
  const toggleIcons = useTreeStore((s) => s.toggleIcons);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      onToast('Copied to clipboard');
    } catch {
      onToast('Failed to copy');
    }
  };

  const handleDownload = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const match = repoUrl?.match(/github\.com\/[\w.-]+\/([\w.-]+)/);
    const repoName = match ? match[1] : 'tree';
    const ext = outputFormat === 'json' ? 'json' : outputFormat === 'markdown' ? 'md' : 'txt';
    a.download = `${repoName}-tree.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onToast('Downloaded');
  };

  const handleShare = () => {
    const params = new URLSearchParams();
    if (repoUrl) params.set('repo', repoUrl);
    if (branch) params.set('branch', branch);
    const shareUrl = `${window.location.origin}?${params}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      onToast('Share URL copied');
    });
  };

  const btn =
    'flex items-center gap-1.5 px-3 py-1.5 bg-surface-3 hover:bg-surface-4 border border-border hover:border-border-hover text-text-secondary hover:text-text-primary text-xs font-medium rounded-lg transition-all duration-150 active:scale-95';

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center bg-surface-2 rounded-lg border border-border overflow-hidden">
        {FORMATS.map((f) => (
          <button
            key={f.id}
            onClick={() => setOutputFormat(f.id)}
            className={`px-2.5 py-1.5 text-xs font-medium transition-all duration-150 ${
              outputFormat === f.id
                ? 'bg-accent text-white'
                : 'text-text-muted hover:text-text-primary hover:bg-surface-3'
            }`}
            title={f.label}
          >
            <span className="mr-1">{f.icon}</span>
            {f.label}
          </button>
        ))}
      </div>

      <button
        onClick={toggleIcons}
        className={`flex items-center gap-1.5 px-3 py-1.5 border text-xs font-medium rounded-lg transition-all duration-150 active:scale-95 ${
          showIcons
            ? 'bg-accent/10 border-accent/30 text-accent'
            : 'bg-surface-3 border-border text-text-muted hover:text-text-primary hover:bg-surface-4'
        }`}
        title={showIcons ? 'Icons On' : 'Icons Off'}
      >
        <span>{showIcons ? '📁' : '📁'}</span>
        Icons {showIcons ? 'On' : 'Off'}
      </button>

      <div className="w-px h-5 bg-border mx-0.5" />

      <button onClick={handleCopy} className={btn} id="copy-btn">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
        </svg>
        Copy
      </button>
      <button onClick={handleDownload} className={btn} id="download-btn">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        Download
      </button>
      <button onClick={handleShare} className={btn} id="share-btn">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
        </svg>
        Share
      </button>

      <div className="w-px h-5 bg-border mx-0.5" />

      <button onClick={triggerExpandAll} className={btn} id="expand-all-btn">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
        </svg>
        Expand All
      </button>
      <button onClick={triggerCollapseAll} className={btn} id="collapse-all-btn">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
        </svg>
        Collapse All
      </button>
    </div>
  );
}
