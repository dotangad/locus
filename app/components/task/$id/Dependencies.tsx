import { Link } from "remix";

const Dependencies = ({ task, className, containerClassName }) => {
  return task.needs?.length > 0 ? (
    <div
      className={`my-2 flex items-center gap-x-2 gap-y-1 flex-wrap ${containerClassName}`}
    >
      <span className="text-gray-500 text-sm">Depends on:</span>
      {/* @ts-ignore */}
      {task.needs.map((task, i) => {
        return (
          <Link
            to={`/tasks/${task.dependency.id}`}
            key={i}
            className={`rounded-full px-3 py-2 bg-white flex items-center gap-x-[5px] text-xs tracking-wide font-bold uppercase text-gray-500 select-none ${className}`}
          >
            {task.dependency.users.length > 0 &&
            !!task.dependency.users[0].completed_at ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-green-700"
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
            ) : (
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
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
            )}
            <span>{task.dependency.title}</span>
          </Link>
        );
      })}
    </div>
  ) : (
    <></>
  );
};

export default Dependencies;
