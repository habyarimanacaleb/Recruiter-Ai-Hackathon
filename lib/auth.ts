import { betterAuth } from "better-auth";
import { Resend } from "resend";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import clientPromise from "@/lib/db";
import { admin, emailOTP } from "better-auth/plugins";

const client = await clientPromise;
const db = client.db();

const resend = new Resend(process.env.RESEND_API_KEY);

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
        await resend.emails.send({
          from: "Recruiter AI <onboarding@resend.dev>",
          to: email,
          subject: "Verify Your Account - Recruiter AI",
          html: `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
              <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #2563eb; margin: 0;">Recruiter AI</h1>
                <p style="color: #666;">Hackathon 2026</p>
              </div>
              <div style="background-color: #f8fafc; padding: 30px; border-radius: 8px; text-align: center;">
                <p style="font-size: 16px; color: #334155; margin-bottom: 20px;">Hello! Use the code below to verify your account and start recruiting.</p>
                <div style="font-size: 36px; font-weight: bold; letter-spacing: 6px; color: #1e293b; margin: 20px 0;">
                  ${otp}
                </div>
                <p style="font-size: 14px; color: #94a3b8;">This code is valid for 10 minutes.</p>
              </div>
              <p style="font-size: 12px; color: #cbd5e1; text-align: center; margin-top: 20px;">
                If you didn't request this, please ignore this email.
              </p>
            </div>
          `,
        });
      },
    }),
  ],
});
