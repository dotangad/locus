import { User } from "@prisma/client";
import { LoaderFunction, useLoaderData } from "remix";
import { db } from "~/utils/db.server";
import { ensureAuthenticated, getUser } from "~/utils/session.server";
import Layout from "~/components/Layout";

type LoaderData = {
  user: User;
  users: {
    position: string;
    schoolName: string;
    points: string;
    className?: string;
  }[];
};

export const loader: LoaderFunction = async ({ request }) => {
  await ensureAuthenticated(request);
  const user = await getUser(request);
  const users = await db.user.findMany({
    select: { id: true, schoolName: true, points: true },
    // where: { admin: false },
    orderBy: [{ points: "desc" }],
  });

  return {
    user,
    users: users.map(({ id, schoolName, points }, i) => ({
      position: id === user?.id ? "You" : String(i + 1),
      schoolName,
      points,
      className: id === user?.id ? "!text-exun font-bold" : "",
    })),
  };
};

export default function Leaderboard() {
  const { user, users } = useLoaderData<LoaderData>();

  return (
    <Layout user={user}>
      <div className="px-5 max-w-screen-lg w-full mx-auto my-10">
        <table className="w-full">
          <thead>
            <tr className="bg-exun text-white rounded-tl rounded-tr">
              <th className="p-3 uppercase text-sm tracking-wider bg-exun rounded-tl">
                #
              </th>
              <th className="p-3 uppercase text-sm leading-loose bg-exun">
                School
              </th>
              <th className="p-3 uppercase text-sm leading-loose bg-exun rounded-tr">
                Points
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map(({ position, schoolName, points, className }, i) => (
              <tr
                className={`even:bg-gray-200 text-md text-gray-700 ${
                  className ?? ""
                } ${
                  i === 0
                    ? "font-bold text-amber-600"
                    : i === 1
                    ? "font-bold text-slate-500"
                    : i === 2
                    ? "font-bold text-amber-800"
                    : ""
                }`}
                key={i}
              >
                <td className="p-3 text-center">{position}</td>
                <td className="p-3 text-center">{schoolName}</td>
                <td className="p-3 text-center">{points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
