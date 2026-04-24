import { create } from 'zustand';
import { useCandidateStore } from '@/store/useCandidateStore';

interface UploadedFile {
  id: string;
  file: File;
  status: 'pending' | 'done' | 'error';
}

interface ResumeState {
  files: UploadedFile[];
  isProcessing: boolean;
  error: string | null;

  addFiles: (newFiles: File[]) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;
  uploadResumes: () => Promise<void>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3004';

function mapProfileToCandidate(profile: any, index: number) {
  return {
    id: profile._id,
    rank: index + 1,
    name: `${profile.firstName} ${profile.lastName}`,
    email: profile.email,
    roleApplied: profile.headline || 'N/A',
    aiScore: profile.talentScore?.overallScore ?? 0,
    experience: profile.experience?.[0]?.role || 'N/A',
    education: profile.education?.[0]?.degree
      ? `${profile.education[0].degree} - ${profile.education[0].fieldOfStudy}`
      : 'N/A',
    skills: profile.skills?.map((s: any) => s.name) || [],
    status: 'Screened' as const,
  };
}

export const useResumeStore = create<ResumeState>((set, get) => ({
  files: [],
  isProcessing: false,
  error: null,

  addFiles: (newFiles) => {
    const { files } = get();

    // Check if trying to mix zip with other files
    const hasZip = files.some(f => f.file.name.endsWith('.zip')) ||
                   newFiles.some(f => f.name.endsWith('.zip'));
    const hasOther = files.some(f => !f.file.name.endsWith('.zip')) ||
                     newFiles.some(f => !f.name.endsWith('.zip'));

    if (hasZip && hasOther) {
      set({ error: 'Upload either 1 ZIP file or up to 20 PDF/DOCX files — not both.' });
      return;
    }

    // ZIP: only 1 allowed
    const incomingZips = newFiles.filter(f => f.name.endsWith('.zip'));
    if (incomingZips.length > 0) {
      if (files.length > 0) {
        set({ error: 'Remove existing files before uploading a ZIP.' });
        return;
      }
      if (incomingZips.length > 1) {
        set({ error: 'Only 1 ZIP file allowed.' });
        return;
      }
    }

    // PDF/DOCX: max 20
    const nonZip = newFiles.filter(f => !f.name.endsWith('.zip'));
    const currentNonZip = files.filter(f => !f.file.name.endsWith('.zip'));
    if (currentNonZip.length + nonZip.length > 20) {
      set({ error: 'Maximum 20 PDF/DOCX files allowed.' });
      return;
    }

    // Filter duplicates
    const unique = newFiles.filter(
      (newFile) => !files.some(
        (existing) => existing.file.name === newFile.name && existing.file.size === newFile.size
      )
    );

    if (unique.length === 0) return;

    const prepared: UploadedFile[] = unique.map((f) => ({
      id: crypto.randomUUID(),
      file: f,
      status: 'pending',
    }));

    set((state) => ({ files: [...state.files, ...prepared], error: null }));
  },

  removeFile: (id) =>
    set((state) => ({ files: state.files.filter((f) => f.id !== id), error: null })),

  clearFiles: () => set({ files: [], error: null }),

  uploadResumes: async () => {
    const { files } = get();
    if (files.length === 0) return;

    set({ isProcessing: true, error: null });

    try {
      const formData = new FormData();
      files.forEach((f) => formData.append('resumes', f.file));

      const res = await fetch(`${API_URL}/api/talent/getData`, {
        method: 'POST',
        body: formData,
        // No Content-Type header — browser sets it with the correct boundary
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Upload failed');
      }

      const data = await res.json();
      // data.saved = [{ file: string, profile: TalentProfileType }]

      const candidates = data.saved.map(
        (item: { file: string; profile: any }, index: number) =>
          mapProfileToCandidate(item.profile, index)
      );

      useCandidateStore.getState().setCandidates(candidates);

      set({ isProcessing: false, files: [] }); // clear files after success
    } catch (err) {
      set({
        isProcessing: false,
        error: err instanceof Error ? err.message : 'Failed to process resumes.',
      });
      throw err;
    }
  },
}));