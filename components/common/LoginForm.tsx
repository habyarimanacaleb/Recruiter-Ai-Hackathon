"use client";

import React, { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Loader2, LockKeyhole } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import SocialMediaAuth from "./SocialMediaAuth";

function LoginFormUI() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    await authClient.signIn.email(
      {
        email,
        password,
        callbackURL: "/dashboard",
      },
      {
        onRequest: () => setLoading(true),
        onError: (ctx) => {
          setLoading(false);
          alert(ctx.error.message);
        },
        onSuccess: () => setLoading(false),
      },
    );
  };

  return (
    <form
      onSubmit={handleSignIn}
      className="w-full max-w-md animate-in fade-in zoom-in duration-500"
    >
      <Card className="border-border/50 bg-background/60 backdrop-blur-xl shadow-2xl">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            <div className="p-3 rounded-full bg-primary/10">
              <LockKeyhole className="w-10 h-10 text-blue-600 font-extrabold" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center tracking-tight">
            Welcome back
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="email" className="form-label text-xl font-normal">
              Email
            </label>
            <Input
              type="email"
              placeholder="name@example.com"
              className="h-11 bg-transparent border-gray-300 placeholder-gray-500/50 focus-visible:ring-blue-500"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="Name" className="form-label text-xl font-normal">
              Password
            </label>
            <Input
              type="password"
              placeholder="Create a password"
              className="h-11 bg-transparent border-gray-300 placeholder-gray-500/50 focus-visible:ring-blue-500"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button
            className="w-full h-11 text-base bg-blue-600 hover:bg-blue-500 text-gray-100 rounded-full font-medium transition-all hover:shadow-lg active:scale-[0.85]"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing account...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
          {/*Social-media Auth*/}
          <SocialMediaAuth />
        </CardContent>

        <CardFooter className="flex flex-col gap-4 border-t border-gray-100 pt-6">
          <p className="text-sm text-muted-foreground text-center">
            Don't have an account?{" "}
            <Link
              href="/auth/register"
              className="text-primary hover:underline font-medium"
            >
              Register
            </Link>
          </p>
        </CardFooter>
      </Card>
    </form>
  );
}

export default LoginFormUI;
