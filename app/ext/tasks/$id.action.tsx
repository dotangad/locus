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
  const task = await db.task.findUnique({ where: { id: params.id } });
  const userTask = await db.userTask.findFirst({
    where: { userId: user?.id, taskId: task?.id },
  });

  // TODO: else throw 400
  if (task && userTask) {
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
