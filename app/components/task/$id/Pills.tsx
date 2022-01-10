import { Task } from "@prisma/client";
import React from "react";

type PillsProps = {
  task: Task;
  className?: string;
  containerClassName?: string;
};
const Pills: React.FC<PillsProps> = ({
  task,
  className,
  containerClassName,
}) => {
  return (
    <div className={`flex gap-x-2 ${containerClassName}`}>
      <RetryPill task={task} className={className} />
    </div>
  );
};

const RetryPill: React.FC<PillsProps> = ({ task, className }) => {
  return (
    task.type === "DIRECT" &&
    task.retry && (
      <div
        className={`rounded-full px-3 py-2 bg-white flex items-center gap-x-[5px] text-xs tracking-wide font-bold uppercase text-gray-500 select-none ${className}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 text-exun"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        <span>Retries allowed</span>
      </div>
    )
  );
};

export default Pills;
