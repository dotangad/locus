import { ActionFunction } from "remix";
import { db } from "~/utils/db.server";
import { ensureAuthenticated, getUser } from "~/utils/session.server";

export const action: ActionFunction = async ({ request, params }) => {
  await ensureAuthenticated(request);
  const { answer } = Object.fromEntries(await request.formData());
  const user = await getUser(request);
  const task = await db.task.findUnique({ where: { id: params.id } });
  const userTask = await db.userTask.findFirst({
    where: { userId: user?.id, taskId: task?.id },
  });

  if (task && userTask) {
    if (task.type == "DIRECT") {
      const points = answer === task.answer ? task.points : 0;
      if (points === 0 && task.retry) {
        await db.userAttempt.create({
          data: {
            userTaskId: userTask.id,
            attempt: answer as string,
          },
        });

        return { error: "Incorrect answer, please try again" };
      } else {
        await db.userTask.update({
          where: { id: userTask.id },
          data: {
            completed_at: new Date(),
            pointsReceived: points,
            submission: answer as string,
          },
        });

        await db.user.update({
          where: { id: user?.id },
          data: { points: user?.points ?? 0 + points },
        });
      }
    }

    if (task.type == "SUBMISSION") {
      await db.userTask.update({
        where: { id: userTask.id },
        data: {
          completed_at: new Date(),
          submission: answer as string,
        },
      });
    }
  }

  return {};
};
