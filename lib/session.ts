import { cookies } from "next/headers";
import { prisma } from "./prisma";

const COOKIE_NAME = "klv_session";

export async function getCurrentUser() {
  const store = await cookies();
  const username = store.get(COOKIE_NAME)?.value;
  if (!username) return null;
  return prisma.user.findUnique({ where: { username } });
}

export async function createSession(username: string) {
  const store = await cookies();
  store.set(COOKIE_NAME, username, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
