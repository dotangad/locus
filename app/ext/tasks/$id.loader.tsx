import { Task, User, UserTask } from "@prisma/client";
import { LoaderFunction, redirect } from "remix";
import { db } from "~/utils/db.server";
import { ensureAuthenticated, getUser } from "~/utils/session.server";

export type LoaderData = {
  user: User;
  task: Task;
  userTask: UserTask;
  canOpen: boolean;
};
export const loader: LoaderFunction = async ({ request, params }) => {
  await ensureAuthenticated(request);
  const user = await getUser(request);
  const task = await db.task.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      createdAt: true,
      updatedAt: true,
      title: true,
      tags: true,
      taskDeadline: true,
      timeDecay: true,
      description: true,
      points: true,
      showTask: true,
      type: true,
      groupQuestions: true,
      retry: true,
      needs: {
        select: {
          id: true,
          dependencyId: true,
          dependency: {
            select: {
              id: true,
              title: true,
              showTask: true,
              type: true,
              retry: true,
              users: {
                where: { userId: user?.id },
              },
            },
          },
        },
      },
      isNeededBy: false,
    },
  });
  const userTask = await db.userTask.findFirst({
    where: { userId: user?.id, taskId: task?.id },
  });

  if (!task || (!task?.showTask && !userTask)) return redirect("/");

  return {
    user,
    task,
    userTask,
    canOpen: task.needs.every(
      (need) =>
        need.dependency.users.length > 0 &&
        !!need.dependency.users[0].completed_at
    ),
  };
};
