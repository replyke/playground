import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Calendar, User as UserIcon } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "./ui/hover-card";
import getUserAvatar from "../utils/getUserAvatar";

interface UserHoverCardProps {
  user: Record<string, unknown>;
  children: ReactNode;
}

export default function UserHoverCard({ user, children }: UserHoverCardProps) {
  const avatar = getUserAvatar((user.id as string) || "");

  return (
    <HoverCard openDelay={500} closeDelay={200}>
      <HoverCardTrigger asChild>
        <span>{children}</span>
      </HoverCardTrigger>
      <HoverCardContent
        className="bg-white rounded-xl shadow-xl border border-gray-200 p-4 w-80 z-50"
        align="start"
      >
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Link
              to={"/u/" + user.id}
              className="hover:opacity-80 transition-opacity"
            >
              <img src={avatar} className="w-10 h-10 rounded-full bg-white shadow-lg" />
            </Link>
            <Link
              to={"/u/" + user.id}
              className="hover:underline font-bold text-gray-900 text-base truncate pb-1"
            >
              @{user.username as string}
            </Link>
          </div>

          {user.bio ? (
            <div>
              <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                {user.bio as string}
              </p>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-gray-500">
              <UserIcon size={14} />
              <span className="text-sm italic">No bio yet</span>
            </div>
          )}

          {!!user.birthdate && (
            <div className="flex items-center space-x-2 text-gray-600">
              <Calendar size={14} />
              <span className="text-sm">
                Born{" "}
                {new Date(String(user.birthdate)).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          )}

          <div className="pt-2 border-t border-gray-100">
            <p className="text-gray-500 text-xs">
              Joined{" "}
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
