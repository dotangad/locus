import type { User, Session, UserTask } from "@prisma/client";
import { LoaderFunction, redirect } from "remix";
import { db } from "~/utils/db.server";
import { ensureAdmin } from "~/utils/session.server";

export type LoaderData = {
  authUser: User;
  user: User;
  sessions: Session[];
  tasks: UserTask[];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const authUser = await ensureAdmin(request);
  const user = await db.user.findUnique({ where: { id: params.id } });
  if (!user) return redirect("/admin/users");

  const sessions = await db.session.findMany({
    where: { userId: user?.id ?? "" },
    orderBy: { lastSeen: "desc" },
  });

  const tasks = await db.userTask.findMany({
    where: { userId: user.id },
    select: {
      id: true,
      task: true,
      attempts: true,
      createdAt: true,
      submission: true,
      completed_at: true,
      pointsReceived: true,
    },
  });

  return { authUser, user, sessions, tasks };
};
