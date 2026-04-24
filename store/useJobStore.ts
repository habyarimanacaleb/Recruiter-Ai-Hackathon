import { create } from 'zustand';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3004';

export interface JobDescription {
  _id: string;
  jobTitle: string;
  department: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface JobState {
  // Form state
  jobTitle: string;
  department: string;
  jobDescription: string;

  // List state
  jobs: JobDescription[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;

  // Form actions
  setJobTitle: (title: string) => void;
  setDepartment: (dept: string) => void;
  setJobDescription: (desc: string) => void;
  resetForm: () => void;

  // CRUD
  createJob: () => Promise<void>;
  fetchJobs: () => Promise<void>;
  updateJob: (id: string, data: Partial<Pick<JobDescription, 'jobTitle' | 'department' | 'description'>>) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
}

export const useJobStore = create<JobState>((set, get) => ({
  jobTitle: '',
  department: '',
  jobDescription: '',
  jobs: [],
  isLoading: false,
  isSaving: false,
  error: null,

  setJobTitle: (jobTitle) => set({ jobTitle }),
  setDepartment: (department) => set({ department }),
  setJobDescription: (jobDescription) => set({ jobDescription }),
  resetForm: () => set({ jobTitle: '', department: '', jobDescription: '', error: null }),

  // CREATE
  createJob: async () => {
    const { jobTitle, department, jobDescription } = get();
    set({ isSaving: true, error: null });

    try {
      const res = await fetch(`${API_URL}/api/jobDescription/createJobDescription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobTitle, department, description: jobDescription }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to create job description');
      }

      const data = await res.json();
      // data.jobInfo is the newly created job
      set((state) => ({
        jobs: [data.jobInfo, ...state.jobs],
        isSaving: false,
      }));

      get().resetForm();
    } catch (err) {
      set({ isSaving: false, error: err instanceof Error ? err.message : 'Something went wrong' });
      throw err;
    }
  },

  // READ ALL
  fetchJobs: async () => {
    set({ isLoading: true, error: null });

    try {
      const res = await fetch(`${API_URL}/api/jobDescription/`);
      if (!res.ok) throw new Error('Failed to fetch job descriptions');

      const data = await res.json();
      set({ jobs: data.jobDescriptions, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: err instanceof Error ? err.message : 'Something went wrong' });
    }
  },

  // UPDATE
  updateJob: async (id, updatedData) => {
    set({ isSaving: true, error: null });

    try {
      const res = await fetch(`${API_URL}/api/jobDescription/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescriptionId: id, ...updatedData }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to update job description');
      }

      const data = await res.json();
      set((state) => ({
        jobs: state.jobs.map((j) => (j._id === id ? data.updated : j)),
        isSaving: false,
      }));
    } catch (err) {
      set({ isSaving: false, error: err instanceof Error ? err.message : 'Something went wrong' });
      throw err;
    }
  },

  // DELETE
  deleteJob: async (id) => {
    set({ error: null });

    try {
      const res = await fetch(`${API_URL}/api/jobDescription/delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to delete job description');
      }

      set((state) => ({ jobs: state.jobs.filter((j) => j._id !== id) }));
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Something went wrong' });
      throw err;
    }
  },
}));