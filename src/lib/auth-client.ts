import { createAuthClient } from "better-auth/react";

// Use same-origin requests in the browser. This avoids broken localhost fallbacks in production.
export const authClient = createAuthClient({});