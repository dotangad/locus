import { User } from "@prisma/client";
import { useNavigate } from "remix";

type UserCardProps = { user: User };
const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const navigate = useNavigate();
  return (
    <div className="my-8 flex items-center gap-x-3 bg-white rounded p-6">
      <div
        className="rounded-xl flex items-center justify-center p-3 bg-gray-100 cursor-pointer shadow-md hover:shadow-xl transition"
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
        <div className="text-exun font-bold text-xl">{user.schoolName}</div>
        <div className="text-md flex gap-x-2 mt-1 text-gray-500">
          <span>{user.email}</span>
          <span className="font-extrabold">&middot;</span>
          <span>{user.points} Points</span>
          {user.admin && (
            <>
              <span className="font-extrabold">&middot;</span>
              <span>Admin</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserCard;
