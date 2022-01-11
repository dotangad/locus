import { Link, useLoaderData } from "remix";
import UserCard from "~/components/admin/users/$id/UserCard";
import TaskCard from "~/components/admin/users/$id/TaskCard";
import SessionCard from "~/components/admin/users/$id/SessionCard";
import Layout from "~/components/Layout";
import { LoaderData } from "~/ext/admin/users/$id.loader";

export { loader } from "~/ext/admin/users/$id.loader";

export default function () {
  const { authUser, user, sessions, tasks } = useLoaderData<LoaderData>();

  return (
    <Layout user={authUser}>
      <div className="px-5 mx-auto max-w-screen-lg">
        <UserCard user={user} />

        <div className="flex gap-x-5">
          <div className="flex-1">
            <div className="uppercase font-bold text-lg text-gray-400">
              Tasks
            </div>
            <div className="my-5">
              {tasks.map((task, i) => (
                <TaskCard task={task} key={i} />
              ))}
            </div>
          </div>

          <div className="w-1/3">
            <div className="uppercase font-bold text-lg text-gray-400">
              Sessions
            </div>
            <div className="my-5">
              {sessions.map((session, i) => (
                <SessionCard session={session} key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
