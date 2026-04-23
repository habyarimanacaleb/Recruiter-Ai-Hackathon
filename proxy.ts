// proxy.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth"; // Your better-auth server instance
import { headers } from "next/headers";

export async function proxy(request: NextRequest) {
  // 1. Get the current session using the headers
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const { pathname } = request.nextUrl;

  // 2. Protect Dashboard Routes
  if (pathname.startsWith("/dashboard")) {
    if (!session) {
      // Redirect unauthenticated users to login
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // 3. Optional: Role-Based Redirection
    // If a user tries to access /dashboard/admin but isn't an admin
    if (pathname.startsWith("/dashboard/admin") && session.user.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  

  // 4. Redirect logged-in users away from Auth pages
  if (pathname.startsWith("/auth") && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

   if (!session?.user.emailVerified && !pathname.startsWith("/auth/verify-email")) {
      return NextResponse.redirect(new URL("/auth/verify-email", request.url));
    }
  

  return NextResponse.next();
}

// Specify which routes this proxy should intercept
export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};
