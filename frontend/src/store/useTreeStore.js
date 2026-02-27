import { create } from 'zustand';

export const useTreeStore = create((set) => ({
  repoUrl: '',
  branch: '',
  expandedAll: false,
  collapseSignal: 0,
  expandSignal: 0,
  outputFormat: 'ascii',
  showIcons: false,

  setRepoUrl: (url) => set({ repoUrl: url }),
  setBranch: (branch) => set({ branch }),
  setOutputFormat: (format) => set({ outputFormat: format }),
  toggleIcons: () => set((state) => ({ showIcons: !state.showIcons })),
  triggerExpandAll: () =>
    set((state) => ({ expandedAll: true, expandSignal: state.expandSignal + 1 })),
  triggerCollapseAll: () =>
    set((state) => ({ expandedAll: false, collapseSignal: state.collapseSignal + 1 })),
  reset: () =>
    set({ repoUrl: '', branch: '', expandedAll: false }),
}));
