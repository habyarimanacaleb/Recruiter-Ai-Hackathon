import { TalentState } from '@/types/talent';
import { create } from 'zustand';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3004';


export const useTalentStore = create<TalentState>((set, get) => ({
  talents: [],
  selectedTalent: null,
  isLoading: false,
  isScoring: false,
  error: null,

  // ── GET ALL (ranked by score) ──────────────────────────────────────────
  fetchTalents: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/api/talent/getTalents`);
      if (!res.ok) throw new Error('Failed to fetch talents');

      const data = await res.json();
      set({ talents: data.talents, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: err instanceof Error ? err.message : 'Something went wrong' });
    }
  },

  fetchTalent: async (talentId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/api/talent/getTalentInfo`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ talentId }),
      });
      if (!res.ok) throw new Error('Failed to fetch talent');

      const data = await res.json();
      set({ selectedTalent: data.talentInfos, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: err instanceof Error ? err.message : 'Something went wrong' });
    }
  },


  scoreOneTalent: async (talentId, jobDescriptionId) => {
    set({ isScoring: true, error: null });
    try {
      const res = await fetch(`${API_URL}/api/talent/generateScore`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ talentId, jobDescriptionId }),
      });
      if (!res.ok) throw new Error('Failed to generate score');

      const data = await res.json();

      set((state) => ({
        isScoring: false,
        talents: state.talents.map((t) =>
          t._id === talentId ? data.updatedScore : t
        ),

        selectedTalent:
          state.selectedTalent?._id === talentId
            ? data.updatedScore
            : state.selectedTalent,
      }));
    } catch (err) {
      set({ isScoring: false, error: err instanceof Error ? err.message : 'Something went wrong' });
      throw err;
    }
  },

  scoreAllTalents: async (jobDescriptionId) => {
    set({ isScoring: true, error: null });
    try {
      const res = await fetch(`${API_URL}/api/talent/generateScoreForAll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescriptionId }),
      });
      if (!res.ok) throw new Error('Failed to score all talents');

      // After scoring all, re-fetch the full ranked list
      set({ isScoring: false });
      await get().fetchTalents();
    } catch (err) {
      set({ isScoring: false, error: err instanceof Error ? err.message : 'Something went wrong' });
      throw err;
    }
  },

  // ── DELETE ONE ────────────────────────────────────────────────────────
  deleteTalent: async (talentId) => {
    set({ error: null });
    try {
      const res = await fetch(`${API_URL}/api/talent/deleteTalent`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ talentId }),
      });
      if (!res.ok) throw new Error('Failed to delete talent');

      set((state) => ({
        talents: state.talents.filter((t) => t._id !== talentId),
        selectedTalent:
          state.selectedTalent?._id === talentId ? null : state.selectedTalent,
      }));
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Something went wrong' });
      throw err;
    }
  },

  // ── DELETE ALL BY JOB ─────────────────────────────────────────────────
  deleteTalentsByJob: async (jobDescriptionId) => {
    set({ error: null });
    try {
      const res = await fetch(`${API_URL}/api/talent/deleteTalentsByJobDescription`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescriptionId }),
      });
      if (!res.ok) throw new Error('Failed to delete talents');

      // Remove all talents linked to this job from local state
      set((state) => ({
        talents: state.talents.filter((t) => t.jobDescription !== jobDescriptionId),
        selectedTalent:
          state.selectedTalent?.jobDescription === jobDescriptionId
            ? null
            : state.selectedTalent,
      }));
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Something went wrong' });
      throw err;
    }
  },

  // ── LOCAL HELPERS ─────────────────────────────────────────────────────
  clearSelectedTalent: () => set({ selectedTalent: null }),
  clearError: () => set({ error: null }),
}));