import { db } from "@/db";
import { sessions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

export async function getCurrentUser() {
  const authToken = cookies().get("auth_token");

  if (!authToken) {
    return null;
  }

  const sessionExists = await db.query.sessions.findFirst({
    where: eq(sessions.id, authToken.value),
    with: {
      user: {
        columns: {
          id: true,
        },
      },
    },
  });

  if (!sessionExists) {
    return null;
  }

  return sessionExists.user;
}
