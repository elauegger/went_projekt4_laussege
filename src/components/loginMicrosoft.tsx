"use client";
import { authClient } from "@/lib/auth-client";
import { useCallback } from "react";

export function LoginMicrosoft() {
  const {
    data: session,
    isPending,
    error,
    refetch,
  } = authClient.useSession();

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

  const handleMicrosoftLogin = async () => {
    await authClient.signIn.social({
      provider: "microsoft",
      callbackURL: "/",
    });
  };

  return (
    <>
      {!session && (

        <button
          type="button"
          onClick={handleMicrosoftLogin}
          className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-5 py-2.5 text-lg font-medium text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Sign in with Microsoft
        </button>

      )}
    </>
  );
}