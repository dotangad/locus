import React from "react";
import { Task, UserTask } from "@prisma/client";
import { Link } from "remix";
import Pills from "../task/$id/Pills";
import Dependencies from "../task/$id/Dependencies";

type TaskProps = {
  userTask: UserTask & { task: Task };
};
const OpenedTask: React.FC<TaskProps> = ({
  userTask: { task, ...userTask },
}: TaskProps) => {
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

      <div className="mt-2">
        <Pills task={task} className="!bg-gray-100" />
      </div>

      <Dependencies
        task={task}
        className="!bg-gray-100"
        containerClassName=""
      />

      {task.open &&
        (userTask.completed_at ? (
          userTask.pointsReceived !== null ? (
            <div className="flex items-center w-full mt-5 gap-x-2 text-gray-600">
              <div className="text-green-700 font-bold flex items-center uppercase gap-x-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Completed</span>
              </div>
              <div>&middot;</div>
              <div>
                {userTask.pointsReceived} / {task.points}
              </div>
            </div>
          ) : (
            <div className="flex items-center w-full mt-5 gap-x-2 text-gray-600">
              <div className="text-green-700 font-bold flex items-center uppercase gap-x-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Completed</span>
              </div>
              <div>&middot;</div>
              <div>Unchecked</div>
            </div>
          )
        ) : (
          <div className="flex items-center w-full mt-5 gap-x-3">
            <Link
              {...{
                to: `/tasks/${task.id}`,
                disabled: !task.showTask,
                className: `cursor-pointer bg-exun block rounded-lg p-4 text-center uppercase leading-none font-bold text-sm text-white transition outline-exun-light !focus:outline-8 focus:shadow-none disabled:bg-gray-600 disabled:cursor-not-allowed`,
              }}
            >
              View
            </Link>
            <div className="text-gray-600 text-sm">
              Opened at {userTask.createdAt}
            </div>
          </div>
        ))}
    </div>
  );
};

export default OpenedTask;
