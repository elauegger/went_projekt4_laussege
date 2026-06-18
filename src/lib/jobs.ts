import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import type { Job } from '../types/job';
import { groq } from './groq';

const dataPath = path.join(process.cwd(), 'data', 'jobs.json');

const companyPool = [
  'Tech Solutions GmbH',
  'Digital Innovations AG',
  'CodeCraft GmbH',
  'WebWorks GmbH',
  'CloudOps Studio',
  'DataForge Labs',
  'NeuralWorks',
  'NextGen Software',
  'Atlas Systems',
  'Vertex Labs',
  'Nova Digital',
  'Hyperion Tech',
  'BluePeak AI',
  'Greenline Cloud',
  'Aurum Analytics',
  'Pulse Platform',
  'Vantage Data',
  'OmniStack',
  'Brightscale',
  'Signal Ridge',
];

const locationPool = [
  'Munich, Germany',
  'Berlin, Germany',
  'Hamburg, Germany',
  'Vienna, Austria',
  'Zurich, Switzerland',
  'Amsterdam, Netherlands',
  'Paris, France',
  'London, UK',
  'Copenhagen, Denmark',
  'Stockholm, Sweden',
  'Madrid, Spain',
  'Milan, Italy',
  'Dublin, Ireland',
  'Warsaw, Poland',
  'Lisbon, Portugal',
  'Remote (EU)',
  'Remote (Global)',
];

const employmentPool: Job['employmentType'][] = [
  'Full-time',
  'Part-time',
  'Contract',
  'Internship',
  'Remote',
];

const seniorityPool: Job['seniority'][] = [
  'Junior',
  'Mid-Level',
  'Senior',
  'Lead',
];

const salaryBands: Record<Job['seniority'], { min: number; max: number }> = {
  Junior: { min: 48000, max: 65000 },
  'Mid-Level': { min: 65000, max: 90000 },
  Senior: { min: 85000, max: 115000 },
  Lead: { min: 100000, max: 135000 },
};

const currencyFor = (location: string) => {
  if (location.includes('Switzerland')) {
    return 'CHF';
  }

  if (location.includes('Remote (Global)')) {
    return 'USD';
  }

  return 'EUR';
};

const buildSalaryRange = (seniority: Job['seniority'], location: string) => {
  const band = salaryBands[seniority] ?? salaryBands['Mid-Level'];
  return {
    min: band.min,
    max: band.max,
    currency: currencyFor(location),
  };
};

const employmentTypes: Job['employmentType'][] = [
  'Full-time',
  'Part-time',
  'Contract',
  'Internship',
  'Remote',
];

const seniorityLevels: Job['seniority'][] = [
  'Junior',
  'Mid-Level',
  'Senior',
  'Lead',
];

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string');

const isSalaryRange = (value: unknown): value is Job['salaryRange'] => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const range = value as Record<string, unknown>;

  return (
    typeof range.min === 'number' &&
    typeof range.max === 'number' &&
    typeof range.currency === 'string'
  );
};

const isJob = (value: unknown): value is Job => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const job = value as Record<string, unknown>;

  if (
    typeof job.id !== 'string' ||
    typeof job.title !== 'string' ||
    typeof job.company !== 'string' ||
    typeof job.location !== 'string' ||
    typeof job.employmentType !== 'string' ||
    typeof job.seniority !== 'string' ||
    typeof job.description !== 'string' ||
    typeof job.remote !== 'boolean' ||
    typeof job.createdAt !== 'string'
  ) {
    return false;
  }

  if (!employmentTypes.includes(job.employmentType as Job['employmentType'])) {
    return false;
  }

  if (!seniorityLevels.includes(job.seniority as Job['seniority'])) {
    return false;
  }

  if (!isStringArray(job.requirements)) {
    return false;
  }

  if (!isStringArray(job.responsibilities)) {
    return false;
  }

  if (!isStringArray(job.skills)) {
    return false;
  }

  if (!isStringArray(job.keywords)) {
    return false;
  }

  if (job.companyLogo !== undefined && typeof job.companyLogo !== 'string') {
    return false;
  }

  if (job.benefits !== undefined && !isStringArray(job.benefits)) {
    return false;
  }

  if (job.salaryRange !== undefined && !isSalaryRange(job.salaryRange)) {
    return false;
  }

  if (job.matchScore !== undefined && typeof job.matchScore !== 'number') {
    return false;
  }

  return true;
};

