export function randomHex(bytes: number): string {
  const buf = new Uint8Array(bytes);
  crypto.getRandomValues(buf);
  return Array.from(buf)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function callbackUri(origin: string): string {
  return `${origin}/api/auth/callback?provider=github`;
}

function isGithub(request: Request) {
  const url = new URL(request.url);
  const provider = url.searchParams.get("provider");
  return provider === null || provider === "" || provider === "github";
}

export function buildAuthorizationUrl(env: Env, origin: string) {
  const repoIsPrivate = env.GITHUB_REPO_PRIVATE === "1";
  const scope = repoIsPrivate ? "repo,user" : "public_repo,user";
  const params = new URLSearchParams({
    client_id: env.GITHUB_CLIENT_ID,
    redirect_uri: callbackUri(origin),
    response_type: "code",
    scope,
    state: randomHex(8),
  });
  return `https://github.com/login/oauth/authorize?${params.toString()}`;
}

export function buildTokenExchangeRequest(env: Env, code: string, origin: string) {
  const body = new URLSearchParams({
    client_id: env.GITHUB_CLIENT_ID,
    client_secret: env.GITHUB_CLIENT_SECRET,
    code,
    redirect_uri: callbackUri(origin),
    grant_type: "authorization_code",
  });
  return new Request("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: body.toString(),
  });
}

export interface Env {
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  GITHUB_REPO_PRIVATE?: string;
}

export async function handleAuth(request: Request, env: Env) {
  if (!isGithub(request)) {
    return new Response("Invalid provider", { status: 400 });
  }

  const url = new URL(request.url);
  const origin = url.origin;
  const authorizationUri = buildAuthorizationUrl(env, origin);

  return Response.redirect(authorizationUri, 302);
}

export async function handleCallback(request: Request, env: Env) {
  if (!isGithub(request)) {
    return new Response("Invalid provider", { status: 400 });
  }

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (!code) {
    return new Response("Missing code", { status: 400 });
  }

  const tokenResponse = await fetch(buildTokenExchangeRequest(env, code, url.origin));
  const data = (await tokenResponse.json()) as { access_token?: string; error?: string };

  if (!data.access_token) {
    return new Response(`Token exchange failed: ${data.error ?? "unknown"}`, { status: 400 });
  }

  const message = `authorization:github:success:${JSON.stringify({
    token: data.access_token,
    provider: "github",
  })}`;

  const html = `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <title>Autorizando Decap…</title>
  <script>
    var message = ${JSON.stringify(message)};
    var opener = window.opener;
    if (opener) {
      opener.postMessage("authorizing:github", "*");
      window.addEventListener("message", function (e) {
        if (e.data === "authorizing:github") {
          opener.postMessage(message, "*");
          window.close();
        }
      });
    } else {
      document.write("Ventana cerrada. Podés volver al panel.");
    }
  </script>
</head>
<body>
  <p style="font-family: sans-serif; text-align: center; margin-top: 40vh">
    Autorizando… Si esta ventana no se cierra sola, cerrála y volvé al panel.
  </p>
</body>
</html>`;

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}