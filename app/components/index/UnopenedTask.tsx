import React from "react";
import { Task } from "@prisma/client";
import Button from "../Button";
import { Form, Link } from "remix";

type TaskProps = {
  task: Task;
};
const UnopenedTask: React.FC<TaskProps> = ({ task }: TaskProps) => {
  return (
    <div className="bg-white shadow-md my-5 rounded whitespace-pre-wrap max-w-screen-md w-full mx-auto p-5">
      <div className="text-gray-700 text-2xl font-bold">{task.title}</div>

      <div className="mt-1 text-gray-500 uppercase font-bold text-sm flex gap-x-2">
        <span>{task.points} points</span>
        <span className="font-extrabold">&middot;</span>
        <span>{task.type}</span>
        <span className="font-extrabold">&middot;</span>
        <span>{JSON.parse(task.tags).join(", ")}</span>
      </div>

      <div className="flex items-center w-full mt-5 gap-x-3">
        {task.showTask ? (
          <Link
            {...{
              to: `/tasks/${task.id}`,
              disabled: !task.showTask,
              className: `cursor-pointer bg-exun block rounded-lg p-4 text-center uppercase leading-none font-bold text-sm text-white transition outline-exun-light !focus:outline-8 focus:shadow-none disabled:bg-gray-600 disabled:cursor-not-allowed`,
            }}
          >
            View
          </Link>
        ) : (
          <Button disabled={true}>View</Button>
        )}
        <Form method="post" action="/tasks/open">
          <input type="hidden" name="id" value={task.id} />
          <Button type="submit">Open</Button>
        </Form>
      </div>

      {/*<div
        dangerouslySetInnerHTML={{ __html: task.description }}
        className="prose my-5"
        />*/}
      {/*<pre>{JSON.stringify(task, null, 2)}</pre>*/}
    </div>
  );
};

export default UnopenedTask;