const normalize = (value: string) => value.trim().toLowerCase();

const matchesQuery = (job: Job, query: string) => {
  const needle = normalize(query);

  if (!needle) {
    return true;
  }

  return [
    job.title,
    job.company,
    ...job.skills,
    ...job.keywords,
  ].some((value) => normalize(value).includes(needle));
};

const matchesSkill = (job: Job, skill: string) => {
  const needle = normalize(skill);

  if (!needle) {
    return true;
  }

  return job.skills.some((value) => normalize(value).includes(needle));
};

const sortByCreatedAt = (jobs: Job[], direction: 'asc' | 'desc') => {
  const factor = direction === 'asc' ? 1 : -1;

  return [...jobs].sort((left, right) => {
    const leftDate = Date.parse(left.createdAt);
    const rightDate = Date.parse(right.createdAt);

    return (leftDate - rightDate) * factor;
  });
};

// Expand the JSON dataset to support larger-scale testing until a database
// or matching pipeline is introduced.
const expandJobs = (jobs: Job[], targetCount = 120): Job[] => {
  if (jobs.length >= targetCount || jobs.length === 0) {
    return jobs;
  }

  const expanded = [...jobs];
  let index = 0;

  while (expanded.length < targetCount) {
    const base = jobs[index % jobs.length];
    const company = companyPool[index % companyPool.length];
    const location = locationPool[(index * 3) % locationPool.length];
    const employmentType = employmentPool[(index * 5) % employmentPool.length];
    const seniority = seniorityPool[(index * 7) % seniorityPool.length];
    const remote = employmentType === 'Remote' || location.startsWith('Remote');
    const createdAt = new Date(
      Date.parse(base.createdAt) + (index + 1) * 24 * 60 * 60 * 1000
    ).toISOString();

    expanded.push({
      ...base,
      id: `job-${expanded.length + 1}`,
      company,
      location,
      employmentType,
      seniority,
      remote,
      salaryRange: buildSalaryRange(seniority, location),
      createdAt,
    });

    index += 1;
  }

  return expanded;
};

export type JobFilters = {
  query?: string;
  skill?: string;
  seniority?: Job['seniority'];
  employmentType?: Job['employmentType'];
  location?: string;
  company?: string;
  remote?: boolean;
  sortByCreatedAt?: 'asc' | 'desc';
};

// Centralized data access keeps API routes thin and prepares a single place
// to inject future matching logic (e.g. skill extraction, semantic scoring).
const applyFilters = (jobs: Job[], filters?: JobFilters) => {
  if (!filters) {
    return jobs;
  }

  const {
    query,
    skill,
    seniority,
    employmentType,
    location,
    company,
    remote,
    sortByCreatedAt: sort,
  } = filters;

  let result = jobs;

  if (query) {
    result = result.filter((job) => matchesQuery(job, query));
  }

  if (skill) {
    result = result.filter((job) => matchesSkill(job, skill));
  }

  if (seniority) {
    result = result.filter((job) => job.seniority === seniority);
  }

  if (employmentType) {
    result = result.filter((job) => job.employmentType === employmentType);
  }

  if (location) {
    const needle = normalize(location);
    result = result.filter((job) => normalize(job.location).includes(needle));
  }

  if (company) {
    const needle = normalize(company);
    result = result.filter((job) => normalize(job.company).includes(needle));
  }

  if (typeof remote === 'boolean') {
    result = result.filter((job) => job.remote === remote);
  }

  if (sort) {
    result = sortByCreatedAt(result, sort);
  }

  return result;
};

const readJobs = async (): Promise<Job[]> => {
  const raw = await fs.readFile(dataPath, 'utf8');
  const parsed = JSON.parse(raw) as unknown;

  if (!Array.isArray(parsed) || !parsed.every(isJob)) {
    throw new Error('Invalid jobs data shape.');
  }

  return expandJobs(parsed);
};

export const getAllJobs = async (filters?: JobFilters): Promise<Job[]> => {
  const jobs = await readJobs();

  return applyFilters(jobs, filters);
};

const AIMatchSchema = z.object({
  matches: z
    .array(
      z.object({
        id: z.string(),
        score: z.number().min(0).max(100),
      }),
    )
    .default([]),
});

const clampAiMatchScore = (score: number) => Math.min(100, Math.max(0, score));
const clampHeuristicMatchScore = (score: number) =>
  Math.min(99, Math.max(10, score));

