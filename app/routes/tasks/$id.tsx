import { Task, User, UserTask } from "@prisma/client";
import {
  ActionFunction,
  Form,
  LoaderFunction,
  redirect,
  useActionData,
  useLoaderData,
  useTransition,
} from "remix";
import { db } from "~/utils/db.server";
import { ensureAuthenticated, getUser } from "~/utils/session.server";
import Layout from "~/components/Layout";
import Button from "~/components/Button";
import TextInput from "~/components/TextInput";
import { useRef } from "react";

type LoaderData = {
  user: User;
  task: Task;
  userTask: UserTask;
};
export const loader: LoaderFunction = async ({ request, params }) => {
  await ensureAuthenticated(request);
  const user = await getUser(request);
  const task = await db.task.findUnique({ where: { id: params.id } });
  const userTask = await db.userTask.findFirst({
    where: { userId: user?.id, taskId: task?.id },
  });

  if (!task || (!task?.showTask && !userTask)) return redirect("/");

  return { user, task, userTask };
};

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

export default function Task() {
  const { task, user, userTask } = useLoaderData<LoaderData>();
  const actionData = useActionData();
  const transition = useTransition();
  const answerInputRef = useRef(null);

  return (
    <Layout user={user}>
      <div className="px-5 mx-auto max-w-screen-lg w-full">
        <div className="w-full my-2">
          <div className="text-2xl sm:text-4xl font-bold text-gray-700">
            {task.title}
          </div>
          <div className="mt-1 text-gray-500 uppercase font-bold text-sm flex gap-x-2">
            <span>{task.points} points</span>
            <span className="font-extrabold">&middot;</span>
            <span>{JSON.parse(task.tags).join(", ")}</span>
          </div>
        </div>
        <div className="w-full my-2 flex gap-x-8">
          <div className="flex-1">
            <div className="mb-5 flex gap-x-2">
              {task.retry && (
                <div className="rounded-full px-3 py-2 bg-white flex items-center gap-x-[5px] text-xs tracking-wide font-bold uppercase text-gray-500 select-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-exun"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span>Retries allowed</span>
                </div>
              )}
            </div>
            <div
              dangerouslySetInnerHTML={{ __html: task.description }}
              className="prose"
            />
          </div>
          <div className="w-1/3">
            <div className="w-full rounded bg-white shadow-md p-5">
              {userTask ? (
                userTask.completed_at ? (
                  userTask.pointsReceived || userTask.pointsReceived === 0 ? (
                    <div>
                      <div className="mb-5 text-green-700 text-md font-bold flex items-center uppercase gap-x-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>Completed</span>
                      </div>
                      <div className="text-gray-500 font-bold text-lg">
                        {userTask.pointsReceived} / {task.points} Points
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="mb-5 text-green-700 text-md font-bold flex items-center uppercase gap-x-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>Completed</span>
                      </div>
                      <div className="text-gray-500 font-bold text-lg">
                        Unchecked
                      </div>
                    </div>
                  )
                ) : (
                  <div>
                    <Form
                      method="post"
                      onSubmit={() => {
                        if (answerInputRef.current)
                          answerInputRef.current.value = "";
                      }}
                    >
                      <TextInput
                        id="answer"
                        name="answer"
                        label="submission"
                        type="text"
                        placeholder="locuspocus"
                        containerClassName="mb-5 w-full"
                        disabled={transition.state === "submitting"}
                        error={actionData?.error}
                        ref={answerInputRef}
                      />
                      <Button
                        type="submit"
                        disabled={transition.state === "submitting"}
                      >
                        Submit
                      </Button>
                    </Form>
                  </div>
                )
              ) : (
                <div className="w-full flex items-center justify-center py-5">
                  <Form method="post" action="/tasks/open">
                    <input type="hidden" name="id" value={task.id} />
                    <Button type="submit">Open</Button>
                  </Form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
