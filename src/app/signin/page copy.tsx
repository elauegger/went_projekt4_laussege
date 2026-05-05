import { signInAction } from "../actions/auth";

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error: errorKey } = await searchParams;
  let errorMessage: string | null = null;
  if (errorKey === "invalid_credentials") {
    errorMessage = "Invalid email or password.";
  } else if (errorKey === "signin_failed") {
    errorMessage = "Sign in failed. Please try again.";
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-2xl font-bold">Sign In</h1>
      {errorMessage && (
        <div className="w-64 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-2">
          {errorMessage}
        </div>
      )}
      <form action={signInAction} className="flex flex-col gap-3 w-64">
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}