/**
 * Computes a 0-100 match score between a CV's extracted text and a job.
 * Uses keyword + skill overlap as a simple fallback and preselection heuristic.
 */
export const computeMatchScore = (extractedText: string, job: Job): number => {
  if (!extractedText) return 0;

  const cvWords = new Set(
    extractedText
      .toLowerCase()
      .split(/[\s,;:()\[\]\-\/\n]+/)
      .filter((w) => w.length > 2),
  );

  const jobTerms = [
    ...job.skills,
    ...job.keywords,
    ...(job.requirements ?? []),
  ].map((t) => t.toLowerCase());

  if (jobTerms.length === 0) return 0;

  const matches = jobTerms.filter((term) => {
    const words = term.split(/\s+/);
    return words.every((w) => cvWords.has(w));
  });

  const raw = Math.round((matches.length / jobTerms.length) * 100);
  // Clamp between 10 and 99 so scores always feel plausible
  return clampHeuristicMatchScore(raw);
};

const summarizeJobForMatching = (job: Job) => ({
  id: job.id,
  title: job.title,
  company: job.company,
  location: job.location,
  employmentType: job.employmentType,
  seniority: job.seniority,
  description: job.description,
  requirements: job.requirements,
  responsibilities: job.responsibilities,
  skills: job.skills,
  keywords: job.keywords,
  remote: job.remote,
});

const getAiMatchScores = async (
  extractedText: string,
  candidateJobs: Job[],
): Promise<Map<string, number>> => {
  if (!process.env.GROQ_API_KEY) {
    return new Map();
  }

  const response = await groq.chat.completions.create({
    model: process.env.GROQ_MODEL ?? 'llama-3.1-8b-instant',
    temperature: 0,
    top_p: 1,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content:
          'Bewerte Job-Matches deterministisch und konsistent. Antworte ausschließlich mit gültigem JSON. Bewerte, wie gut der Lebenslauf fachlich, erfahrungsbezogen und senioritätsbezogen zur Stelle passt. Verwende nur die gegebenen Job-IDs.',
      },
      {
        role: 'user',
        content: `
Analysiere, wie gut dieser Lebenslauf zu den folgenden Jobs passt.

Gib exakt dieses JSON zurück:

{
  "matches": [
    { "id": "job-id", "score": 0 }
  ]
}

Wichtig:
- Kein Markdown
- Keine Erklärungen außerhalb des JSON
- score muss eine Zahl von 0 bis 100 sein
- Gib für jeden Job genau einen Eintrag zurück
- Bewerte Skills, Technologien, Aufgaben, Erfahrung, Seniorität und Rollenprofil
- Wenn wichtige Anforderungen fehlen, senke den Score

Lebenslauf:
${extractedText.slice(0, 7000)}

Jobs:
${JSON.stringify(candidateJobs.map(summarizeJobForMatching))}
`,
      },
    ],
  });

  const text = response.choices[0]?.message?.content;

  if (!text) {
    return new Map();
  }

  const parsed = AIMatchSchema.parse(JSON.parse(text));

  return new Map(
    parsed.matches.map((match) => [
      match.id,
      clampAiMatchScore(Math.round(match.score)),
    ]),
  );
};

/**
 * Returns the top N jobs sorted by AI match score for a given CV text.
 */
export const getTopMatchingJobs = async (
  extractedText: string,
  limit = 5,
): Promise<Array<Job & { matchScore: number }>> => {
  const jobs = await readJobs();
  const preselectedJobs = jobs
    .map((job) => ({ ...job, matchScore: computeMatchScore(extractedText, job) }))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, Math.max(20, limit * 8));

  try {
    const aiScores = await getAiMatchScores(extractedText, preselectedJobs);

    if (aiScores.size > 0) {
      return preselectedJobs
        .map((job) => ({
          ...job,
          matchScore: aiScores.get(job.id) ?? job.matchScore,
        }))
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, limit);
    }
  } catch (error) {
    console.error('AI job matching error:', error);
  }

  return preselectedJobs.slice(0, limit);
};

export const getJobById = async (id: string): Promise<Job | undefined> => {
  const jobs = await readJobs();

  return jobs.find((job) => job.id === id);
};

export const getJobsBySkill = async (skill: string): Promise<Job[]> =>
  getAllJobs({ skill });

export const searchJobs = async (query: string): Promise<Job[]> =>
  getAllJobs({ query });
