import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes - no auth needed
  const publicRoutes = ["/", "/login", "/register", "/api/register", "/api/auth/me", "/api/email"];
  if (publicRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"))) {
    return NextResponse.next();
  }

  // Create Supabase client for middleware
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // No session - redirect to login
  if (!user) {
    if (pathname.startsWith("/admin") || pathname.startsWith("/dashboard") || pathname.startsWith("/pos") || pathname.startsWith("/pending")) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    return response;
  }

  // User is authenticated - fetch role via internal API
  // For edge middleware, we call the /api/auth/me endpoint
  try {
    const meUrl = new URL("/api/auth/me", request.url);
    const meResponse = await fetch(meUrl, {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    });

    if (!meResponse.ok) {
      // User exists in Supabase but not in our DB yet (might be mid-registration)
      return response;
    }

    const userData = await meResponse.json();
    const role = userData.role;
    const approvalStatus = userData.tenant?.approvalStatus;

    // Super admin accessing /dashboard -> redirect to /admin
    if (role === "super_admin" && (pathname.startsWith("/dashboard") || pathname.startsWith("/pos"))) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }

    // Non-super_admin accessing /admin -> redirect to /dashboard
    if (role !== "super_admin" && pathname.startsWith("/admin")) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }

    // Cashier accessing /dashboard -> redirect to /pos
    if (role === "cashier" && pathname.startsWith("/dashboard")) {
      const url = request.nextUrl.clone();
      url.pathname = "/pos";
      return NextResponse.redirect(url);
    }

    // Tenant not approved yet -> show pending page (except for super_admin)
    if (role !== "super_admin" && approvalStatus !== "approved" && !pathname.startsWith("/pending")) {
      if (pathname.startsWith("/dashboard") || pathname.startsWith("/pos")) {
        const url = request.nextUrl.clone();
        url.pathname = "/pending";
        return NextResponse.redirect(url);
      }
    }
  } catch {
    // If fetch fails, allow request to proceed
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
