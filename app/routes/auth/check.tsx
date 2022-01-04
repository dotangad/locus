import { LoaderFunction } from "remix";
import { ensureAuthenticated, getUser } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  await ensureAuthenticated(request);
  const user = await getUser(request);

  return user;
};
