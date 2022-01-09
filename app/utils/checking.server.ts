import { Task, UserTask } from "@prisma/client";
import { db } from "./db.server";
import { getUser } from "./session.server";

export const checkSubmission = async ({
  userTask,
  request,
}: {
  userTask: UserTask;
  request: Request;
}) => {
  await db.userTask.update({
    where: { id: userTask.id },
    data: {
      completed_at: new Date(),
      submission: Object.fromEntries(await request.formData()).answer as string,
    },
  });

  return {};
};

export const checkDirect = async ({
  task,
  userTask,
  request,
}: {
  task: Task;
  userTask: UserTask;
  request: Request;
}) => {
  const user = await getUser(request);
  const { answer: attempt } = Object.fromEntries(await request.formData());
  const points = attempt === task.answer ? task.points : 0;
  await db.userAttempt.create({
    data: {
      userTaskId: userTask.id,
      attempt: attempt as string,
    },
  });

  if (points === 0 && task.retry) {
    return { error: "Incorrect answer, please try again" };
  } else {
    await db.userTask.update({
      where: { id: userTask.id },
      data: {
        completed_at: new Date(),
        pointsReceived: points,
        submission: attempt as string,
      },
    });

    await db.user.update({
      where: { id: user?.id },
      data: { points: user?.points ?? 0 + points },
    });
  }

  return {};
};

export const checkGroup = async ({
  task,
  userTask,
  request,
}: {
  task: Task;
  userTask: UserTask;
  request: Request;
}) => {
  const user = await getUser(request);
  const attempts = Object.entries(Object.fromEntries(await request.formData()))
    .filter(([k]) => k.startsWith("sub"))
    .sort(([k1], [k2]) => Number(k1 < k2))
    .map(([_, val]) => val as string);
  const answers = JSON.parse(task.answer ?? "[]");
  const pointsPerCorrect = task.points / answers.length;
  const points = attempts.reduce(
    (points_, curr, i) =>
      curr === answers[i] ? points_ + pointsPerCorrect : points_,
    0
  );

  await db.userTask.update({
    where: { id: userTask.id },
    data: {
      completed_at: new Date(),
      pointsReceived: points,
      submission: JSON.stringify(attempts),
    },
  });

  await db.user.update({
    where: { id: user?.id },
    data: { points: user?.points ?? 0 + points },
  });

  return {};
};
