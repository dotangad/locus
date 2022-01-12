import { ActionFunction, Form, useLoaderData } from "remix";
import UserCard from "~/components/admin/users/$id/UserCard";
import Layout from "~/components/Layout";
import Meta from "~/components/task/$id/Meta";
import Dependencies from "~/components/task/$id/Dependencies";
import Pills from "~/components/task/$id/Pills";
import { LoaderData } from "~/ext/admin/usertasks/$id.loader";
import TextInput from "~/components/TextInput";
import Button from "~/components/Button";
import { db } from "~/utils/db.server";
import { ensureAdmin } from "~/utils/session.server";

export { loader } from "~/ext/admin/usertasks/$id.loader";

export const action: ActionFunction = async ({ request, params }) => {
  const user = await ensureAdmin(request);
  const userTask = await db.userTask.findUnique({
    where: { id: params.id },
    select: { task: true, pointsReceived: true, user: true },
  });

  if (
    userTask &&
    userTask.task.type === "SUBMISSION" &&
    userTask.pointsReceived === null
  ) {
    const { points } = Object.fromEntries(await request.formData());
    await db.userTask.update({
      where: { id: params.id },
      data: { pointsReceived: Number(points) },
    });

    await db.user.update({
      where: { id: userTask.user.id },
      data: { points: userTask.user.points + Number(points) },
    });
  }
  return {};
};

export default function () {
  const { user, userTask } = useLoaderData<LoaderData>();

  return (
    <Layout user={user}>
      <div className="w-full px-5 mx-auto max-w-screen-lg">
        <UserCard user={userTask.user} />
        <div className="w-full my-2">
          <Meta task={userTask.task} />
        </div>
        <div className="flex w-full my-2 gap-x-8">
          <div className="flex-1">
            <Pills task={userTask.task} />
            <Dependencies
              task={userTask.task}
              className=""
              containerClassName="mb-5"
            />
            <div
              dangerouslySetInnerHTML={{ __html: userTask.task.description }}
              className="prose mt-5"
            />
          </div>
          <div className="w-1/3">
            <div className="w-full p-5 bg-white rounded shadow-md">
              <div className="text-sm text-gray-700">
                Opened at {userTask.createdAt}
              </div>
              {userTask.completed_at && (
                <>
                  <div className="text-sm text-gray-700">
                    Completed at {userTask.completed_at}
                  </div>
                  {userTask.task.type === "DIRECT" ? (
                    <div className="text-gray-700 my-3">
                      <div>Points: {userTask.pointsReceived}</div>
                      <div>Submission: {userTask.submission}</div>
                      <div>Answer: {userTask.task.answer}</div>

                      {userTask.task.retry && (
                        <div className="mt-5">
                          <div className="text-sm font-bold text-gray-500 uppercase">
                            Attempts
                          </div>
                          {userTask.attempts.map(({ attempt }, i) => (
                            <div key={i}>{attempt}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : userTask.task.type === "SUBMISSION" ? (
                    <div className="text-gray-700 my-3">
                      <div className="my-5">
                        <a
                          href={userTask.submission ?? ""}
                          className="font-bold text-exun"
                          target="_blank"
                        >
                          Submission
                        </a>
                      </div>
                      {userTask.pointsReceived !== null ? (
                        <div className="text-gray-700">
                          <div>Points: {userTask.pointsReceived}</div>
                        </div>
                      ) : (
                        <Form method="post">
                          <TextInput
                            label="points"
                            name="points"
                            placeholder="1000"
                            type="number"
                          />
                          <div className="mt-3">
                            <Button type="submit">submit</Button>
                          </div>
                        </Form>
                      )}
                    </div>
                  ) : (
                    <div className="text-gray-700 my-3">
                      <div>Submission</div>
                      {JSON.parse(userTask.submission ?? "").map((x) => (
                        <div>{x}</div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
