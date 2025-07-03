// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextRequest } from "next/server";

export default withAuth(
  function middleware(request: NextRequest) {
    // Tambahkan baris ini untuk melihat log di terminal
    console.log('Middleware berjalan untuk path:', request.nextUrl.pathname);
  }
);

// Konfigurasi matcher Anda tetap sama
export const config = {
  matcher: [
    "/((?!api|login|_next/static|_next/image|favicon.ico).*)",
  ],
};