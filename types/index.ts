export type StatColor = "indigo" | "violet" | "emerald" | "blue";
export type UserRole = "admin" | "recruiter" | "user";

export type Candidate = {
  id: string;
  rank: number;
  name: string;
  email: string;
  avatar?: string;
  roleApplied: string;
  aiScore: number;
  skills?: string[] ;
  skillsMatch: number;
  experience: string;
  education: string;
  status: 'Rejected' | 'Emailed' | 'Interviewed' | 'Shortlisted' | 'Screened';
};
export interface UploadedFile {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}

export interface JobDescription {
  text: string;
  lastUpdated: Date | null;
}


