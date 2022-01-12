import { LoaderFunction } from "remix";
import { User, UserTask } from "@prisma/client";
import { ensureAdmin } from "~/utils/session.server";
import { db } from "~/utils/db.server";

export type LoaderData = { user: User; userTask: UserTask };
export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await ensureAdmin(request);
  const userTask = await db.userTask.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      createdAt: true,
      updatedAt: true,
      completed_at: true,
      submission: true,
      pointsReceived: true,
      userId: true,
      taskId: true,
      user: true,
      attempts: true,
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
          answer: true,
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
      },
    },
  });
  return { user, userTask };
};
