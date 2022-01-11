import { User } from "@prisma/client";
import { LoaderFunction, useLoaderData, Link } from "remix";
import TaskList from "~/components/icons/TaskList";
import UserIcon from "~/components/icons/User";
import Layout from "~/components/Layout";
import { db } from "~/utils/db.server";
import { ensureAdmin } from "~/utils/session.server";

type LoaderData = { user: User; stats: { [label: string]: number } };
export const loader: LoaderFunction = async ({ request }) => {
  const user = await ensureAdmin(request, "/");
  const stats = {
    tasks: await db.task.count(),
    opened: await db.userTask.count({
      where: { user: { admin: false } },
    }),
    completed: await db.userTask.count({
      where: { completed_at: { not: null }, user: { admin: false } },
    }),
  };

  return { user, stats };
};

export default function () {
  const { user, stats } = useLoaderData<LoaderData>();

  return (
    <Layout user={user}>
      <div className="px-5 mx-auto max-w-screen-sm">
        <div className="my-8 flex flex-col items-center gap-y-2">
          <div className="text-exun text-5xl font-bold">Locus</div>
          <div className="text-gray-600 text-xl">Admin Panel</div>
        </div>
        <div className="grid grid-cols-3 gap-3 my-10">
          {Object.entries(stats).map(([label, n], i) => (
            <div
              className="block flex flex-col items-center bg-white p-4 py-8 gap-y-4 rounded select-none"
              key={i}
            >
              <div className="text-exun font-extrabold text-5xl">{n}</div>
              <div className="text-gray-500 uppercase font-bold text-md">
                {label}
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-5 my-10">
          {[
            {
              to: "/admin/tasks",
              icon: <TaskList className="w-16 h-16 text-exun" />,
              label: <>Tasks</>,
            },
            {
              to: "/admin/users",
              icon: <UserIcon className="w-16 h-16 text-exun" />,
              label: <>Users</>,
            },
          ].map(({ to, icon, label }, i) => (
            <Link
              to={to}
              key={i}
              className="block flex flex-col items-center bg-white p-8 gap-y-4 shadow-sm hover:shadow-lg transition rounded select-none"
            >
              <div>{icon}</div>
              <div className="text-gray-500 uppercase font-bold text-lg">
                {label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
