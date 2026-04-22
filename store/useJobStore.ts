import { create } from 'zustand';
import { UploadedFile } from '@/types';

interface JobState {
  // Form State
  jobTitle: string;
  department: string;
  jobDescription: string;
  
  // File State
  files: UploadedFile[];
  isProcessing: boolean;
  error: string | null;
  
  // Actions
  setJobTitle: (title: string) => void;
  setDepartment: (dept: string) => void;
  setJobDescription: (desc: string) => void;
  addFiles: (newFiles: File[]) => void;
  removeFile: (id: string) => void;
  clearUploads: () => void;
  processBatch: () => Promise<void>;
}

const MAX_FILES = 50;

export const useJobStore = create<JobState>((set, get) => ({
  jobTitle: "",
  department: "",
  jobDescription: "",
  files: [],
  isProcessing: false,
  error: null,

  setJobTitle: (jobTitle) => set({ jobTitle }),
  setDepartment: (department) => set({ department }),
  setJobDescription: (jobDescription) => set({ jobDescription }),

  addFiles: (newFiles) => {
    const { files } = get();
    
    // Check if adding these would exceed the limit
    if (files.length >= MAX_FILES) {
      set({ error: `Maximum limit of ${MAX_FILES} files reached.` });
      return;
    }

    // 1. Filter out duplicates based on name and size
    const uniqueFiles = newFiles.filter(newFile => 
      !files.some(existing => 
        existing.file.name === newFile.name && 
        existing.file.size === newFile.size
      )
    ).slice(0, MAX_FILES - files.length); // Ensure we don't cross the limit with the new batch

    if (uniqueFiles.length === 0) return;

    // 2. Map to UploadedFile type
    const preparedFiles: UploadedFile[] = uniqueFiles.map(f => ({
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(7),
      file: f,
      progress: 0,
      status: 'pending' // Matches your "pending" | "uploading" | "done" | "error" type
    }));

    set((state) => ({ 
      files: [...state.files, ...preparedFiles],
      error: null 
    }));
  },

  removeFile: (id) => set((state) => ({
    files: state.files.filter(f => f.id !== id)
  })),

  clearUploads: () => set({ 
    files: [], 
    jobDescription: "", 
    jobTitle: "", 
    department: "", 
    error: null 
  }),

  processBatch: async () => {
    const { files, jobDescription, jobTitle } = get();
    
    if (files.length === 0) {
      set({ error: "Please upload at least one resume." });
      return;
    }
    
    if (!jobDescription || !jobTitle) {
      set({ error: "Please provide a job title and description." });
      return;
    }

    set({ isProcessing: true, error: null });

    try {
      // Logic for real API goes here:
      // const formData = new FormData();
      // formData.append('title', jobTitle);
      // files.forEach(f => formData.append('resumes', f.file));
      
      await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate AI analysis
      
      set({ isProcessing: false });
      // You might want to navigate to the results page here
    } catch (err) {
      set({ 
        isProcessing: false, 
        error: err instanceof Error ? err.message : "Failed to process resumes." 
      });
    }
  }
}));
