type EmailRes = (
  | {
      email: string;
      primary: boolean;
      verified: boolean;
      visibility: null;
    }
  | {
      email: string;
      primary: boolean;
      verified: boolean;
      visibility: string;
    }
)[];

import { db } from "@/db";
import { sessions, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import queryString from "query-string";

export async function GET(request: NextRequest) {
  const code = new URL(request.url).searchParams?.get("code");
  const state = new URL(request.url).searchParams?.get("state");

  const storedState = cookies().get("github_oauth_state")?.value;

  if (storedState !== state || !code) {
    cookies().delete("github_oauth_state");

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/login?error=Server+Error",
      },
    });
  }

  try {
    const tokenUrl = queryString.stringifyUrl({
      url: "https://github.com/login/oauth/access_token",
      query: {
        client_id: process.env.GITHUB_AUTH_CLIENT,
        client_secret: process.env.GITHUB_AUTH_SECRET,
        code: code,
        scope: "user:email",
      },
    });

    const fetchToken = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
    });

    const fetchTokenRes = await fetchToken.json();

    const fetchUser = await fetch("https://api.github.com/user", {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${fetchTokenRes.access_token}`,
      },
    });

    const fetchUserRes = await fetchUser.json();

    const fetchEmail = await fetch("https://api.github.com/user/emails", {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${fetchTokenRes.access_token}`,
      },
    });

    const fetchEmailRes: EmailRes = await fetchEmail.json();

    const userEmail = () => {
      let primaryVerified = fetchEmailRes.find(
        (email) => email.verified && email.primary
      );
      let verified = fetchEmailRes.find((email) => email.verified);
      let primary = fetchEmailRes.find((email) => email.primary);

      if (primaryVerified) {
        return primaryVerified.email;
      } else if (verified) {
        return verified.email;
      } else if (primary) {
        return primary.email;
      } else {
        return fetchEmailRes[0].email;
      }
    };

    const userExists = await db.query.users.findFirst({
      where: eq(users.providerUserId, fetchUserRes.id.toString()),
    });

    if (!userExists) {
      const [newUser] = await db
        .insert(users)
        .values({
          email: userEmail(),
          providerUserId: fetchUserRes.id.toString(),
          name: fetchUserRes.login,
        })
        .returning({
          id: users.id,
        });

      const [newSession] = await db
        .insert(sessions)
        .values({
          userId: newUser.id,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        })
        .returning({
          id: sessions.id,
        });

      cookies().delete("github_oauth_state");

      cookies().set("auth_token", newSession.id, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        secure: process.env.NODE_ENV === "production",
      });

      return new Response(null, {
        status: 302,
        headers: {
          Location: "/todos",
        },
      });
    }

    const [newSession] = await db
      .insert(sessions)
      .values({
        userId: userExists.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      })
      .returning({
        id: sessions.id,
      });

    cookies().delete("github_oauth_state");

    cookies().set("auth_token", newSession.id, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      secure: process.env.NODE_ENV === "production",
    });

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/todos",
      },
    });
  } catch (error) {
    console.log("error in github signup", error);
    cookies().delete("github_oauth_state");

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/login?error=Server+Error",
      },
    });
  }
}
