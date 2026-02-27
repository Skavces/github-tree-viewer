import TreeNode from './TreeNode';

export default function FileTree({ tree, meta }) {
  if (!tree || tree.length === 0) return null;

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-border bg-surface-1/30">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
          </svg>
          <h2 className="text-sm font-semibold text-text-primary">File Tree</h2>
        </div>
        {meta && (
          <div className="flex items-center gap-3 text-xs text-text-muted">
            <span>{meta.totalFiles} files</span>
            <span>{meta.totalDirs} folders</span>
          </div>
        )}
      </div>
      <div className="flex-1 overflow-auto p-2">
        {tree.map((node, i) => (
          <TreeNode key={`${node.name}-${i}`} node={node} depth={0} />
        ))}
      </div>
    </div>
  );
}
