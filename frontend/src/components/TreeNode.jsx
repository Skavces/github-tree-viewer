import { useState, useEffect } from 'react';
import { useTreeStore } from '../store/useTreeStore';

export default function TreeNode({ node, depth = 0 }) {
  const [isOpen, setIsOpen] = useState(depth < 2);
  const expandSignal = useTreeStore((s) => s.expandSignal);
  const collapseSignal = useTreeStore((s) => s.collapseSignal);

  useEffect(() => {
    if (expandSignal > 0) setIsOpen(true);
  }, [expandSignal]);

  useEffect(() => {
    if (collapseSignal > 0) setIsOpen(false);
  }, [collapseSignal]);

  const isDir = node.type === 'dir';

  if (!isDir) {
    return (
      <div
        className="flex items-center gap-2 py-0.5 px-2 rounded hover:bg-surface-3/50 transition-colors cursor-default group"
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        <svg className="w-4 h-4 text-text-muted flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
        <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors truncate">
          {node.name}
        </span>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 py-0.5 px-2 rounded hover:bg-surface-3/50 transition-colors text-left"
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        <svg
          className={`w-3 h-3 text-text-muted flex-shrink-0 transition-transform duration-150 ${
            isOpen ? 'rotate-90' : ''
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
        </svg>
        <svg
          className={`w-4 h-4 flex-shrink-0 ${isOpen ? 'text-accent' : 'text-yellow-500/70'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
          )}
        </svg>
        <span className="text-sm text-text-primary font-medium truncate">
          {node.name}
        </span>
        {node.children && (
          <span className="text-xs text-text-muted ml-auto flex-shrink-0">
            {node.children.length}
          </span>
        )}
      </button>
      {isOpen && node.children && (
        <div className="animate-fade-in">
          {node.children.map((child, i) => (
            <TreeNode key={`${child.name}-${i}`} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
