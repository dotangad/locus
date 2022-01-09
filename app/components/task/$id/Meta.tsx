import React from "react";
import { Task } from "@prisma/client";

type MetaProps = { task: Task };
const Meta: React.FC<MetaProps> = ({ task }) => {
  return (
    <>
      <div className="text-2xl font-bold text-gray-700 sm:text-4xl">
        {task.title}
      </div>
      <div className="flex mt-1 text-sm font-bold text-gray-500 uppercase gap-x-2">
        <span>{task.points} points</span>
        <span className="font-extrabold">&middot;</span>
        <span>{task.type}</span>
        <span className="font-extrabold">&middot;</span>
        <span>{JSON.parse(task.tags).join(", ")}</span>
      </div>
    </>
  );
};

export default Meta;
