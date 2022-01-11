import React from "react";
import { Task } from "@prisma/client";
import Button from "../Button";
import { Form, Link } from "remix";
import Pills from "../task/$id/Pills";
import Dependencies from "../task/$id/Dependencies";

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

      <div className="my-2">
        <Pills task={task} className="!bg-gray-100" />
      </div>

      <Dependencies
        task={task}
        className="!bg-gray-100"
        containerClassName=""
      />

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
        {task.canOpen && task.open ? (
          <Form method="post" action="/tasks/open">
            <input type="hidden" name="id" value={task.id} />
            <Button type="submit">Open</Button>
          </Form>
        ) : (
          <Button disabled={true}>Open</Button>
        )}
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
