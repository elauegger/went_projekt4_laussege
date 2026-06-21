"use server";

import fs from "node:fs/promises";
import path from "node:path";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";

const hasWhitespace = (value: string) => /\s/.test(value);

export async function changePasswordAction(formData: FormData) {
  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Not authenticated");
  }

  if (!currentPassword || !newPassword) {
    redirect("/profile?passwordError=missing_fields");
  }

  if (newPassword.length < 8) {
    redirect("/profile?passwordError=too_short");
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

    redirect("/profile?passwordError=current_password");
  }

  redirect("/profile?success=password");
}

export async function updateProfileAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Not authenticated");
  }

  if (!name) {
    redirect("/profile?profileError=username_missing");
  }

  if (hasWhitespace(name)) {
    redirect("/profile?profileError=username_whitespace");
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

export async function deleteCvUploadAction(formData: FormData) {
  const cvId = formData.get("cvId") as string | null;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Not authenticated");
  }

  if (!cvId) {
    redirect("/profile");
  }

  const existingCv = await prisma.cv_uploads.findFirst({
    where: {
      id: cvId,
      userId: session.user.id,
    },
    select: {
      id: true,
      storageKey: true,
    },
  });

  if (!existingCv) {
    redirect("/profile");
  }

  const uploadPath = path.join(process.cwd(), "uploads", existingCv.storageKey);
  await fs.unlink(uploadPath).catch(() => undefined);

  await prisma.cv_uploads.delete({
    where: {
      id: existingCv.id,
    },
  });

  revalidatePath("/");
  revalidatePath("/profile");
  revalidatePath("/ai-analysis");
  revalidatePath("/cv-upload");

  redirect("/profile");
}

export async function signUpAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  //const emailVerified = 0; // Set emailVerified to 1 (true) upon sign-up

  if (!email || !password || !name) {
    redirect("/signup?error=missing_fields");
  }

  if (hasWhitespace(name)) {
    redirect("/signup?error=username_whitespace");
  }

  if (password.length < 8) {
    redirect("/signup?error=password_too_short");
  }

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
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect("/signin?error=missing_credentials");
  }

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

    redirect("/signin?error=invalid_credentials");
  }
  redirect("/");
}

export async function signOutAction() {
  await auth.api.signOut({
    headers: await headers(), // need headers to sign out the current session
  });

  redirect("/");
}
