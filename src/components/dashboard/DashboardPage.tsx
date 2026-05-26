import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { DashboardView } from './DashboardView';

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const displayName = session?.user?.name || 'Emily L.';
  const name = displayName.split(' ')[0] || 'Emily';
  const email = session?.user?.email || 'emily@example.com';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <DashboardView
      displayName={displayName}
      name={name}
      email={email}
      initials={initials}
    />
  );
}
