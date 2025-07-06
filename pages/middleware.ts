// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextRequest } from "next/server";

export default withAuth(
  function middleware(request: NextRequest) {
    console.log('Middleware running for path:', request.nextUrl.pathname);
    // You can add your actual authorization logic here
    // e.g., if (request.nextUrl.pathname.startsWith("/admin") && request.nextauth.token?.role !== "admin") { ... }
  },
  {
    callbacks: {
      // This is where your authorization rules will go, e.g.,
      // authorized: ({ token, req }) => {
      //   if (req.nextUrl.pathname.startsWith("/admin")) {
      //     return token?.role === "admin";
      //   }
      //   return !!token; // Require authentication for other paths
      // }
    },
    pages: {
      signIn: '/login', // Ensure this points to your login page
    },
  }
);

export const config = {
  matcher: [
    "/((?!api|login|_next/static|_next/image|favicon.ico).*)", // Your existing matcher
  ],
  // --- ADD THIS LINE ---
  runtime: 'nodejs', // Forces middleware to run in Node.js environment during build/runtime
  // --------------------
};