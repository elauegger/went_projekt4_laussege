export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;

  location: string;
  employmentType:
    | "Full-time"
    | "Part-time"
    | "Contract"
    | "Internship"
    | "Remote";

  seniority:
    | "Junior"
    | "Mid-Level"
    | "Senior"
    | "Lead";

  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };

  description: string;

  requirements: string[];

  responsibilities: string[];

  skills: string[];

  keywords: string[];

  benefits?: string[];

  remote: boolean;

  createdAt: string;

  matchScore?: number;
}
