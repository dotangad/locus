import { Task } from "@prisma/client";
import {
  ActionFunction,
  LoaderFunction,
  useActionData,
  useLoaderData,
} from "remix";
import Layout from "~/components/Layout";
import OpenForm from "~/components/task/$id/OpenForm";
import CompletedCard from "~/components/task/$id/CompletedCard";
import Pills from "~/components/task/$id/Pills";
import Meta from "~/components/task/$id/Meta";
import DirectSubForm from "~/components/task/$id/DirectSubForm";
import { LoaderData, loader as loaderFn } from "~/ext/tasks/$id.loader";
import { action as actionFn } from "~/ext/tasks/$id.action";

export const loader: LoaderFunction = loaderFn;
export const action: ActionFunction = actionFn;

export default function Task() {
  const { task, user, userTask } = useLoaderData<LoaderData>();
  const actionData = useActionData();

  return (
    <Layout user={user}>
      <div className="w-full px-5 mx-auto max-w-screen-lg">
        <div className="w-full my-2">
          <Meta task={task} />
        </div>
        <div className="flex w-full my-2 gap-x-8">
          <div className="flex-1">
            <Pills task={task} />
            <div
              dangerouslySetInnerHTML={{ __html: task.description }}
              className="prose"
            />
          </div>
          <div className="w-1/3">
            <div className="w-full p-5 bg-white rounded shadow-md">
              {userTask ? (
                userTask.completed_at ? (
                  <CompletedCard userTask={userTask} task={task} />
                ) : task.type === "GROUP" ? (
                  <div>group</div>
                ) : (
                  <DirectSubForm error={actionData?.error} />
                )
              ) : (
                <OpenForm taskId={task.id} />
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
