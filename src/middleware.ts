// check auth
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "./db";
import { sessions, User } from "./db/schema";
import { eq } from "drizzle-orm";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const authToken = cookies().get("auth_token");

  let userInfo: User | null = null;

  if (authToken) {
    const sessionExists = await db.query.sessions.findFirst({
      where: eq(sessions.id, authToken.value),
      with: {
        user: true,
      },
    });

    if (sessionExists) {
      userInfo = sessionExists.user;
    }
  }

  if (request.nextUrl.pathname === "/todos") {
    if (!userInfo) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (request.nextUrl.pathname === "/login") {
    if (userInfo) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
