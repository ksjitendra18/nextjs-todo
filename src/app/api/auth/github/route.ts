import { cookies } from "next/headers";
import { uuidv7 } from "uuidv7";
import queryString from "query-string";

export async function GET() {
  const githubOauthState = uuidv7();

  cookies().set("github_oauth_state", githubOauthState, {
    path: "/",
  });

  const authorizationUrl = queryString.stringifyUrl({
    url: "https://github.com/login/oauth/authorize",
    query: {
      scope: "user:email",
      response_type: "code",
      client_id: process.env.GITHUB_AUTH_CLIENT,
      redirect_uri: process.env.GITHUB_AUTH_CALLBACK_URL,
      state: githubOauthState,
    },
  });

  return new Response(null, {
    status: 302,
    headers: {
      Location: authorizationUrl,
    },
  });
}
