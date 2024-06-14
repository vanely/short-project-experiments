import { NextResponse } from "next/server";

export async function middleware(request) {
  const isAuthenticated = false;
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
    } 
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/users', '/dashboard/users/:id*'] // wild card matches all subsequent routes in this URI
}
