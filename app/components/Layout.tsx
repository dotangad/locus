import { User } from "@prisma/client";
import React from "react";
import { Link } from "remix";

type LayoutLink = {
  href: string;
  label: string;
};

type LayoutProps = {
  children: React.ReactNode;
  links?: LayoutLink[];
  mainClassName?: string;
  user?: User;
};

const Layout: React.FC<LayoutProps> = ({
  children,
  links,
  mainClassName,
  user,
}: LayoutProps) => {
  links = links ?? [];
  user?.admin && links.push({ href: "/admin", label: "Admin" });
  user?.admin && links.push({ href: "/leaderboard", label: "Leaderboard" });
  user && links.push({ href: "/", label: "Tasks" });

  return (
    <div className="flex flex-col w-full h-full bg-gray-bg min-h-screen">
      <nav className="p-5 sm:px-12 flex justify-between items-center">
        <div>
          <img src="/logo.png" alt="Exun Clan" className="h-16 w-auto" />
        </div>
        <div className="flex items-center justify-center sm:justify-end sm:w-1/3 w-full">
          {links &&
            links.map(({ href, label }: LayoutLink, i) => (
              <Link
                to={href}
                key={i}
                className={
                  "font-bold text-lg sm:text-sm uppercase mx-3 text-exun"
                }
              >
                {label}
              </Link>
            ))}
          {user && (
            <form
              action="/auth/logout"
              method="post"
              className="font-bold text-lg sm:text-sm uppercase mx-3 text-exun"
            >
              <button
                type="submit"
                className="font-bold text-lg sm:text-sm uppercase text-exun"
              >
                Logout
              </button>
            </form>
          )}
        </div>
      </nav>

      <main className={`flex-1 px-2 sm:px-0 ${mainClassName ?? ""}`}>
        {children}
      </main>

      <footer className="flex items-center justify-center py-4 text-gray-500 flex-col text-sm sm:text-xs text-center px-2">
        <div className="text-lg font-bold text-gray-300">
          &bull;&bull;&bull;
        </div>

        <div className="mb-2">
          <a
            href="https://exunclan.com"
            className="font-bold mx-3"
            target="_blank"
            rel="noreferrer"
          >
            Exun Clan
          </a>{" "}
          |{" "}
          <a
            href="https://dpsrkp.net"
            className="font-bold mx-3"
            target="_blank"
            rel="noreferrer"
          >
            DPS RK Puram
          </a>
        </div>
        <div className="mb-2">
          &copy; 2021{" "}
          <a href="https://exunclan.com" target="_blank" rel="noreferrer">
            Exun Clan
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
