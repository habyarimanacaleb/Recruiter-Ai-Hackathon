import { create } from 'zustand';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ── Enums ──────────────────────────────────────────────────────────────────────
export type SkillLevel     = "Beginner" | "Intermediate" | "Advanced" | "Expert";
export type ExperienceLevel = "Entry-level" | "Mid-level" | "Senior" | "Lead";
export type EmploymentType  = "Full-time" | "Part-time" | "Contract" | "Temporary";

// ── Sub-types ──────────────────────────────────────────────────────────────────
export interface RequiredSkill {
  name: string;
  minLevel: SkillLevel;
  yearsRequired: number;
}

export interface SalaryRange {
  min: number;
  max: number;
  currency: string;
}

// ── Main interface ─────────────────────────────────────────────────────────────
export interface JobDescription {
  _id: string;
  jobTitle: string;
  department: string;
  description: string;
  requiredSkills: RequiredSkill[];
  experienceLevel: ExperienceLevel;
  yearsOfExperienceRequired: number;
  salaryRange: SalaryRange;
  employmentType: EmploymentType;
  location: string;
  isRemote: boolean;
  responsibilities: string[];
  benefits: string[];
  createdAt: string;
  updatedAt: string;
}

export type JobFormData = Omit<JobDescription, '_id' | 'createdAt' | 'updatedAt'>;

// ── Store interface ────────────────────────────────────────────────────────────
interface JobState {
  form: JobFormData;
  jobs: JobDescription[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;

  setForm: (update: Partial<JobFormData>) => void;
  resetForm: () => void;

  createJob: () => Promise<void>;
  fetchJobs: () => Promise<void>;
  updateJob: (id: string, data: Partial<JobFormData>) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
}

// ── Defaults ───────────────────────────────────────────────────────────────────
const defaultForm: JobFormData = {
  jobTitle: '',
  department: '',
  description: '',
  requiredSkills: [],
  experienceLevel: 'Mid-level',
  yearsOfExperienceRequired: 0,
  salaryRange: { min: 0, max: 0, currency: 'USD' },
  employmentType: 'Full-time',
  location: '',
  isRemote: false,
  responsibilities: [],
  benefits: [],
};

// ── Store ──────────────────────────────────────────────────────────────────────
export const useJobStore = create<JobState>((set, get) => ({
  form: { ...defaultForm },
  jobs: [],
  isLoading: false,
  isSaving: false,
  error: null,

  setForm: (update) =>
    set((state) => ({ form: { ...state.form, ...update } })),

  resetForm: () => set({ form: { ...defaultForm }, error: null }),

  // CREATE
  createJob: async () => {
    const { form } = get();
    set({ isSaving: true, error: null });
    try {
      const res = await fetch(`${API_URL}/api/jobDescription/createJobDescription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to create job description');
      }
      const data = await res.json();
      set((state) => ({ jobs: [data.jobInfo, ...state.jobs], isSaving: false }));
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