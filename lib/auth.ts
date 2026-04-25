import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import clientPromise from "@/lib/db";
import { admin } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";

const client = await clientPromise;
const db = client.db("better-auth-db");

export const auth = betterAuth({
  experimental: { joins: true },
  trustedOrigins: [
    "http://localhost:3000",
    "https://your-production-domain.com",
  ],
  advanced: {
    defaultCookieAttributes: {
      sameSite: "none", // Required for cross-domain cookies
      secure: true, // Required for SameSite=None
      httpOnly: true,
    },
  },
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
  },
  emailVerification: {
    enabled: true,
    sendVerificationEmail: async ({ user, token }) => {
      // Implement your email sending logic here using your preferred email service
      console.log(
        `Send verification email to ${user.email} with token: ${token}`,
      );
    },
  },

  plugins: [admin({ defaultRole: "Recruiter" }), nextCookies()],
  admin: {
    enabled: true,
  },
});
