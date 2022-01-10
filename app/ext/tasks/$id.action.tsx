import { ActionFunction } from "remix";
import {
  checkDirect,
  checkGroup,
  checkSubmission,
} from "~/utils/checking.server";
import { db } from "~/utils/db.server";
import { ensureAuthenticated, getUser } from "~/utils/session.server";

export const action: ActionFunction = async ({ request, params }) => {
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
      answer: true,
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

  // TODO: else throw 400
  if (
    task &&
    userTask &&
    task.needs.every(
      (need) =>
        need.dependency.users.length > 0 &&
        !!need.dependency.users[0].completed_at
    )
  ) {
    if (task.type == "DIRECT") {
      return checkDirect({
        task,
        userTask,
        request,
      });
    }

    if (task.type == "GROUP") {
      return checkGroup({ task, userTask, request });
    }

    if (task.type == "SUBMISSION") {
      return checkSubmission({ userTask, request });
    }
  }

  return {};
};
