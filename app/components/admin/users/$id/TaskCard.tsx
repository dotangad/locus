import { UserTask } from "@prisma/client";
import { Link } from "remix";
import Dependencies from "~/components/task/$id/Dependencies";
import Pills from "~/components/task/$id/Pills";

type TaskCard = { task: UserTask };
const TaskCard: React.FC<TaskCard> = ({
  task: { id, completed_at, pointsReceived, createdAt, task },
}) => {
  return (
    <Link
      to={`/admin/usertasks/${id}`}
      className="p-6 bg-white shadow-sm hover:shadow-lg transition flex rounded gap-x-4 items-center my-5"
    >
      <div className="flex-1">
        <div className="text-gray-600 text-xl font-bold">{task.title}</div>
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
          containerClassName="my-2"
        />

        {completed_at ? (
          pointsReceived !== null ? (
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
                {pointsReceived} / {task.points}
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
            <div className="text-gray-600 text-sm">Opened at {createdAt}</div>
          </div>
        )}
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
  );
};

export default TaskCard;
