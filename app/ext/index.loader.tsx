import { Task, User, UserTask } from "@prisma/client";
import { LoaderFunction } from "remix";
import { db } from "~/utils/db.server";
import { ensureAuthenticated, getUser } from "~/utils/session.server";

export type LoaderData = {
  user: User;
  openedTasks: (UserTask & { task: Task })[];
  completedTasks: (UserTask & { task: Task })[];
  unopenedTasks: Task[];
};

export const loader: LoaderFunction = async ({ request }) => {
  await ensureAuthenticated(request);
  const user = await getUser(request);
  const tasks = await db.task.findMany({
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
      open: true,
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
  const userTasks = await db.userTask.findMany({
    where: { userId: user?.id },
    select: {
      id: true,
      task: {
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
          open: true,
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
      },
      taskId: true,
      userId: true,
      createdAt: true,
      updatedAt: true,
      submission: true,
      completed_at: true,
      pointsReceived: true,
    },
  });

  return {
    user,
    openedTasks: userTasks.filter(({ completed_at }) => !completed_at),
    completedTasks: userTasks
      .filter(({ completed_at }) => completed_at)
      .sort(
        (a, b) =>
          // @ts-ignore
          new Date(b.completed_at).getTime() -
          // @ts-ignore
          new Date(a.completed_at).getTime()
      ),
    unopenedTasks: tasks
      .filter(({ id }) => !userTasks.some(({ taskId }) => taskId === id))
      .map((task) => {
        if (task.needs.length === 0) return { ...task, canOpen: true };

        // If there are dependencies
        // - task.needs[x].dependency.user[0] must exist
        // - task.needs[x].dependency.user[0].completed must not be null
        return {
          ...task,
          canOpen: task.needs.every(
            (need) =>
              need.dependency.users.length > 0 &&
              !!need.dependency.users[0].completed_at
          ),
        };
      }),
  };
};
