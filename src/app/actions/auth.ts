"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

export async function signUpAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;
  //const emailVerified = 0; // Set emailVerified to 1 (true) upon sign-up

  await auth.api.signUpEmail({
    body: {
      email,
      password,
      name,
    },
  });

  redirect("/");
}

export async function signInAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  try {
  await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });
  } catch (err: unknown) {
    console.error("Sign-in error:", err)

    // If it's a known auth error → redirect to error page
    const maybeAuthError = err as { code?: string } | undefined
    if (maybeAuthError?.code === "INVALID_CREDENTIALS") {
      redirect("/error?message=Invalid email or password")
    }
    // Otherwise → let Next.js handle it via error.tsx
    if (err instanceof Error) {
      throw err
    } else {
      throw new Error(String(err))
    }
  }
  redirect("/");
}

export async function signOutAction() {
  await auth.api.signOut({
    headers: await headers(), // need headers to sign out the current session
  });

  redirect("/");
}