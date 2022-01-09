import { Task, UserTask } from "@prisma/client";

type CompletedCardProps = { userTask: UserTask; task: Task };
const CompletedCard: React.FC<CompletedCardProps> = ({ userTask, task }) => {
  return userTask.pointsReceived || userTask.pointsReceived === 0 ? (
    <div>
      <div className="flex items-center mb-5 font-bold text-green-700 uppercase text-md gap-x-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>Completed</span>
      </div>
      <div className="text-lg font-bold text-gray-500">
        {userTask.pointsReceived} / {task.points} Points
      </div>
    </div>
  ) : (
    <div>
      <div className="flex items-center mb-5 font-bold text-green-700 uppercase text-md gap-x-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>Completed</span>
      </div>
      <div className="text-gray-500 font-bold text-lg">Unchecked</div>
    </div>
  );
};

export default CompletedCard;
