"use client";
import { authClient } from "../lib/auth-client";
import { useCallback } from "react";
import { Loader2, AlertCircle } from "lucide-react";

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
      <div className="w-full rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface-raise)] p-4 flex items-center justify-center gap-3 text-sm text-[var(--color-muted)]">
        <Loader2 className="h-4 w-4 animate-spin" />
        Session wird geladen...
      </div>
    );
  }
  if (error) {
    return (
      <div className="w-full rounded-2xl border border-[#d8a4a4] bg-[#faecec] p-4 text-sm text-[#8b4343] flex items-start gap-3">
        <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
        <div>
          <strong>Fehler beim Laden der Session</strong>
          <p className="text-xs mt-1">{String(error?.message ?? error)}</p>
        </div>
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
          className="inline-flex items-center justify-center rounded-full border border-[var(--color-line)] bg-white px-4 py-2 text-sm font-semibold text-[var(--color-olive-strong)] transition hover:bg-[var(--color-surface-raise)]"
        >
          Mit Microsoft anmelden
        </button>
      )}
    </>
  );
}