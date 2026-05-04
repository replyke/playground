import { Bell } from "lucide-react";

interface NotificationTriggerProps {
  unreadCount: number;
}

const NotificationTrigger = ({ unreadCount }: NotificationTriggerProps) => {
  return (
    <button
      className="text-neutral-400 hover:text-neutral-700 transition-colors p-1.5 rounded-lg hover:bg-neutral-100 cursor-pointer relative"
      aria-label={"Notifications" + (
        unreadCount > 0 ? " (" + unreadCount + " unread)" : ""
      )}
    >
      <Bell size={14} />

      {unreadCount > 0 && (
        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center border-2 border-white">
          {unreadCount > 99 ? "99+" : unreadCount}
        </div>
      )}
    </button>
  );
};

NotificationTrigger.displayName = "NotificationTrigger";

export default NotificationTrigger;
