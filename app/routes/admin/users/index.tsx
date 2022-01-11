import { User } from "@prisma/client";
import { Link, LoaderFunction, useLoaderData, useNavigate } from "remix";
import Layout from "~/components/Layout";
import UserIcon from "~/components/icons/User";
import { db } from "~/utils/db.server";
import { ensureAdmin } from "~/utils/session.server";

type LoaderData = { user: User; users: User[] };
export const loader: LoaderFunction = async ({ request }) => {
  const user = await ensureAdmin(request, "/");
  const users = await db.user.findMany({
    orderBy: { points: "desc" },
  });

  return { user, users };
};

export default function () {
  const { user, users } = useLoaderData<LoaderData>();
  const navigate = useNavigate();

  return (
    <Layout user={user}>
      <div className="px-5 mx-auto max-w-screen-sm">
        <div className="my-8 flex items-center gap-x-3 bg-white rounded p-6">
          <div
            className="rounded-xl flex items-center justify-center p-3 bg-gray-100 cursor-pointer"
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
          <div>
            <div className="text-exun font-bold text-xl">Users</div>
            <div className="text-gray-500 text-md">
              Click on a tile to see opened tasks
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-y-5">
          {users.map(({ id, schoolName, email, points, admin }, i) => (
            <Link
              to={`/admin/users/${id}`}
              key={i}
              className="p-6 bg-white shadow-sm hover:shadow-lg transition flex rounded gap-x-4 items-center"
            >
              <div className="h-full flex items-center">
                <div className="p-2 rounded-full border-2 border-exun">
                  <UserIcon className="h-10 w-10 text-exun" />
                </div>
              </div>
              <div className="flex-1">
                <div className="text-gray-600 text-xl font-bold">
                  {schoolName}
                </div>
                <div className="text-sm flex gap-x-2 mt-1 text-gray-500">
                  <span>{email}</span>
                  <span className="font-extrabold">&middot;</span>
                  <span>{points} Points</span>
                  {admin && (
                    <>
                      <span className="font-extrabold">&middot;</span>
                      <span>Admin</span>
                    </>
                  )}
                </div>
              </div>
              <div className="h-full flex items-center">
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
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
