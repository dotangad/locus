import { Task, User } from "@prisma/client";
import { Link, LoaderFunction, useLoaderData, useNavigate } from "remix";
import Layout from "~/components/Layout";
import { db } from "~/utils/db.server";
import { ensureAdmin } from "~/utils/session.server";

type LoaderData = { user: User; tasks: Task[] };
export const loader: LoaderFunction = async ({ request }) => {
  const user = await ensureAdmin(request, "/");
  const tasks = await db.task.findMany();

  return { user, tasks };
};

export default function () {
  const { user, tasks } = useLoaderData<LoaderData>();
  const navigate = useNavigate();

  console.log({ tasks });

  return (
    <Layout user={user}>
      <div className="px-5 mx-auto max-w-screen-sm">
        <div className="my-8 flex items-center gap-x-3 bg-white rounded p-6">
          <div
            className="rounded-xl flex items-center justify-center p-3 bg-gray-100 cursor-pointer shadow-md"
            onClick={() => navigate(-1)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 17l-5-5m0 0l5-5m-5 5h12"
              />
            </svg>
          </div>
          <div className="flex-1">
            <div className="text-exun font-bold text-xl">Tasks</div>
            <div className="text-gray-500 text-md">
              Click on a tile to edit task
            </div>
          </div>
          <div>
            <Link
              to="/admin/tasks/create"
              className="bg-exun text-white uppercase font-bold p-3 rounded-lg"
            >
              Create
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-y-5"></div>
      </div>
    </Layout>
  );
}
