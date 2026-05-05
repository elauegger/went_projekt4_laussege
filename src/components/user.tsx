'use client';
import Image from 'next/image';
import { useCallback } from 'react';
import { authClient } from '@/lib/auth-client';

export function User() {
  const { data: session, isPending, error, refetch } = authClient.useSession();

  const handleRefresh = useCallback(() => {
    void refetch();
  }, [refetch]);

  if (isPending) {
    return (
      <div className="w-full max-w-3xl rounded-md border p-4 text-sm text-gray-700">
        Loading session...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-3xl rounded-md border p-4 text-sm text-red-700">
        Error loading session: {String(error?.message ?? error)}
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl rounded-md border p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">User Profile</h2>
        <button
          type="button"
          onClick={handleRefresh}
          className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>

      {session?.user ? (
        <div className="flex items-start gap-4">
          {session.user.image && (
            <Image
              src={session.user.image}
              alt={session.user.name || 'User'}
              width={64}
              height={64}
              className="h-16 w-16 rounded-full object-cover border"
            />
          )}
          <div>
            <h3 className="text-xl font-medium text-gray-900">
              {session.user.name}
            </h3>
            <p className="text-gray-500">{session.user.email}</p>
            <div className="mt-2 text-xs text-gray-400">
              User ID: {session.user.id}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-gray-500">No user data available</div>
      )}

      <div className="mt-6 pt-4 border-t">
        <details className="text-sm text-gray-500">
          <summary className="cursor-pointer hover:text-gray-700">
            View Raw Session Data
          </summary>
          <pre className="mt-2 overflow-auto rounded bg-gray-50 p-3 text-xs">
            {JSON.stringify(session, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
}
