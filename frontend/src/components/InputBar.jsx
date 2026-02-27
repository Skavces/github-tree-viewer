import { useState, useEffect, useRef } from 'react';
import { parseGitHubUrl } from '../lib/parseGithubUrl';

export default function InputBar({ onSubmit, isLoading }) {
  const [value, setValue] = useState('');
  const [isValid, setIsValid] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!value.trim()) {
      setIsValid(null);
      return;
    }
    setIsValid(!!parseGitHubUrl(value));
  }, [value]);

  const handleSubmit = () => {
    const parsed = parseGitHubUrl(value);
    if (!parsed) return;
    onSubmit(parsed.fullUrl, parsed.branch);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey || !e.shiftKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handlePaste = (e) => {
    setTimeout(() => {
      const pasted = e.target.value;
      const parsed = parseGitHubUrl(pasted);
      if (parsed) {
        setValue(pasted);
      }
    }, 0);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-accent/20 via-accent/10 to-accent/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
        <div className="relative flex items-center gap-3 bg-surface-2 border border-border rounded-xl px-4 py-3 focus-within:border-accent/50 transition-colors">
          <svg
            className="w-5 h-5 text-text-muted flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.12a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L4.34 8.22"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder="Paste a GitHub repository URL..."
            className="flex-1 bg-transparent text-text-primary placeholder:text-text-muted outline-none text-sm font-mono"
            spellCheck={false}
            id="repo-input"
          />
          {isValid !== null && (
            <div
              className={`w-2 h-2 rounded-full flex-shrink-0 transition-colors ${
                isValid ? 'bg-emerald-400' : 'bg-red-400'
              }`}
            />
          )}
          <button
            onClick={handleSubmit}
            disabled={!isValid || isLoading}
            className="flex-shrink-0 px-5 py-2 bg-accent hover:bg-accent-hover disabled:bg-surface-3 disabled:text-text-muted text-white text-sm font-medium rounded-lg transition-all duration-150 active:scale-95 disabled:active:scale-100"
            id="generate-btn"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Loading
              </span>
            ) : (
              'Generate'
            )}
          </button>
        </div>
      </div>
      <p className="text-text-muted text-xs mt-2 text-center">
        Press <kbd className="px-1.5 py-0.5 bg-surface-3 rounded text-text-secondary text-xs">⌘ Enter</kbd> to generate
      </p>
    </div>
  );
}
