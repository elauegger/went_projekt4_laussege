import { NextResponse } from 'next/server';
import { getAllJobs } from '@/lib/jobs';
import type { Job } from '@/types/job';

type SortDirection = 'asc' | 'desc';
type EmploymentType = Job['employmentType'];

const seniorityValues: Job['seniority'][] = [
  'Junior',
  'Mid-Level',
  'Senior',
  'Lead',
];

const employmentValues: EmploymentType[] = [
  'Full-time',
  'Part-time',
  'Contract',
  'Internship',
  'Remote',
];

const parseBoolean = (value: string | null): boolean | undefined => {
  if (!value) {
    return undefined;
  }

  if (value.toLowerCase() === 'true') {
    return true;
  }

  if (value.toLowerCase() === 'false') {
    return false;
  }

  return undefined;
};

const parseSeniority = (value: string | null): Job['seniority'] | undefined => {
  if (!value) {
    return undefined;
  }

  return seniorityValues.includes(value as Job['seniority'])
    ? (value as Job['seniority'])
    : undefined;
};

const parseEmployment = (value: string | null): EmploymentType | undefined => {
  if (!value) {
    return undefined;
  }

  return employmentValues.includes(value as EmploymentType)
    ? (value as EmploymentType)
    : undefined;
};

const parseSort = (value: string | null): SortDirection | undefined => {
  if (!value) {
    return undefined;
  }

  return value === 'asc' || value === 'desc' ? value : undefined;
};

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') ?? undefined;
  const skill = searchParams.get('skill') ?? undefined;
  const seniority = parseSeniority(searchParams.get('seniority'));
  const employmentType = parseEmployment(searchParams.get('employmentType'));
  const location = searchParams.get('location') ?? undefined;
  const company = searchParams.get('company') ?? undefined;
  const remote = parseBoolean(searchParams.get('remote'));
  const sortByCreatedAt = parseSort(searchParams.get('sort'));

  const jobs = await getAllJobs({
    query,
    skill,
    seniority,
    employmentType,
    location,
    company,
    remote,
    sortByCreatedAt,
  });

  return NextResponse.json(jobs);
};
