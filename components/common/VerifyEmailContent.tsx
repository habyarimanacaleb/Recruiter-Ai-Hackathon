"use client";

import React, { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Loader2, MailCheck } from "lucide-react";
import { toast } from "sonner";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  // const handleVerify = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   // Use emailOtp plugin method
  //   await authClient.emailOtp.verifyEmail(
  //     {
  //       email: email,
  //       otp: code,
  //     },
  //     {
  //       onSuccess: () => {
  //         toast.success("Account verified successfully!");
  //         router.push("/auth/login");
  //       },
  //       onError: (ctx) => {
  //         setLoading(false);
  //         toast.error(ctx.error.message || "Invalid code");
  //       },
  //     },
  //   );
  // };

  // const handleResend = async () => {
  //   await authClient.emailOtp.sendVerificationOtp({
  //     email: email,
  //     type: "email-verification",
  //   });
  //   toast.info("New code sent!");
  // };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50/50 p-4">
      <form  className="w-full max-w-md">
        <Card className="border-border/50 shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-blue-50">
                <MailCheck className="w-10 h-10 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">
              Verify your email
            </CardTitle>
            <CardDescription>
              We've sent a code to{" "}
              <span className="font-semibold text-gray-900">{email}</span>
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Input
                id="code"
                placeholder="Enter code"
                className="h-12 text-center text-2xl tracking-[0.5em] font-bold"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-blue-600 hover:bg-blue-500 rounded-full"
              disabled={loading || code.length < 1}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Account"
              )}
            </Button>

            <button
              type="button"
              className="text-sm text-blue-600 hover:underline font-medium"
              // onClick={handleResend}
            >
              Didn't get a code? Resend
            </button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

export default VerifyEmailContent;
