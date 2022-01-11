import bcrypt from "bcrypt";
import { createCookieSessionStorage, redirect } from "remix";

import { db } from "./db.server";

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  let user;
  try {
    user = await db.user.findUnique({ where: { email } });
  } catch (e) {
    console.error("Login error", e);
  }
  if (!user) return null;
  const isCorrectPassword = await bcrypt.compare(password, user.password);
  if (!isCorrectPassword) return null;
  return user;
}

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: "RJ_session",
      secure: true,
      secrets: [sessionSecret],
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
    },
  });

export function getUserSession(request: Request) {
  return getSession(request.headers.get("Cookie"));
}

export async function getUserId(request: Request) {
  let session = await getUserSession(request);
  let userId = session.get("userId");
  if (!userId || typeof userId !== "string") return null;
  return userId;
}

export async function ensureAuthenticated(request: Request, redirectTo = "/") {
  let session = await getUserSession(request);
  let userId = session.get("userId");
  if (!userId || typeof userId !== "string")
    throw redirect(`/auth/login?redirectTo=${redirectTo}`);
  return userId;
}

export async function ensureAdmin(request: Request, redirectTo = "/") {
  await ensureAuthenticated(request, "/");
  const user = await getUser(request);
  if (!user?.admin) throw redirect(redirectTo);
  return user;
}

export async function ensureGuest(request: Request, redirectTo = "/") {
  const user = await getUser(request);
  console.log({ user });
  if (user) throw redirect(redirectTo);
  return null;
}

export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (typeof userId !== "string") return null;

  try {
    const user = await db.user.findUnique({ where: { id: userId } });
    return user;
  } catch {
    throw logout(request);
  }
}

export async function logout(request: Request) {
  let session = await getSession(request.headers.get("Cookie"));
  return redirect("/auth/login", {
    headers: { "Set-Cookie": await destroySession(session) },
  });
}

export async function createUserSession(userId: string, redirectTo: string) {
  let session = await getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}
