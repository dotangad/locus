import { Task, User, UserTask } from "@prisma/client";
import { LoaderFunction, redirect } from "remix";
import { db } from "~/utils/db.server";
import { ensureAuthenticated, getUser } from "~/utils/session.server";

export type LoaderData = {
  user: User;
  task: Task;
  userTask: UserTask;
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
      answer: false,
      type: true,
      groupQuestions: true,
      retry: true,
    },
  });
  const userTask = await db.userTask.findFirst({
    where: { userId: user?.id, taskId: task?.id },
  });

  if (!task || (!task?.showTask && !userTask)) return redirect("/");

  return { user, task, userTask };
};
