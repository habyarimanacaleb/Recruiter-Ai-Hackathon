import { Candidate, StatColor } from "@/types";
import { BarChart3, CalendarDays, LayoutDashboard, Mail, Star, Users } from "lucide-react";

export const STATS = [
  { label: "Resumes Uploaded", value: "10",   iconName: "upload"   as const, color: "blue" as StatColor },
  { label: "Screened by AI",   value: "7/10", iconName: "sparkles" as const, color: "violet" as StatColor, progress: 70 },
  { label: "Shortlisted",      value: "4",    iconName: "star"     as const, color: "indigo" as StatColor },
  { label: "Emails Sent",      value: "2",    iconName: "mail"     as const, color: "emerald" as StatColor },
];

// @/constants/index.ts or wherever your constants live
export const FAKE_CANDIDATES: Candidate[] = [
  { 
    id: "cand_1", 
    rank: 1, 
    name: "Chris Evans", 
    email: "c.evans@example.com", 
    roleApplied: "Frontend Engineer", 
    aiScore: 98, 
    status: "Shortlisted",
    skillsMatch: ["React", "TypeScript", "Tailwind CSS"].length,
    skills: ["React", "TypeScript", "Tailwind CSS"],
    experience: "5+ years",
    education: "B.S. Computer Science"
  },
  { 
    id: "cand_2", 
    rank: 2, 
    name: "Sam Taylor", 
    email: "s.taylor@example.com", 
    roleApplied: "UX Designer", 
    aiScore: 95, 
    status: "Screened",
    skillsMatch: ["Figma", "Adobe XD", "User Research"].length,
    skills: ["Figma", "Adobe XD", "User Research"],
    experience: "3+ years",
    education: "B.A. Graphic Design"
  },
  { 
    id: "cand_3", 
    rank: 3, 
    name: "Taylor Reed", 
    email: "t.reed@example.com", 
    roleApplied: "Full Stack Developer", 
    aiScore: 92, 
    status: "Screened",
    skillsMatch: ["Next.js", "Node.js", "PostgreSQL"].length,
    skills: ["Next.js", "Node.js", "PostgreSQL"],
    experience: "4 years",
    education: "B.S. Software Engineering"
  },
  // Add additional candidates following this structure...
  { 
    id: "cand_4", 
    rank: 4, 
    name: "Morgan Lee", 
    email: "m.lee@example.com", 
    roleApplied: "Full Stack Developer", 
    aiScore: 90, 
    status: "Rejected",
    skillsMatch: ["React", "Express", "MongoDB"].length,
    skills: ["React", "Express", "MongoDB"],
    experience: "2 years",
    education: "Self-taught"
  },
  { 
    id: "cand_5", 
    rank: 5, 
    name: "Sasha Petrova", 
    email: "s.petrova@example.com", 
    roleApplied: "UX Designer", 
    aiScore: 89, 
    status: "Emailed",
    skillsMatch: ["Prototyping", "UI Design", "Testing"].length,
    skills: ["Prototyping", "UI Design", "Testing"],
    experience: "5 years",
    education: "M.S. Human-Computer Interaction"
  },
  { 
    id: "cand_6", 
    rank: 5, 
    name: "Sasha Petrova", 
    email: "s.petrova@example.com", 
    roleApplied: "UX Designer", 
    aiScore: 89, 
    status: "Emailed",
    skillsMatch: ["Prototyping", "UI Design", "Testing"].length,
    skills: ["Prototyping", "UI Design", "Testing"],
    experience: "5 years",
    education: "M.S. Human-Computer Interaction"
  },
  { 
    id: "cand_7", 
    rank: 5, 
    name: "Sasha Petrova", 
    email: "s.petrova@example.com", 
    roleApplied: "UX Designer", 
    aiScore: 89, 
    status: "Emailed",
    skillsMatch: ["Prototyping", "UI Design", "Testing"].length,
    skills: ["Prototyping", "UI Design", "Testing"],
    experience: "5 years",
    education: "M.S. Human-Computer Interaction"
  },
  { 
    id: "cand_8", 
    rank: 5, 
    name: "Sasha Petrova", 
    email: "s.petrova@example.com", 
    roleApplied: "UX Designer", 
    aiScore: 89, 
    status: "Emailed",
    skillsMatch: ["Prototyping", "UI Design", "Testing"].length,
    skills: ["Prototyping", "UI Design", "Testing"],
    experience: "5 years",
    education: "M.S. Human-Computer Interaction"
  },
  { 
    id: "cand_9", 
    rank: 5, 
    name: "Sasha Petrova", 
    email: "s.petrova@example.com", 
    roleApplied: "UX Designer", 
    aiScore: 89, 
    status: "Emailed",
    skillsMatch: ["Prototyping", "UI Design", "Testing"].length,
    skills: ["Prototyping", "UI Design", "Testing"],
    experience: "5 years",
    education: "M.S. Human-Computer Interaction"
  },
  { 
    id: "cand_10", 
    rank: 5, 
    name: "Sasha Petrova", 
    email: "s.petrova@example.com", 
    roleApplied: "UX Designer", 
    aiScore: 89, 
    status: "Emailed",
    skillsMatch: ["Prototyping", "UI Design", "Testing"].length,
    skills: ["Prototyping", "UI Design", "Testing"],
    experience: "5 years",
    education: "M.S. Human-Computer Interaction"
  },
];


