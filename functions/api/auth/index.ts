import { handleAuth, type Env } from "../../_lib/oauth";

export const onRequest = ({
  request,
  env,
}: {
  request: Request;
  env: Env;
}) => {
  return handleAuth(request, env);
};