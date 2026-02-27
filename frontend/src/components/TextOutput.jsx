import { useMemo } from 'react';
import { useTreeStore } from '../store/useTreeStore';
import { formatTree } from '../lib/formatTree';

const FORMAT_LABELS = {
  ascii: 'ASCII Tree',
  markdown: 'Markdown',
  json: 'JSON',
  plain: 'Plain Text',
};

export default function TextOutput({ tree, meta }) {
  const outputFormat = useTreeStore((s) => s.outputFormat);
  const showIcons = useTreeStore((s) => s.showIcons);

  const formattedText = useMemo(() => {
    if (!tree || tree.length === 0) return '';
    return formatTree(tree, outputFormat, { icons: showIcons });
  }, [tree, outputFormat, showIcons]);

  if (!tree || tree.length === 0) return null;

  const isJson = outputFormat === 'json';

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-border bg-surface-1/30">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
          </svg>
          <h2 className="text-sm font-semibold text-text-primary">
            {FORMAT_LABELS[outputFormat] || 'Text Tree'}
          </h2>
        </div>
        {meta && (
          <div className="flex items-center gap-3 text-xs text-text-muted">
            <span>{meta.totalFiles} files</span>
            <span>{meta.totalDirs} folders</span>
          </div>
        )}
      </div>
      <div className="flex-1 overflow-auto p-4">
        <pre className={`text-sm font-mono leading-relaxed whitespace-pre select-all ${
          isJson ? 'text-emerald-400/80' : 'text-text-secondary'
        }`}>
          {formattedText}
        </pre>
      </div>
    </div>
  );
}
