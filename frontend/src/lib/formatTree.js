export function toAscii(tree, { icons = false } = {}) {
  const lines = [];
  renderAscii(tree, '', true, lines, icons);
  return lines.join('\n');
}

function renderAscii(nodes, prefix, isRoot, lines, icons) {
  nodes.forEach((node, i) => {
    const isLast = i === nodes.length - 1;
    const connector = isRoot ? '' : isLast ? '└── ' : '├── ';
    const icon = icons
      ? node.type === 'dir'
        ? '📁 '
        : '📄 '
      : '';
    const suffix = node.type === 'dir' ? '/' : '';
    lines.push(`${prefix}${connector}${icon}${node.name}${suffix}`);

    if (node.children) {
      const childPrefix = isRoot ? '' : prefix + (isLast ? '    ' : '│   ');
      renderAscii(node.children, childPrefix, false, lines, icons);
    }
  });
}

export function toMarkdown(tree, { icons = false } = {}) {
  const lines = [];
  renderMarkdown(tree, 0, lines, icons);
  return lines.join('\n');
}

function renderMarkdown(nodes, depth, lines, icons) {
  nodes.forEach((node) => {
    const indent = '  '.repeat(depth);
    const icon = icons
      ? node.type === 'dir'
        ? '📁 '
        : '📄 '
      : '';
    const bold = node.type === 'dir' ? '**' : '';
    const suffix = node.type === 'dir' ? '/' : '';
    lines.push(`${indent}- ${icon}${bold}${node.name}${suffix}${bold}`);

    if (node.children) {
      renderMarkdown(node.children, depth + 1, lines, icons);
    }
  });
}

export function toJson(tree) {
  return JSON.stringify(tree, null, 2);
}

export function toPlain(tree, { icons = false } = {}) {
  const lines = [];
  renderPlain(tree, 0, lines, icons);
  return lines.join('\n');
}

function renderPlain(nodes, depth, lines, icons) {
  nodes.forEach((node) => {
    const indent = '  '.repeat(depth);
    const icon = icons
      ? node.type === 'dir'
        ? '📁 '
        : '📄 '
      : '';
    const suffix = node.type === 'dir' ? '/' : '';
    lines.push(`${indent}${icon}${node.name}${suffix}`);

    if (node.children) {
      renderPlain(node.children, depth + 1, lines, icons);
    }
  });
}

export function formatTree(tree, format = 'ascii', { icons = false } = {}) {
  switch (format) {
    case 'ascii':
      return toAscii(tree, { icons });
    case 'markdown':
      return toMarkdown(tree, { icons });
    case 'json':
      return toJson(tree);
    case 'plain':
      return toPlain(tree, { icons });
    default:
      return toAscii(tree, { icons });
  }
}
