import { create } from 'zustand';
import { Candidate } from '@/types';
import { FAKE_CANDIDATES } from '@/constants';

interface CandidateState {
  candidates: Candidate[];
  selectedIds: string[];
  searchQuery: string;
  statusFilter: string;
  isLoading: boolean;
  
  // Actions
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: string) => void;
  setCandidates: (candidates: Candidate[]) => void;
  updateStatus: (id: string, status: Candidate['status']) => Promise<void>;
  bulkUpdateStatus: (ids: string[], status: Candidate['status']) => Promise<void>;
  toggleSelection: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;
  
  // Logic Getters
  getFilteredCandidates: () => Candidate[];
  exportToCSV: () => void;
  getStats: () => { total: number; shortlisted: number; averageScore: number; };
}

export const useCandidateStore = create<CandidateState>((set, get) => ({
  candidates: FAKE_CANDIDATES,
  selectedIds: [],
  searchQuery: '',
  statusFilter: 'All',
  isLoading: false,

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setCandidates: (candidates) => set({ candidates }),

  getFilteredCandidates: () => {
    const { candidates, searchQuery, statusFilter } = get();
    return candidates.filter((c) => {
      const matchesSearch = 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.roleApplied.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.skills?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ?? false);
      
      const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  },

  exportToCSV: () => {
    const data = get().getFilteredCandidates();
    const headers = ["Rank,Name,Email,Role,Score,Status"];
    const rows = data.map(c => `${c.rank},${c.name},${c.email},${c.roleApplied},${c.aiScore},${c.status}`);
    const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "candidates_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  updateStatus: async (id, status) => {
    set({ candidates: get().candidates.map(c => c.id === id ? { ...c, status } : c) });
  },

  bulkUpdateStatus: async (ids, status) => {
    set({
      candidates: get().candidates.map(c => ids.includes(c.id) ? { ...c, status } : c),
      selectedIds: []
    });
  },

  toggleSelection: (id) => set((state) => ({
    selectedIds: state.selectedIds.includes(id) ? state.selectedIds.filter(i => i !== id) : [...state.selectedIds, id]
  })),

  selectAll: (ids) => set({ selectedIds: ids }),
  clearSelection: () => set({ selectedIds: [] }),

  getStats: () => {
    const { candidates } = get();
    return {
      total: candidates.length,
      shortlisted: candidates.filter(c => c.status === 'Shortlisted').length,
      averageScore: Math.round(candidates.reduce((acc, c) => acc + c.aiScore, 0) / candidates.length) || 0
    };
  }
}));
