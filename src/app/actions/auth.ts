"use server";


import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";


export async function changePasswordAction(formData: FormData) {
  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Not authenticated");
  }

  try {
    await auth.api.changePassword({
      headers: await headers(),
      body: {
        currentPassword,
        newPassword,
      },
    });
  } catch (err: any) {
    console.error("Password change error:", err);

    // optional sauberer UX-Fallback
    throw new Error("Current password is incorrect or invalid request");
  }
alert("Passwort erfolgreich geändernt");
}

export async function updateProfileAction(formData: FormData) {
  const name = formData.get("name") as string;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Not authenticated");
  }

  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      name,
    },
  });

  redirect("/profile");
}

export async function signUpAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;
  //const emailVerified = 0; // Set emailVerified to 1 (true) upon sign-up

  const captcha = (formData.get("captcha") as string) || null;

  await auth.api.signUpEmail({
    body: {
      email,
      password,
      name,
    },
    ...(captcha ? { headers: { "x-captcha-response": captcha } } : {}),
  });

  redirect("/");
}

export async function signInAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  try {
    const captcha = (formData.get("captcha") as string) || null;

    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      ...(captcha ? { headers: { "x-captcha-response": captcha } } : {}),
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