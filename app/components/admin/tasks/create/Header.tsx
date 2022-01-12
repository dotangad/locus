import React from "react";
import { useNavigate } from "remix";

export default function () {
  const navigate = useNavigate();
  return (
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
      <div>
        <div className="text-exun font-bold text-xl">Create Task</div>
        <div className="text-gray-500 text-md">
          Submitting this form will create a new task which all users can see.
        </div>
      </div>
    </div>
  );
}
