import { ActionFunction, redirect } from "remix";
import { db } from "~/utils/db.server";
import { ensureAuthenticated, getUser } from "~/utils/session.server";

export const action: ActionFunction = async ({ request }) => {
  await ensureAuthenticated(request);
  const { id } = Object.fromEntries(await request.formData());
  const user = await getUser(request);
  const task = await db.task.findUnique({ where: { id: id as string } });
  if (!task) return redirect("/");

  const userTask = await db.userTask.findFirst({
    where: {
      userId: user?.id,
      taskId: task.id,
    },
  });

  if (!userTask) {
    await db.userTask.create({
      // @ts-ignore
      data: {
        userId: user?.id,
        taskId: task.id,
      },
    });
  }

  return redirect(`/tasks/${id}`);
};
