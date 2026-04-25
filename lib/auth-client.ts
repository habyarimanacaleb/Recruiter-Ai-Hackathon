import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

const authConfig = {
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
  plugins: [
    adminClient(),
    // emailOTPClient()
  ],
};

export const authClient = createAuthClient(authConfig) as ReturnType<
  typeof createAuthClient<typeof authConfig>
>;
