import { Task, UserTask } from "@prisma/client";
import { useLoaderData } from "remix";
import UnopenedTask from "~/components/index/UnopenedTask";
import Layout from "~/components/Layout";
import OpenedTask from "~/components/index/OpenedTask";
import { LoaderData } from "~/ext/index.loader";

export { loader } from "~/ext/index.loader";

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
