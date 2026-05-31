import { NextResponse } from 'next/server';
import { getJobById } from '@/lib/jobs';

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

export const GET = async (_request: Request, { params }: RouteParams) => {
  const { id } = await params;
  const job = await getJobById(id);

  if (!job) {
    return NextResponse.json({ message: 'Job not found' }, { status: 404 });
  }

  return NextResponse.json(job);
};
