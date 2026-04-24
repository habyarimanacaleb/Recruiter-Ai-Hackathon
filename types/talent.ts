export interface TalentScore {
  overallScore: number;
  breakdown: {
    skills: number;
    experience: number;
    education: number;
    projects: number;
    profileCompleteness: number;
  };
  summary: string;
}

export interface Talent {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  headline: string;
  bio?: string;
  location: string;
  skills: { name: string; level: string; yearsOfExperience: number }[];
  experience: { company: string; role: string; startDate: string; endDate: string; description: string; technologies: string[]; isCurrent: boolean }[];
  education: { institution: string; degree: string; fieldOfStudy: string; startYear: number; endYear: number }[];
  projects: { name: string; description: string; technologies: string[]; role: string; link: string }[];
  availability: { status: string; type: string };
  socialLinks: { linkedin?: string; github?: string; portfolio?: string };
  talentScore: TalentScore;
  jobDescription?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TalentState {
  talents: Talent[];
  selectedTalent: Talent | null;
  isLoading: boolean;
  isScoring: boolean;
  error: string | null;

  // READ
  fetchTalents: () => Promise<void>;
  fetchTalent: (talentId: string) => Promise<void>;

  // SCORE
  scoreOneTalent: (talentId: string, jobDescriptionId: string) => Promise<void>;
  scoreAllTalents: (jobDescriptionId: string) => Promise<void>;

  // DELETE
  deleteTalent: (talentId: string) => Promise<void>;
  deleteTalentsByJob: (jobDescriptionId: string) => Promise<void>;

  // LOCAL HELPERS
  clearSelectedTalent: () => void;
  clearError: () => void;
}