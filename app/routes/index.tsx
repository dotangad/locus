import { Task, User, UserTask } from "@prisma/client";
import { LoaderFunction, useLoaderData } from "remix";
import UnopenedTask from "~/components/index/UnopenedTask";
import { db } from "~/utils/db.server";
import { ensureAuthenticated, getUser } from "~/utils/session.server";
import Layout from "~/components/Layout";
import OpenedTask from "~/components/index/OpenedTask";

type LoaderData = {
  user: User;
  openedTasks: (UserTask & { task: Task })[];
  completedTasks: (UserTask & { task: Task })[];
  unopenedTasks: Task[];
};

export const loader: LoaderFunction = async ({ request }) => {
  await ensureAuthenticated(request);
  const user = await getUser(request);
  const tasks = await db.task.findMany();
  const userTasks = await db.userTask.findMany({ where: { userId: user?.id } });

  return {
    user,
    openedTasks: userTasks
      .filter(({ completed_at }) => !completed_at)
      .map((ut) => ({ ...ut, task: tasks.find(({ id }) => ut.taskId === id) })),
    completedTasks: userTasks
      .filter(({ completed_at }) => completed_at)
      .sort(
        (a, b) =>
          // @ts-ignore
          new Date(b.completed_at).getTime() -
          // @ts-ignore
          new Date(a.completed_at).getTime()
      )
      .map((ut) => ({ ...ut, task: tasks.find(({ id }) => ut.taskId === id) })),
    unopenedTasks: tasks.filter(
      ({ id }) => !userTasks.some(({ taskId }) => taskId === id)
    ),
  };
};

export default function Index() {
  const { user, openedTasks, completedTasks, unopenedTasks } =
    useLoaderData<LoaderData>();

  return (
    <Layout user={user}>
      <div className="px-5">
        <div className="my-8">
          <div className="text-gray-400 uppercase font-bold text-md max-w-screen-md w-full mx-auto">
            Opened Tasks
          </div>
          {openedTasks.map((ut: UserTask & { task: Task }, i: number) => (
            <OpenedTask userTask={ut} key={i} />
          ))}
          {completedTasks.map((ut: UserTask & { task: Task }, i: number) => (
            <OpenedTask userTask={ut} key={i} />
          ))}
        </div>
        <div className="my-8">
          <div className="text-gray-400 uppercase font-bold text-md max-w-screen-md w-full mx-auto">
            Unopened Tasks
          </div>
          {unopenedTasks.map((task: Task, i: number) => (
            <UnopenedTask task={task} key={i} />
          ))}
        </div>
      </div>
    </Layout>
  );
}
