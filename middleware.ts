import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";

const protectedRoutes = ["/dashboard"];
const adminRoutes = [
  "/dashboard/admin/workflow",
  "/dashboard/admin/rooms",
  "/dashboard/admin/courses",
  "/dashboard/admin/generate",
  "/dashboard/reports",
];
const hodRoutes = ["/dashboard/admin/pref"];
const teacherRoutes = ["/dashboard/pref"];
const publicRoutes = ["/login", "/student", "/"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute =
    protectedRoutes.includes(path) || path.startsWith("/dashboard");
  const isAdminRoute =
    adminRoutes.includes(path) ||
    adminRoutes.some((route) => path.startsWith(route));
  const isHodRoute =
    hodRoutes.includes(path) ||
    hodRoutes.some((route) => path.startsWith(route));
  const isTeacherRoute = teacherRoutes.includes(path);
  const cookie = cookies().get("session")?.value;
  const session: any = await decrypt(cookie);

  // Check if the user is authenticated for protected routes
  if (isProtectedRoute && !session?.user) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // Admin route access
  if (isAdminRoute && session?.user) {
    if (session.user.designation === "Dean") {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }
  }

  // HOD route access
  if (isHodRoute && session?.user) {
    if (session.user.designation === "HOD") {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }
  }

  // Teacher route access
  if (isTeacherRoute && session?.user) {
    if (
      session.user.designation !== "Dean" &&
      session.user.designation !== "HOD"
    ) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }
  }

  // For any other protected route, allow access if authenticated
  if (isProtectedRoute && session?.user) {
    return NextResponse.next();
  }

  // No matching route found, continue
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
