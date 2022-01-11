import { Session } from "@prisma/client";

type SessionCardProps = { session: Session };
const SessionCard: React.FC<SessionCardProps> = ({
  session: { ip, lastSeen, createdAt, active, logoutAt, userAgent },
}) => {
  return (
    <div
      className={`rounded ${
        active ? "bg-white" : "bg-gray-300"
      } p-6 my-4 flex flex-col gap-y-4`}
    >
      {[
        ["IP Address", ip],
        ["User Agent", userAgent],
        ["Last Seen", lastSeen],
        ["Logged in at", createdAt],
        ["Active", active ? "Yes" : "No"],
        ["Logged out at", logoutAt ? logoutAt : "Session active"],
      ].map(([label, value], i) => (
        <div key={i}>
          <div className="text-xs font-bold text-gray-500 uppercase">
            {label}
          </div>
          <div className="text-gray-700">{value}</div>
        </div>
      ))}
    </div>
  );
};

export default SessionCard;
