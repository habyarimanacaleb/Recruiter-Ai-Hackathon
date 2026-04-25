// ─── Enums ────────────────────────────────────────────────────────────────────

export type TalentStatus = "Pending" | "Screened" | "Shortlisted" | "Emailed" | "Rejected";

export type SkillLevel = "Beginner" | "Intermediate" | "Advanced" | "Expert";

export type LanguageProficiency = "Basic" | "Conversational" | "Fluent" | "Native";

export type AvailabilityStatus = "Available" | "Open to Opportunities" | "Not Available";

export type AvailabilityType = "Full-time" | "Part-time" | "Contract";

// ─── Sub-types ────────────────────────────────────────────────────────────────

export interface TalentSkill {
  name: string;
  level: SkillLevel;
  yearsOfExperience: number;
}

export interface TalentLanguage {
  name: string;
  proficiency: LanguageProficiency;
}

export interface TalentCertification {
  name: string;
  issuer: string;
  issueDate: string;
}

export interface TalentExperience {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
  technologies: string[];
  isCurrent: boolean;
}

export interface TalentEducation {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: number;
  endYear: number;
}

export interface TalentProject {
  name: string;
  description: string;
  technologies: string[];
  role: string;
  link: string;
  startDate: string;  // ← was missing
  endDate: string;    // ← was missing
}

export interface TalentAvailability {
  status: AvailabilityStatus;  // ← was loose string
  type: AvailabilityType;      // ← was loose string
  startDate: string;           // ← was missing
}

export interface TalentSocialLinks {
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

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

// ─── Main Interface ───────────────────────────────────────────────────────────

export interface Talent {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  headline: string;
  bio?: string;
  location: string;
  status: TalentStatus;
  skills: TalentSkill[];
  languages: TalentLanguage[];           // ← was missing
  certifications: TalentCertification[]; // ← was missing
  experience: TalentExperience[];
  education: TalentEducation[];
  projects: TalentProject[];
  availability: TalentAvailability;
  socialLinks: TalentSocialLinks;
  talentScore: TalentScore;
  jobDescription?: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export interface TalentState {
  talents: Talent[];
  selectedTalent: Talent | null;
  isLoading: boolean;
  isScoring: boolean;
  error: string | null;

  fetchTalents: () => Promise<void>;
  fetchTalent: (talentId: string) => Promise<void>;
  fetchTalentsByStatus: (status: TalentStatus) => Promise<void>;

  scoreOneTalent: (talentId: string, jobDescriptionId: string) => Promise<void>;
  scoreAllTalents: (jobDescriptionId: string) => Promise<void>;

  updateTalentStatus: (talentId: string, status: TalentStatus) => Promise<void>;

  deleteTalent: (talentId: string) => Promise<void>;
  deleteTalentsByJob: (jobDescriptionId: string) => Promise<void>;

  clearSelectedTalent: () => void;
  clearError: () => void;
}