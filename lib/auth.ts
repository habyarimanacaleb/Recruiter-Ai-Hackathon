import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import clientPromise from "@/lib/db";
import { admin, emailOTP } from "better-auth/plugins";

const client = await clientPromise;
const db = client.db();

export const auth = betterAuth({
  experimental: { joins: true },
  rateLimit: { enabled: false },
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    autoSignInAfterVerification: true,
  },
  plugins: [
    admin({ defaultRole: "Recruiter" }),
    emailOTP({
      sendVerificationOnSignUp: true,
      sendVerificationOTP: async ({ email, otp,type }) => {
        console.log(`Verification Code for ${email}: ${otp} (Type: ${type})`);
        // Add your Resend/Nodemailer logic here
      },
    }),
  ],
});
